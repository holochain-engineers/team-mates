import { Injectable, OnDestroy } from "@angular/core";
import { environment } from 'src/environments/environment';
import { AppSignalCb, AppSignal, AppWebsocket, CellId, InstalledCell, AppInfo, CellInfo, RoleName, CellType, CellProvisioningStrategy, ProvisionedCell, AppAgentWebsocket, ClonedCell, AgentPubKey, AppAgentClient } from '@holochain/client'
import { Dictionary, fakeCellId, fakeDNAModifiers, serializeHash } from "../helpers/utils";


export enum ConnectionState{
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED
}

export type SignalCallback = {cell_name:string, zome_name:string, cb_fn:AppSignalCb }
declare type Cell = ProvisionedCell | ClonedCell

//choice of Datastructure 
// - use a TS Map when you need to manage entries of dynamically changing collection
// - use a TS Record when you need a dictionary with predefined / resticted keys and for set and read usage
// - use a TS Dictionary (index sig) when you need a dictionary with undetermined keys and for set and read usage (tick)

//tsconfig: "allowSyntheticDefaultImports": true,
@Injectable({
  providedIn: "root"
})
export class HolochainService implements OnDestroy{
  appWS!: AppAgentWebsocket
  protected appInfo!: AppInfo 
  protected _cellData!: Dictionary<Dictionary<Cell>> //Record<RoleCellName,CellInfo[]> = {} //Record<RoleName, Array<CellInfo>>;
  protected signalCallbacks: SignalCallback[] = []

  get_pub_key_from_cell(cell_name:string):AgentPubKey {
    let res = undefined
    Object.values(this._cellData).forEach((cellDict) => { 
      Object.values(cellDict).forEach((cell) => {
      if (cell.name == cell_name)
        res = cell.cell_id[1]
      })
    })
    if (res == undefined)
      throw("cell with name: "+cell_name+" not found")
    return res
  }

  get_installed_cells(){
    return this._cellData
  }

  //here we determine what receptor API's to use 
  get_receptors_for_cell(cell_name:string):string[]{
    switch (cell_name) {
      case "team-mates": return ['profiles','invitations']
      default: return []
    }
  }

  getCellNameFromDNAHash(dnahash:Uint8Array):string{
    let res = undefined
    Object.values(this._cellData).forEach((cellDict) => { 
      Object.values(cellDict).forEach((cell) => {
      if (cell.cell_id[0] == dnahash)
        res = cell.name
      })
    })
    if (res == undefined)
      throw("cell name with dna Hash: "+dnahash+" not found")
    return res
    /*
    for(let role in this.appInfo.cell_info){  //[environment.ROLE_ID]){
          let cellInfo = this.appInfo.cell_info[role]
    };
    return undefined*/
  }

  protected getCellId(role_name:string, cell_name:string):CellId | undefined {
    let cellID = undefined
    Object.entries(this._cellData).forEach(([role, cellDict]) => {
      if (role_name == role){
        Object.values(cellDict).forEach((cell)=>{
          if (cell_name == cell.name)
            cellID = cell.cell_id
        })
      }
    })
    if (cellID == undefined)
      throw("cell name with role name: "+role_name+" and cell name "+cell_name+" not found")
    return cellID
  }

  //abstract away from cell types which dont currently apply
  protected getCellDataFromAppInfo(appInfo:AppInfo):Dictionary<Dictionary<Cell>>{
    let dict:Dictionary<Dictionary<Cell>> = {}
    Object.entries(appInfo.cell_info).forEach(([role, cellInfoArr]) => {
      let data = cellInfoArr.forEach((cellInfo) => {
        Object.entries(cellInfo).forEach(([celltype,cell]) => {
          switch (celltype) {
            case "provisioned":
              dict[role] = {[(cell as ProvisionedCell).name] :(cell as ProvisionedCell)}
              break;
            case "cloned":
              dict[role] = {[(cell as ClonedCell).name] : (cell as ClonedCell)}
              break;
            default:
              break;
          }
        })
      })
    });
    return dict
  }

    //if this doesnt return a resolved promise.. the app will not bootstrap  
    async init():Promise<void>{ //called by the appModule at startup
        sessionStorage.clear()
          try{
            console.log("Connecting to holochain")
            this.appWS =  await AppAgentWebsocket.connect(environment.HOST_URL,environment.APP_ID,1500)
            //const appWSp =  await AppWebsocket.connect(environment.HOST_URL,1500)
            this.appWS.on("signal",(s)=>this.signalHandler(s))
            this.appInfo = await this.appWS.appInfo()//{ installed_app_id: environment.APP_ID});
            this._cellData = this.getCellDataFromAppInfo(this.appInfo)
            console.log("Connected to holochain",this._cellData,this.appInfo.cell_info)
            console.log("app status",this.appInfo.status)
            const [statusData] = Object.entries(this.appInfo.status)
            sessionStorage.setItem("status","HOLOCHAIN:"+statusData[0]+" "+(statusData[1] ? statusData[1] : ''))
          }catch(error){
              console.error(error)
              console.log("inside mock")
              //if (environment.mock){
                sessionStorage.setItem("status","mock")
                this._cellData = { ["myRole"] : {["team-mates"] : {cell_id: fakeCellId, dna_modifiers: fakeDNAModifiers, name: "profiles"}},
                                   ["myRole2"] : {["team-mates"] : {cell_id: fakeCellId, dna_modifiers: fakeDNAModifiers, name: "invitations"}}
                }
                return Promise.resolve()
           //   }
        }
    }

     call(role:string,cellname:string, zome:string, fn_Name:string, payload:any, timeout=15000): Promise<any>{
       const cellId = this.getCellId(role,cellname)
       if (!cellId) throw new Error("cell not found:"+cellname);
        return this.appWS.callZome(
          {
            cap_secret: null,
            cell_id: cellId,
            zome_name: zome,
            fn_name: fn_Name,  //will always be execute
            payload: payload,  // specify actually commmand function call
            provenance: cellId[1],
          },
        timeout
        );
      }

    /* in the future 'zome_name' and 'cell_name' should be meta-data of AppSignal and Not part of the payload*/
    signalHandler(signal: AppSignal): void {
      if(this.signalCallbacks.length > 0){
        for (const cb of this.signalCallbacks) {
          console.log("cb data: ",cb)
          var signalCellName = this.getCellNameFromDNAHash(signal.cell_id[0])
          if (cb.cell_name == signalCellName && cb.zome_name == signal.zome_name){
            console.log("signal callback found, executing cb function: ")
            cb.cb_fn(signal)
            return
          }
        }
        console.log("Signal handler for signal was not found",signal)
      }
    }

    registerCallback(cell_name:string, zomes: string[], handler:AppSignalCb){
      zomes.forEach(zome => {
        this.signalCallbacks.push({cell_name:cell_name, zome_name:zome, cb_fn:handler})
      });
    }

    //TODO add event listener and relay state change back to UI
    getConnectionState():string{
     if (this.appWS && this.appWS.appWebsocket){
      return ConnectionState[this.appWS.appWebsocket.client.socket.readyState]
    } else
      return ConnectionState[3]
    }

    ngOnDestroy(){
      this.appWS.appWebsocket.client.close();
    }

}

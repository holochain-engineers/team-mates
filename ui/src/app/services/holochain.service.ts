import { Injectable, OnDestroy } from "@angular/core";
import { environment } from '@environment';
//import { HolochainClient  } from '@holochain-open-dev/cell-client'
import { AppSignalCb, AppSignal, AppWebsocket, CellId, InstalledCell } from '@holochain/conductor-api'
import { Dictionary, serializeHash } from "../helpers/utils";

export declare type payloadCb = (payload: any) => void;

export enum ConnectionState{
  OPEN,
  CLOSED,
  CLOSING,
  CONNECTING
}
//tsconfig: "allowSyntheticDefaultImports": true,
@Injectable({
  providedIn: "root"
})
export class HolochainService implements OnDestroy{
  protected appWS!: AppWebsocket 
  protected cellData!: InstalledCell[] 
  protected zomeCallbacks: Dictionary<AppSignalCb> = {}
  // public cellClient!: HolochainClient

 constructor(
  //protected appWebsocket: AppWebsocket,
  //protected cellData: InstalledCell
 ){}

  get_pub_key_from_cell(cell:string):string | undefined {
    for(let installedcell of this.cellData){
      //console.log(serializeHash(installedcell.cell_id[0]))
     // console.log(installedcell.role_id)
      if (installedcell.role_id == cell)
        return serializeHash(installedcell.cell_id[1])
    };
    return undefined
  }

  protected getCellId(cell:string):CellId | undefined {
    for(let installedcell of this.cellData){
      //console.log(serializeHash(installedcell.cell_id[0]))
      //console.log(installedcell.role_id)
      if (installedcell.role_id == cell)
        return installedcell.cell_id
    };
    return undefined
  }

    async init(){ //called by the appModule at startup
        if (!environment.mock){
          try{
            console.log("Connecting to holochain")
            //const appWs = await this.appWebsocket.connect("ws://localhost:8888");
               this.appWS =  await AppWebsocket.connect(environment.HOST_URL,1500, this.signalHandler)
                //signal => {
                 // const payload = signal.data.payload;
                  //if (payload.OfferReceived) {
                    //this.tstore.storeOffer(payload.OfferReceived);
               // })
                //.then(async (connection)=>{
                //this.hcConnection = connection
                const appInfo = await this.appWS.appInfo({ installed_app_id: environment.APP_ID});
                this.cellData = appInfo.cell_data;
                //this.cellClient = new HolochainClient(connection, cellData);
                ///this.cellId = appInfo.cell_data[0].cell_id;
                //this.pstore.myAgentPubKey = serializeHash(this.cellId[1])
                console.log("Connected to holochain",appInfo.cell_data)
              //})
          }catch(error){
              console.error("Holochain connection failed:")
              throw(error)
          }
        } else {
         // this.pstore.myAgentPubKey = "DEFAULT_KEY"
          console.log("you are in Mock mode.. no connections made!")
        }
    }

     call(cell:string, zome:string, fn_Name:string, payload:{}|null, timeout=15000): Promise<any>{
       const cellId = this.getCellId(cell)
       if (!cellId) throw new Error("cell not found");
        return this.appWS.callZome(
          {
            cap: null as any,
            cell_id: cellId,
            zome_name: zome,
            fn_name: fn_Name,
            payload: payload,
            provenance: cellId[1],
          },
        timeout
        );
      }

    // in the future zome_name should be a property of AppSignal
    signalHandler(signal: AppSignal): void {
      console.log("zomecallbacks:",this.zomeCallbacks)
      console.log("what is this?: ",signal.type)
      for (const [zome, appCB] of Object.entries(this.zomeCallbacks)) {
        if (signal.data.payload.zome_name == zome) {
          appCB(signal.data.payload)
          break;
        }
      }
    }

    registerCallback(zome_name: string, handler:payloadCb){
      this.zomeCallbacks[zome_name]= handler
    }


    getConnectionState(){
      return ConnectionState[this.appWS.client.socket.readyState]
    }

    ngOnDestroy(){
      this.appWS.client.close();
    }

}

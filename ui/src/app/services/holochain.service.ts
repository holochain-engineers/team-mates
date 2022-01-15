import { Injectable, OnDestroy } from "@angular/core";
import { environment } from '@environment';
import { AppSignalCb, AppSignal, AppWebsocket, CellId, InstalledCell } from '@holochain/client'
import { Dictionary, serializeHash } from "../helpers/utils";


export enum ConnectionState{
  OPEN,
  CLOSED,
  CLOSING,
  CONNECTING
}

export type SignalCallback = {cell_name:string, zome_name:string, cb_fn:AppSignalCb }

//tsconfig: "allowSyntheticDefaultImports": true,
@Injectable({
  providedIn: "root"
})
export class HolochainService implements OnDestroy{
  protected appWS!: AppWebsocket 
  protected cellData!: InstalledCell[] 
  protected signalCallbacks: SignalCallback[] = []

  get_pub_key_from_cell(cell:string):string | undefined {
    for(let installedcell of this.cellData){
      if (installedcell.role_id == cell)
        return serializeHash(installedcell.cell_id[1])
    };
    return undefined
  }

  protected getCellId(cell:string):CellId | undefined {
    for(let installedcell of this.cellData){
      if (installedcell.role_id == cell)
        return installedcell.cell_id
    };
    return undefined
  }

    async init(){ //called by the appModule at startup
        if (!environment.mock){
          try{
            console.log("Connecting to holochain")
            this.appWS =  await AppWebsocket.connect(environment.HOST_URL,1500, (s)=>this.signalHandler(s))
            const appInfo = await this.appWS.appInfo({ installed_app_id: environment.APP_ID});
            this.cellData = appInfo.cell_data;
            console.log("Connected to holochain",appInfo.cell_data)
          }catch(error){
              console.error("Holochain connection failed:")
              throw(error)
          }
        } else {
          console.log("you are in Mock mode.. no connections made!")
        }
    }

     call(cell:string, zome:string, fn_Name:string, payload:any, timeout=15000): Promise<any>{
       const cellId = this.getCellId(cell)
       if (!cellId) throw new Error("cell not found:"+cell);
        return this.appWS.callZome(
          {
            cap_secret: null,
            cell_id: cellId,
            zome_name: zome,
            fn_name: fn_Name,
            payload: payload,
            provenance: cellId[1],
          },
        timeout
        );
      }

    /* in the future zome_name should be a property of AppSignal*/
    signalHandler(signal: AppSignal): void {
     // console.log("what is this?: ",signal)
      if(this.signalCallbacks.length > 0){
        for (const cb of this.signalCallbacks) {
          console.log("cb data: ",cb)
          if (cb.cell_name == signal.data.payload.cell && cb.zome_name == signal.data.payload.zome){
            console.log("signal callback found, executing cb function: ")
            cb.cb_fn(signal.data.payload)
            return
          }
        }
        console.log("Signal handler for signal was not found",signal)
      }
    }

    registerCallback(cell_name:string, zome_name: string, handler:AppSignalCb){
      this.signalCallbacks.push({cell_name:cell_name,zome_name:zome_name,cb_fn:handler})
    }


    getConnectionState(){
      return ConnectionState[this.appWS.client.socket.readyState]
    }

    ngOnDestroy(){
      this.appWS.client.close();
    }

}


import { HolochainService } from '../services/holochain.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { mockHolonDescriptorArray, HolonDescriptor } from '../models/typedescriptor';


@Injectable()
export class TypeDescriptorReceptor {
  private _cellname!:string
  private _role!:string
  private _zomes:string[] = ["hc_zome_coordinator_externs"]
  public signalReceived$ = new Subject<HolonDescriptor>()  //todo polymorphise generic type <TypeDescriptor>

 
  constructor(private hcs:HolochainService){
  }

  registerCallback(role:string, cellname:string){
    this._role = role
    this._cellname = cellname
    this.hcs.registerCallback(cellname,this._zomes, (s)=>this.signalHandler(s))
  }

  getAllTypeDescriptors(): Promise<HolonDescriptor[]> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<HolonDescriptor[]>((resolve) => {setTimeout(()=> resolve(mockHolonDescriptorArray),2000)})
    else
      return this.callCell('get_all_holontypes', 'hc_zome_coordinator_externs', null); //TODO new cell api should provide function and zome names dynamically
  }

  private callCell(fn_name: string, zome_name:string, payload: any): Promise<any> {
    return this.hcs.call(this._role, this._cellname, zome_name, fn_name, payload);
  }

  //future.. make dynamic hashmap lookup
  private signalHandler(payload: any) {
    //console.log("handler called",payload)
    switch (payload.name) {
      case 'newholon':
        this.signalReceived$.next(payload.data.SignalReceived);
        break;

      default:
        break;
    }
  }
}
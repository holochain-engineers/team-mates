import { ComponentStore } from '@ngrx/component-store';
import { HolochainService } from './holochain.service';
import { Dictionary, serializeHash } from '../helpers/utils';
//import { HolonStore } from '../stores/holon.store';
//import { HolonReceptor } from '../receptors/invitation.receptor';
import { inject, Inject, Injectable, InjectionToken, Injector, Provider } from '@angular/core';
//import { TypeDescriptorStore } from '../stores/typedescriptor.store';
//import { TypeDescriptorReceptor } from '../receptors/typedescriptor.receptor';
import { environment } from 'src/environments/environment';
import { ProfileStore } from '../stores/profile.store';
import { ProfileReceptor } from '../receptors/profile.receptor';
import { InvitationStore } from '../stores/invitation.store';
import { InvitationReceptor } from '../receptors/invitation.receptor';
//import { ProfilesClient, ProfilesStore } from '@holochain-open-dev/profiles';


//TODO: change this into an abstract class.. with a private constructor and static functions
// and rename to Receptor service

// we assume a unique human readable key for the cell dictionary - roleName:cellName
// rolename is the behaviour of the cell in the tissue and cellname is the instance 
function invitationStoreFactory(hcs: HolochainService){
  const celldata = hcs.get_installed_cells()
  console.log(celldata)
  let store: InvitationStore | undefined = undefined
  for (let role in celldata) {
    let cells = celldata[role]
    Object.keys(cells).forEach((cellname)=>{
      if (hcs.get_receptors_for_cell(cellname).includes("invitations")) {
        let receptor = new InvitationReceptor(hcs)
        receptor.registerCallback(role,cellname)
        store = new InvitationStore(receptor)
      }
    })
  }
  if (!store)
    throw ("no invitation store found")
  return store
};

//currently just works for one role
function profileStoreFactory(hcs: HolochainService){
  const celldata = hcs.get_installed_cells()
  console.log(celldata)
  let store: ProfileStore | undefined = undefined
  for (let role in celldata) {
    let cells = celldata[role]
    Object.keys(cells).forEach((cellname)=>{
      if (hcs.get_receptors_for_cell(cellname).includes("profiles")) {
          const receptor = new ProfileReceptor(hcs) //new ProfilesClient(hcs.appWS,role)//n
          receptor.registerCallback(role, cellname)
          store = new ProfileStore(receptor)//new ProfilesStore(receptor);
        }
    })
  }
  if (!store)
    throw ("no profiles store found")
  return store
};

export const ProfileStoreProvider = {
    provide: ProfileStore,
    useFactory: profileStoreFactory,
    deps: [HolochainService]
}

// specific holon cell - TODO inject factory with selected provider
export const InvitationStoreProvider =
{ provide: InvitationStore,
    useFactory: invitationStoreFactory,
    deps: [HolochainService]
};

//all holon cells
export function InvitationStoreProviders():Provider{
  return  { provide: InvitationStore,
      useFactory: invitationStoreFactory,
      deps: [HolochainService],
      multi: true
    }
}

  

@Injectable({
  providedIn:'root'
}) 
export class StoreFactory {
  private _store_dictionary: Dictionary<ComponentStore<any>|undefined> = {}
  private _selectedStore:string = ""

  constructor(private hcs:HolochainService){
    const cells = hcs.get_installed_cells()
    for (const role in cells) {
      switch(role) {  
        case "holon": this._store_dictionary[role+":"+"blah"] = undefined//serializeHash(Object.values(cells[role])[0].cell_id[1])] = undefined// new HolonStore(hcs)
      }
    }
  }

  //holon:space1 or holon:space2
  get_store(index:string){
    return this._store_dictionary[index]
  }

  getDictionarykeys():string[]{
    return Object.keys(this._store_dictionary)
  }

  setSelectedStore(key:string){
    this._selectedStore = key
  }

  getSelectedStore():ComponentStore<any>{
    //if (this._store_dictionary[this._selectedStore])
    //  return this._store_dictionary[this._selectedStore]!
    //else {
      const receptor = new InvitationReceptor(this.hcs)
      //receptor.registerCallback(this.getDictionarykeys()[0])// _selectedStore)
      return new InvitationStore(receptor)
      //this._store_dictionary[this._selectedStore] = new HolonStore(receptor)
      //return this._store_dictionary[this._selectedStore]!
   // }
  }


  //todo dynamic add cells function
}

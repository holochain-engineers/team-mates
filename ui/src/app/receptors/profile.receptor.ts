
import { HolochainService } from '../services/holochain.service';
//import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inject, Injectable } from '@angular/core';
import { AgentProfile, Profile, mock1AgentProfile, mock1Profile, mockAgentProfiles, mockAgents, mockMyAgentProfile } from '../models/profile';
import { AppSignal , AgentPubKey, Record} from '@holochain/client';
import { decode } from '@msgpack/msgpack';


@Injectable()
export class ProfileReceptor {
  private _cellname!:string
  private _role!:string
  private _zomes:string[] = ["profiles"]
  private _agent_pub_key?:Uint8Array
  //private hcs = Inject(HolochainService)
  //public signalReceived$ = new Subject<HolonDescriptor>()  //todo polymorphise generic type <TypeDescriptor>

 
 constructor(private hcs:HolochainService){}

  registerCallback(role:string, cellname:string){
    this._role = role
    this._cellname = cellname
    this.hcs.registerCallback(cellname,this._zomes, (s:AppSignal)=>this.signalHandler(s))
  }

  getMyAgentkey():Uint8Array{
    if (this._agent_pub_key)
      return this._agent_pub_key
    if (environment.mock || sessionStorage.getItem("status") == "mock"){ 
      this._agent_pub_key = mockMyAgentProfile.agentPubKey
      return mockMyAgentProfile.agentPubKey
    }
    this._agent_pub_key = this.hcs.get_pub_key_from_cell(this._cellname)
    if (!this._agent_pub_key)
      throw ("agent key undefined")
    return this._agent_pub_key
  }

  /*getMyProfile(): Promise<AgentProfile | undefined>{
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile | undefined>((resolve) => {
        setTimeout(()=> {
          const response: AgentProfile = {agentPubKey:mockMyAgentProfile.agentPubKey,profile:mockMyAgentProfile.profile}
          resolve(response)},500)
      })
    return this.callCell('get_my_profile',"profiles",null);
  }*/

  async getProfile(agentPubKey: AgentPubKey): Promise<Profile | undefined> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<Profile>((resolve) => {setTimeout(()=> resolve(mock1Profile),1000)})
    const record = await this.callCell('get_agent_profile', "profiles", agentPubKey);
    if (!record)
      return undefined
    const entry = (record.entry as any)?.Present?.entry;
    return (decode(entry) as Profile)
  }

  getAgentsProfiles(agentPubKeys: AgentPubKey[]): Promise<AgentProfile[]> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile[]>((resolve) => {setTimeout(()=> resolve(mockAgentProfiles),1000)})
    return this.callCell('get_agents_profile','profiles', agentPubKeys);
  }

  searchProfiles(nicknamePrefix: string): Promise<AgentProfile[]> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile[]>((resolve) => {setTimeout(()=> resolve(mockAgentProfiles),1000)})
    return this.callCell('search_profiles','profiles', {nickname_prefix: nicknamePrefix});
  }

  getAgentsWithProfiles(): Promise<AgentPubKey[]> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentPubKey[]>((resolve) => {setTimeout(()=> resolve([...mockAgents]),1000)})
    return this.callCell('get_agents_with_profile','profiles', null);
  }

  createProfile(newprofile: Profile): Promise<void> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<void>((resolve) => {setTimeout(()=> resolve(),1000)}) //{agentPubKey:this.getMyAgentkey(),profile:newprofile}),1000)})
    return this.callCell('create_profile','profiles', newprofile);
    //return new Promise<AgentProfile>((resolve) => {setTimeout(()=> resolve({agentPubKey:this.getMyAgentkey(),profile:newprofile}),1000)})
  }

  updateProfile(newprofile: Profile): Promise<Profile> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<Profile>((resolve) => {setTimeout(()=> resolve(newprofile),1000)})
    return this.callCell('update_profile','profiles', newprofile);
  }

  
  getNetworkStatus():string {
    return this.hcs.getConnectionState()
  }
 //TODO new cell api should provide function and zome names dynamically


  private callCell(fn_name: string, zome_name:string, payload: any): Promise<any> {
    return this.hcs.call(this._role, this._cellname, zome_name, fn_name, payload);
  }

  //future.. make dynamic hashmap lookup
  private signalHandler(payload: any) {}
  
}
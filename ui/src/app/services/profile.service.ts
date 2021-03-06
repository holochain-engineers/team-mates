import { HolochainService } from './holochain.service';
import { Injector } from '@angular/core';
import { environment } from '@environment';
import { AgentProfile, Profile, mockMyAgentProfile, mock1AgentProfile, mockAgentProfiles } from '../models/profile';
import { AgentPubKeyB64 } from '@holochain-open-dev/core-types';

//multiple instance per cell
export class ProfileService {
  private _cellName:string
  private _zomeName:string = 'profiles'
  private _holochainService:HolochainService
  private _agent_pub_key?: string //= "DEFAULT_KEY"

  constructor(private injector:Injector, cellname:string) {
    this._cellName = cellname
    this._holochainService = this.injector.get(HolochainService)
    this._holochainService.registerCallback(cellname, this._zomeName, (s)=>this.signalHandler(s))
  }

  getMyAgentkey(){
    if (environment.mock || sessionStorage.getItem("status") == "mock"){ 
      this._agent_pub_key = mockMyAgentProfile.agentPubKey
      return mockMyAgentProfile.agentPubKey
    }
    this._agent_pub_key = this._holochainService.get_pub_key_from_cell(this._cellName)
    return this._agent_pub_key
  }

  getMyProfile(): Promise<AgentProfile | undefined>{
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile | undefined>((resolve) => {
        setTimeout(()=> {
          const response: AgentProfile = {agentPubKey:mockMyAgentProfile.agentPubKey,profile:mockMyAgentProfile.profile}
          resolve(response)},500)
      })
    return this.callZome('get_my_profile', null);
  }

  getAgentProfile(agentPubKey: AgentPubKeyB64): Promise<AgentProfile> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile>((resolve) => {setTimeout(()=> resolve(mock1AgentProfile),1000)})
    return this.callZome('get_agent_profile', agentPubKey);
  }

  getAgentsProfiles(agentPubKeys: AgentPubKeyB64[]): Promise<AgentProfile[]> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile[]>((resolve) => {setTimeout(()=> resolve(mockAgentProfiles),1000)})
    return this.callZome('get_agents_profile', agentPubKeys);
  }

  searchProfiles(nicknamePrefix: string): Promise<AgentProfile[]> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile[]>((resolve) => {setTimeout(()=> resolve(mockAgentProfiles),1000)})
    return this.callZome('search_profiles', {nickname_prefix: nicknamePrefix});
  }

  getAllProfiles(): Promise<AgentProfile[]> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile[]>((resolve) => {setTimeout(()=> resolve([...mockAgentProfiles]),1000)})
    return this.callZome('get_all_profiles', null);
  }

  createProfile(newprofile: Profile): Promise<AgentProfile> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile>((resolve) => {setTimeout(()=> resolve({agentPubKey:this._agent_pub_key!,profile:newprofile}),1000)})
    return this.callZome('create_profile', newprofile);
  }

  updateProfile(newprofile: Profile): Promise<AgentProfile> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<AgentProfile>((resolve) => {setTimeout(()=> resolve({agentPubKey:this._agent_pub_key!,profile:newprofile}),1000)})
    return this.callZome('update_profile', newprofile);
  }

  getNetworkStatus():string {
    return this._holochainService.getConnectionState()
  }

  private callZome(fn_name: string, payload: any) {
    return this._holochainService.call(this._cellName, this._zomeName, fn_name, payload);
  }

  //profiles does not currently have any signals
  private signalHandler(payload: any) {}
  

    //subscribe_to_cell(cell:string){
  //  this._cellName = cell
   // this._holochainService.registerCallback(cell, this._zomeName, (s)=>this.signalHandler(s))
  //}
}

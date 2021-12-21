import { HolochainService } from './holochain.service';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { AgentProfile, Profile, mockMyAgentProfile, mock1AgentProfile, mockAgentProfiles } from '../models/profile';
import { AgentPubKeyB64 } from '@holochain-open-dev/core-types';

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  public zomeName = 'profiles'
  private cellName = 'profile_invitation'
  public agent_pub_key?: string //= "DEFAULT_KEY"

  constructor(private hcs:HolochainService) { }

  getMyAgentkey(){
    if (environment.mock){ 
      this.agent_pub_key = mockMyAgentProfile.agent_pub_key
      return mockMyAgentProfile.agent_pub_key
    }
    this.agent_pub_key = this.hcs.get_pub_key_from_cell(this.cellName)
    return this.agent_pub_key
  }

  getMyProfile(): Promise<AgentProfile | undefined>{
    if (environment.mock)
      return new Promise<AgentProfile | undefined>((resolve) => {
        setTimeout(()=> {
          const response: AgentProfile = {agent_pub_key:mockMyAgentProfile.agent_pub_key,profile:mockMyAgentProfile.profile}
          resolve(response)},1000)
      })
    return this.callZome('get_my_profile', null);
  }

  /*getMyProfile(): Promise<Observable<AgentProfile>> {
    //let mock = undefined
    if (environment.mock)
      return new Promise<Observable<AgentProfile>>((resolve) => {
        setTimeout(()=> {
          this.agent_pub_key = mockMyAgentProfile.agent_pub_key
          resolve(of(mockMyAgentProfile))},3000)
      })
    return this.callZome('get_my_profile', null).then();
  }*/

  getAgentProfile(agentPubKey: AgentPubKeyB64): Promise<AgentProfile> {
    if (environment.mock)
      return new Promise<AgentProfile>((resolve) => {setTimeout(()=> resolve(mock1AgentProfile),2000)})
    return this.callZome('get_agent_profile', agentPubKey);
  }

  getAgentsProfiles(agentPubKeys: AgentPubKeyB64[]): Promise<AgentProfile[]> {
    if (environment.mock)
      return new Promise<AgentProfile[]>((resolve) => {setTimeout(()=> resolve(mockAgentProfiles),2000)})
    return this.callZome('get_agents_profile', agentPubKeys);
  }

  searchProfiles(nicknamePrefix: string): Promise<AgentProfile[]> {
    if (environment.mock)
      return new Promise<AgentProfile[]>((resolve) => {setTimeout(()=> resolve(mockAgentProfiles),2000)})
    return this.callZome('search_profiles', {nickname_prefix: nicknamePrefix});
  }

  getAllProfiles(): Promise<AgentProfile[]> {
    if (environment.mock)
      return new Promise<AgentProfile[]>((resolve) => {setTimeout(()=> resolve([...mockAgentProfiles]),2000)})
    return this.callZome('get_all_profiles', null);
  }

  createProfile(newprofile: Profile): Promise<AgentProfile> {
    if (environment.mock)
      return new Promise<AgentProfile>((resolve) => {setTimeout(()=> resolve({agent_pub_key:this.agent_pub_key!,profile:newprofile}),2000)})
    return this.callZome('create_profile', newprofile);
  }

  private callZome(fn_name: string, payload: any) {
    return this.hcs.call(this.cellName, this.zomeName, fn_name, payload);
  }
  
}

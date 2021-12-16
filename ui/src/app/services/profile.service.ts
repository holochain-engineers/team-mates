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
  private cellName = 'invitations'
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
          resolve(response)},2000)
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

  //checks cache first
  /*
  async loadAgentProfile(agentPubKey: string): Promise<void> {
    let cachedprofile = this.pstore.profileOf(agentPubKey)
    if (cachedprofile)
      return
    if (!environment.mock)
      var profile = await this.hcs.call(this.zomeName,'get_agent_profile', agentPubKey);
    if (profile)
      this.pstore.storeAgentProfile(profile)
    //return profile 
  }

  async searchProfiles(nicknamePrefix: string): Promise<AgentProfile[]> {
    const profilesFound = await this.hcs.call(this.zomeName,'search_profiles', {
      nickname_prefix: nicknamePrefix,
    })
    if (profilesFound.length > 0)
      this.pstore.storeAllProfiles(profilesFound)
    return profilesFound
  }

  //never uses cache
  async loadAllProfiles(): Promise<Array<AgentProfile>> {
    let allProfiles 
    if (environment.mock)
      allProfiles = [
      {agent_pub_key:"FRIEND_KEY", profile:{nickname:"Roberto", fields:{['email']:"friend@friendmail.mail"}}}]
    else{
        allProfiles = await this.hcs.call(this.zomeName,'get_all_profiles', null);
    }
    if (allProfiles.length > 0)
      this.pstore.storeAllProfiles(allProfiles)
    return allProfiles
  }

  async createProfile(profile: Profile) {
    let profileResult = { agent_pub_key: this.agent_pub_key, profile:profile};
    if (!environment.mock)
      profileResult = await this.hcs.call(this.zomeName,'create_profile', profile);
    this.pstore.storeAgentProfile(profileResult)
  }*/
  
}

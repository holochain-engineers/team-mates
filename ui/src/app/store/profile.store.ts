import { keyframes } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { pluck, map} from 'rxjs/operators';
import { AgentProfile, KeyNick, Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';

export interface ProfileState {
  agentProfiles: AgentProfile[];
}

@Injectable()
export class ProfileStore extends ComponentStore<ProfileState> {
  mypubkey!: string

  constructor(private readonly _profileService: ProfileService) {
    super({agentProfiles: []});
    _profileService.subscribe_to_cell("profile_invitation")
    this.mypubkey = _profileService.getMyAgentkey()!
  }

   /* selectors */

  selectAgentProfile(hash: string){
    return this.select((state) => state.agentProfiles.find(i => i.agent_pub_key === hash)!);
  }
  
  selectAgentProfiles(hasharr: string[]){
    return this.select((state) => state.agentProfiles.filter(ap=>{hasharr.includes(ap.agent_pub_key)})) 
  }

  selectAllProfiles(){
    return this.select(({ agentProfiles }) => agentProfiles);
  }
  
  selectProfiles(){
    return this.select(({ agentProfiles }) => agentProfiles).pipe(map((agentprofiles: AgentProfile[]) => agentprofiles.map(ap => {
      return ap.profile!
    })));
  }

  selectKeyNickArray()  {
   return this.selectAllProfiles().pipe(map((agentprofiles: AgentProfile[]) => agentprofiles.map(ap => {
      return {agent_pub_key:ap.agent_pub_key, nickname:ap.profile?.nickname} as KeyNick
    })))
  }

  selectKeyNickIndexes() { //dictionary format
    return this.selectAllProfiles().pipe(map((agentprofiles: AgentProfile[]) => agentprofiles.map(ap=> {
      return {[ap.agent_pub_key]:ap.profile!.nickname}})))
  }

  /* updaters */
  
  //readonly setMyProfile = this.updater(
  //  (state, myprofile: AgentProfile | undefined) => ({ ...state, myprofile })
  //);
  readonly addProfile = this.updater((state, agentprofile: AgentProfile) => ({
    agentProfiles: [...state.agentProfiles, agentprofile],
  }));

  readonly updateProfile = this.updater((state, agentprofile: AgentProfile) => ({
    agentProfiles: [ ...state.agentProfiles.filter((entry)=>{
        return entry.agent_pub_key !== agentprofile.agent_pub_key //? undefined : entry
      }), agentprofile]
  }));


  readonly loadProfiles = this.updater((state, profiles: AgentProfile[] | null) => ({
    ...state,
    agentProfiles: profiles || [],
  }));


  async loadProfileEntries():Promise<void> {
    //in the future we might not want to load all the profiles.. and use the search facility instead
    const profiles = await this._profileService.getAllProfiles()
    this.loadProfiles(profiles)
    console.log("all profiles:",profiles)
    //const agentprofile = await this._profileService.getMyProfile()
    //if (agentprofile) {
     // console.log("agentkey in load",this.mypubkey)
     // this.updateProfile(agentprofile)
    //}
  }

  getMyProfile(){
    console.log("agentkey",this.mypubkey)
    return this.selectAgentProfile(this.mypubkey).pipe( 
      pluck('profile'))
  }

  async setMyProfile(myprofile:Profile) {
    console.log("create profile:",myprofile)
      const agentprofile = await this._profileService.createProfile(myprofile)
      console.log("created profile:",agentprofile)
      this.updateProfile(agentprofile) // this should do an upsert
  }

}
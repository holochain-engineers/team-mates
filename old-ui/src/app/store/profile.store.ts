import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment';
import { ComponentStore } from '@ngrx/component-store';
import { pluck, map} from 'rxjs/operators';
import { AgentProfile, KeyNick, Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';

export interface ProfileState {
  agentProfiles: AgentProfile[];
}

@Injectable() //Store is a provider instance for the Container component hierarchy
export class ProfileStore extends ComponentStore<ProfileState> {
  public readonly mypubkey!: string
  private readonly _profileService: ProfileService
  private _cell = environment.cell1

  constructor(private injector:Injector){
    super({agentProfiles: []});
    this._profileService = new ProfileService(injector, this._cell)
    //_profileService.subscribe_to_cell("profile_invitation")
    this.mypubkey = this._profileService.getMyAgentkey()!
  }

   /* selectors */

  selectAgentProfile(hash: string){
    return this.select((state) => state.agentProfiles.find(i => i.agentPubKey === hash)!);
  }
  
  selectAgentProfiles(hasharr: string[]){
    return this.select((state) => state.agentProfiles.filter(ap=>{hasharr.includes(ap.agentPubKey)})) 
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
      return {agent_pub_key:ap.agentPubKey, nickname:ap.profile?.nickname} as KeyNick
    })))
  }

  selectKeyNickIndexes() { //dictionary format
    return this.selectAllProfiles().pipe(map((agentprofiles: AgentProfile[]) => agentprofiles.map(ap=> {
      return {[ap.agentPubKey]:ap.profile!.nickname}})))
  }

  /* updaters */
  
  //readonly setMyProfile = this.updater(
  //  (state, myprofile: AgentProfile | undefined) => ({ ...state, myprofile })
  //);
  readonly addProfile = this.updater((state, agentprofile: AgentProfile) => ({
    agentProfiles: [...state.agentProfiles, agentprofile],
  }));

  readonly setProfile = this.updater((state, agentprofile: AgentProfile) => ({
    agentProfiles: [ ...state.agentProfiles.filter((entry)=>{
        return entry.agentPubKey !== agentprofile.agentPubKey //? undefined : entry
      }), agentprofile]
  }));


  readonly loadProfiles = this.updater((state, profiles: AgentProfile[] | null) => ({
    ...state,
    agentProfiles: profiles || [],
  }));


  getMyProfile(){
    console.log("agentkey",this.mypubkey)
    return this.selectAgentProfile(this.mypubkey).pipe( 
      pluck('profile'))
  }

  getNetStatus():string {
    return this._profileService.getNetworkStatus()
  }

  //TODO below functions should be effects because they write to the store following a network call

  async loadProfileEntries():Promise<void> {
    //in the future we might not want to load all the profiles.. and use the search facility instead
    const profiles = await this._profileService.getAllProfiles()
    this.loadProfiles(profiles)
    console.debug("all profiles:",profiles)
  }

  async createMyProfile(myprofile:Profile) {
    console.debug("create profile:",myprofile)
    const agentprofile = await this._profileService.createProfile(myprofile)
    this.setProfile(agentprofile)
    console.log("created profile:",agentprofile)
  }

  async updateMyProfile(newprofile:Profile) {
    console.debug("update profile:",newprofile)
    const agentprofile = await this._profileService.updateProfile(newprofile)
    this.setProfile(agentprofile)
    console.log("updated profile:",agentprofile) 
  }

}
import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment';
import { ComponentStore } from '@ngrx/component-store';
import { pluck, map, filter} from 'rxjs/operators';
import { AgentProfile, KeyNick, Profile } from '../models/profile';
import { ProfileReceptor } from '../receptors/profile.receptor';
import { decode } from '@msgpack/msgpack';
import { AgentPubKey, AgentPubKeyB64, encodeHashToBase64 } from '@holochain/client';

export interface ProfileState {
  agentProfiles: AgentProfile[];
}

@Injectable() //Store is a provider instance for the Container component hierarchy
export class ProfileStore extends ComponentStore<ProfileState> {
  public readonly mypubkey!: Uint8Array
  public readonly mypubkey64!: AgentPubKeyB64
  //private readonly _profileService: ProfileService
  private _cell = environment.cells[0]
  id:number = 0


  constructor(private receptor:ProfileReceptor){
    super({agentProfiles: []});
    this.id = Math.random()
    this.mypubkey = receptor.getMyAgentkey()!
    this.mypubkey64 = encodeHashToBase64(this.mypubkey)
  }

  private createAgentProfile(pfile:Profile, pubkey:AgentPubKey):AgentProfile{
    const agentkey64 = encodeHashToBase64(pubkey)
    return {agentPubKey:pubkey, agentPubKey64:agentkey64, keyNick:pfile.nickname+'#'+agentkey64.slice(agentkey64.length-4), profile:pfile}
  }

   /* selectors */

  selectAgentProfile(pubkey: string){
    return this.select((state) => state.agentProfiles.find(i => i.agentPubKey64 === pubkey)!);
  }
  
  selectAgentKeyNicksDictionary(pubkey_arr: AgentPubKey[]){
    const pubkey_arrB64 = pubkey_arr.map(key=>encodeHashToBase64(key))
    return this.select((state) => state.agentProfiles.filter(ap=>{pubkey_arrB64.includes(ap.agentPubKey64)})
    .map(ap=>{ return {[ap.agentPubKey64]:ap.keyNick}})) 
  }


  selectAllAgentProfiles(){
    return this.select(({ agentProfiles }) => agentProfiles);
  }

  selectOtherAgentProfiles(){
    return this.select(({ agentProfiles }) => agentProfiles).pipe(map(allprofiles => allprofiles
      .filter(ap=>ap.agentPubKey64 !== this.mypubkey64)
    ));
  }

  selectMyProfile(){
    console.debug("agentkey",encodeHashToBase64(this.mypubkey))
    return this.selectAgentProfile(this.mypubkey64).pipe( 
       pluck('profile')) //map(x => x.profile)) //
  }
  
  selectOtherProfiles(){
    return this.select(({ agentProfiles }) => agentProfiles).pipe(map(allprofiles => allprofiles
      .filter(ap=>ap.agentPubKey64 !== this.mypubkey64)
      .map(ap => ap.profile)
    ));
  }

  /*selectKeyNickArray()  {
   return this.selectAllAgentProfiles().pipe(map((agentprofiles: AgentProfile[]) => agentprofiles.map(ap => {
      return {agent_pub_key:ap.agentPubKey64, nickname:ap.profile?.nickname} as KeyNick
    })))
  }

  selectKeyNickIndexes() { //dictionary format
    return this.selectAllAgentProfiles().pipe(map((agentprofiles: AgentProfile[]) => agentprofiles.map(ap=> {
      return {[ap.agentPubKey.join()]:ap.profile!.nickname}})))
  }*/

  /* updaters */
  
  //readonly setMyProfile = this.updater(
  //  (state, myprofile: AgentProfile | undefined) => ({ ...state, myprofile })
  //);
  readonly addProfile = this.updater((state, agentprofile: AgentProfile) => ({
    agentProfiles: [...state.agentProfiles, agentprofile],
  }));

  readonly setProfile = this.updater((state, agentprofile: AgentProfile) => ({
    agentProfiles: [ ...state.agentProfiles.filter((entry)=>{
        return true //entry.agentPubKey64 !== agentprofile.agentPubKey64 //? undefined : entry
      }), agentprofile]
  }));


  readonly loadProfiles = this.updater((state, profiles: AgentProfile[] | undefined) => ({
    ...state,
    agentProfiles: profiles || [],
  }));
 

  //TODO below functions should be effects because they write to the store following a network call

  async loadProfileEntries():Promise<void> {
    //first load yourself
    const myprofile = await this.receptor.getProfile(this.mypubkey)
    if(myprofile){
      const myAgentProfile = this.createAgentProfile(myprofile,this.mypubkey)
      this.setProfile(myAgentProfile)
      console.log("my agent profile:",myAgentProfile)
    }
    //in the future we might not want to load all the profiles.. and use the search facility instead
    const agents = await this.receptor.getAgentsWithProfiles()//.filter(val=>!Object.is(val,this.mypubkey))
    let agentProfiles:AgentProfile[] = []
    await Promise.all(agents.map( async (agent) => {
        const profile = await this.receptor.getProfile(agent);
        if (profile)
          agentProfiles.push(this.createAgentProfile(profile,agent))
    }))
    this.loadProfiles(agentProfiles)
    console.debug("other resgistered profiles:",agentProfiles)
  }

  async createMyProfile(myprofile:Profile) {
    console.debug("create profile:",myprofile)
    await this.receptor.createProfile(myprofile)
    const agentprofile:AgentProfile = this.createAgentProfile(myprofile,this.mypubkey)
    this.setProfile(agentprofile)
    console.log("created profile:",agentprofile)
  }

  async updateMyProfile(newprofile:Profile) {
    console.debug("update profile:",newprofile)
    const profile = await this.receptor.updateProfile(newprofile)
    const agentprofile:AgentProfile = this.createAgentProfile(newprofile,this.mypubkey)
    this.setProfile(agentprofile)
    console.log("updated profile:",agentprofile) 
  }

  getNetStatus():string {
    return this.receptor.getNetworkStatus()
  }

}
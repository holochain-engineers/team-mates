import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, Subject, Subscription } from 'rxjs';
import { pluck, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AgentProfile, KeyNick, Profile } from '../models/profile';
import { AgentPubKeyB64, HeaderHashB64, EntryHashB64 } from '@holochain-open-dev/core-types';
import { ProfileService } from '../services/profile.service';
import { Dictionary } from '../helpers/utils';

export interface ProfileState {
  agentProfiles: AgentProfile[];
  //myprofile: AgentProfile | undefined
}

//todo export InviteeState

@Injectable() //
export class ProfileStore extends ComponentStore<ProfileState> implements OnDestroy {
  private mypubkey!: string
  private _subs = new Subscription();
  //public agentDictionary!:Dictionary<string>

  constructor(private readonly _profileService: ProfileService) {
    super({agentProfiles: []}); //, myprofile:undefined
    this.mypubkey = this._profileService.getMyAgentkey()!
  }

   /* selectors */

  selectProfile(hash: string):Observable<AgentProfile> {
    return this.select((state) => state.agentProfiles.find(i => i.agent_pub_key === hash)!);
  }
  selectProfiles():Observable<AgentProfile[]>  {
    return this.select(({ agentProfiles }) => agentProfiles);
  }

  selectKeyNickArray():Observable<KeyNick[]>  {
   return this.selectProfiles().pipe(map((agentprofiles: AgentProfile[]) => agentprofiles.map(ap => {
      return {agent_pub_key:ap.agent_pub_key, nickname:ap.profile?.nickname} as KeyNick
    })))
  }

  /*selectKeyNickDictionary():Observable<{[x:string]:string}[]>  {
    return this.selectProfiles().pipe(map((agentprofiles: AgentProfile[]) => agentprofiles.map((ap) =>
        ({[ap.agent_pub_key]: ap.profile.nickname})
      ))))
    */
 // }

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
    
    const profiles = await this._profileService.getAllProfiles()
    this.loadProfiles(profiles)
    const agentprofile = await this._profileService.getMyProfile()
    if (agentprofile) {
      //this.agentpubkey = agentprofile.agent_pub_key
      console.log("agentkey in load",this.mypubkey)
      this.updateProfile(agentprofile)
    }
    //const keyNickSubscription$ = this.selectProfiles().pipe(map((agentprofiles: AgentProfile[]) => agentprofiles.map(ap => {
    //  return {agent_pub_key:ap.agent_pub_key, nickname:ap.profile?.nickname}
    //})))
    /*this._subs.add(this.selectKeyNickArray().subscribe({next: (agent) => {
      this.agentDictionary = Object.assign({}, ...agent.map((x) => ({[x.agent_pub_key]: x.nickname})))},
      error: (error) => {
        console.error('An error happened while loading agent dictionary:', error);
      },
    }));*/
  }

  getMyProfile():Observable<Profile | undefined> {
    console.log("agentkey",this.mypubkey)
    return this.selectProfile(this.mypubkey).pipe( 
      pluck('profile'))
  }

  async setMyProfile(myprofile:Profile) {
      const agentprofile = await this._profileService.createProfile(myprofile)
      this.updateProfile(agentprofile) // this should do an upsert
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

   // effects (future time UI) 
  /* Each new call of getMovie(id) pushed that id into movieId$ stream.
  readonly getMyProfile = this.effect(() => {
    
      // 👇 Handle race condition with the proper choice of the flattening operator.
      return switchMap(() => (await this._profileService.getMyProfile()).pipe(
        //👇 Act on the result within inner pipe.
        tap({
          next: (profile) => this.addMovie(movie),
          error: (e) => this.logError(e),
        }),
        // 👇 Handle potential error within inner pipe.
        catchError(() => EMPTY),
      )),
  });*/

}
/*import {Injectable} from "@angular/core"

import {
  observable,
  makeObservable,
  action,
  runInAction,
  computed,
} from 'mobx';
import { Dictionary, Profile, AgentProfile } from '../services/profiles.service';

@Injectable({
  providedIn: "root"
})
export class ProfilesStore {
  @observable
  private profiles: Dictionary<Profile> = {}//= {['DEFAULT_KEY']:{nickname:"Thomas", fields:{['email']:"looop"}}};
  @observable
  private my_agent_pub_key!:string //= "DEFAULT_KEY"

  constructor() {
    makeObservable(this);
  }

  @action reset() {
    this.profiles = {},
    this.my_agent_pub_key =""
  }

  profileOf(agentPubKey: string): Profile {
    return this.profiles[agentPubKey];
  }

  get myAgentPubKey():string {
    return this.my_agent_pub_key    
  }

  set myAgentPubKey(agent_pub_key:string){
    this.my_agent_pub_key = agent_pub_key
  }

  @computed
  get MyProfile(): Profile  { //| undefined
    return this.profiles[this.my_agent_pub_key];
  }

  @computed
  get knownProfiles(): Array<AgentProfile> {
    return Object.entries(this.profiles).map(([agent_pub_key, profile]) => ({
      agent_pub_key,
      profile,
    }));
  }

  @action
  public async storeAllProfiles(allProfiles:Array<AgentProfile>) {
    runInAction(() => {
      for (const agentProfile of allProfiles) {
        this.profiles[agentProfile.agent_pub_key] = agentProfile.profile;
      }
    });
  }

  @action
  public async storeAgentProfile(profile:AgentProfile) {
    if (profile) {
      console.log(profile)
      runInAction(() => {
        this.profiles[profile.agent_pub_key] = profile.profile;
      });
    }
  }

}*/
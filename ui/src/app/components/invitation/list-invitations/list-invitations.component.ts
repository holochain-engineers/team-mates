import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvitationEntryInfo,ProfiledInvitationEntry } from 'src/app/models/invitation';
import { InvitationStore } from '../../../store/invitation.store';
import { ProfileStore } from 'src/app/store/profile.store';
import { map, mapTo, pluck } from 'rxjs/operators';
import { ConstantPool } from '@angular/compiler';
import { Dictionary } from 'src/app/helpers/utils';
import { Observable, Subscription } from 'rxjs';
import { AgentProfile, Profile, KeyvalueProfile } from 'src/app/models/profile';

@Component({
  selector: 'list-invitations',
  templateUrl: './list-invitations.component.html',
  styleUrls: ['./list-invitations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationListComponent implements OnDestroy{
  //protected invitations$ = this._invitationStore.invitations$;
  public displayedColumns = ['inviter', 'invitees', 'timestamp', 'invitees_who_accepted', 'invitees_who_rejected' ];
  //the source where we will get the data

  //private agentDictionary!:Dictionary<string>
  //private profileSubscription$!:Subscription
  public dataSource$ = this._invitationStore.selectInvitations()/*.pipe(map((invites: InvitationEntryInfo[]) => {
    invites.map(invite => { 
      const bb:ProfiledInvitationEntry = {Invitation:{Inviter:this._profileStore.selectProfile(invite.invitation_entry_hash)}} as ProfiledInvitationEntry
      this._profileStore.selectProfile(invite.invitation_entry_hash)
    })
  })); //new MatTableDataSource<InvitationEntryInfo>();*/
  //public agentDictionary$:Observable<Dictionary<string>> = this._profileStore.selectProfiles().pipe(map(agentprofiles=> agentprofiles?.map(ap=> {return {[ap.agent_pub_key]:ap.profile?.nickname}})))
  //editedPerson$ = this._invitationStore.editedInvitation$;
  //editorId$ = this._invitationStore.editorId$;
  constructor(private readonly _invitationStore: InvitationStore, private readonly _profileStore: ProfileStore) {}


  ngOnInit(){
     // this.profileSubscription$ = this._profileStore.selectProfiles().pipe(map(agentprofiles => agentprofiles.map(ap => {
     //   return {agent_pub_key:ap.agent_pub_key, nickname:ap.profile?.nickname}
     // }))).subscribe(res => {this.agentDictionary = Object.assign({}, ...res.map((x) => ({[x.agent_pub_key]: x.nickname})))});
    //this.dataSource.data = this.invitations$
  }

 ngOnDestroy(){
 //  this.profileSubscription$.unsubscribe()
 }

  hashToAgent(hash:string):string{
    console.log("hashy",this._profileStore.agentDictionary)
    return this._profileStore.agentDictionary[hash]
    //console.log("hello",res)
    //if (res)
     // return res.profile?.nickname
    //else
    //  return "none found" //this._profileStore.selectProfile(hash)
  }

  hashListToAgentList(hashlist:string[]):string[] {
    const res:string[] = []
    for(const hash of hashlist){
      res.push(this._profileStore.agentDictionary[hash])
    }
    return res
  }

  editInvitation(header_hash: string): void {
    //this._invitationStore.editInvitation(header_hash);
  }
}


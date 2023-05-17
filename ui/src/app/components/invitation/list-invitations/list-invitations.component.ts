import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { InvitationStore } from 'src/app/stores/invitation.store';
import { ProfileStore } from 'src/app/stores/profile.store';
import { map } from 'rxjs/operators';
import { Dictionary } from 'src/app/helpers/utils';
import { Observable, Subscription } from 'rxjs';
import { ActionHash, AgentPubKey, EntryHash } from '@holochain/client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'list-invitations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-invitations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationListComponent implements OnDestroy{
  public outgoingInvitations$:Observable<InvitationEntryInfo[]>
  public incommingInvitations$:Observable<InvitationEntryInfo[]>
  private profileDictionarySubscription$!: Subscription
  private profileDictionary:Dictionary<string> = {}
  
  constructor(private readonly _invitationStore: InvitationStore, private readonly _profileStore: ProfileStore) {
    this.outgoingInvitations$  = this._invitationStore.selectUncompletedInvitations().pipe(map(ilist=>ilist.filter(inv=>inv.invitation.inviter.join() === this._profileStore.mypubkey.join())));
    this.incommingInvitations$  = this._invitationStore.selectUncompletedInvitations().pipe(map(ilist=>ilist.filter(inv=>inv.invitation.inviter.join() !== this._profileStore.mypubkey.join())));
  }


  ngOnInit(){
    let agentList:AgentPubKey[] = []
    agentList.push(this.outgoingInvitations$.pipe(map(inv=>inv.map(inv=>inv.invitees_who_accepted))))
    this.profileDictionarySubscription$ = this._profileStore.selectAgentKeyNicksDictionary().subscribe(res=>this.profileDictionary = Object.assign({},...res))
         // .subscribe(res => {this.agentDictionary = Object.assign({}, ...res.map((x) => ({[x.agent_pub_key]: x.nickname})))});
  }

  ngOnDestroy(){
    this.profileDictionarySubscription$.unsubscribe()
  }

  accept(action_hash:ActionHash){
    this._invitationStore.acceptInvitation(action_hash)
  }

  reject(action_hash:ActionHash){
    this._invitationStore.rejectInvitation(action_hash)
  }

  cancel(entry_hash:EntryHash){
    this._invitationStore.clearInvitation(entry_hash)
  }

  hashToAgent(hash:AgentPubKey):string{
    //console.log("profile_list:",this.profileDictionary)
    return this.profileDictionary[hash.join()]
  }

  hashListToAgentList(hashlist:AgentPubKey[]):string[] {
    const res:string[] = []
    for(const hash of hashlist){
      res.push(" "+this.profileDictionary[hash.join()])
    }
    return res
  }

  editInvitation(entry_hash: string): void {
    //this._invitationStore.editInvitation(entry_hash);
  }
}


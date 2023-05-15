import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { InvitationStore } from '../../../store/invitation.store';
import { ProfileStore } from 'src/app/store/profile.store';
import { map } from 'rxjs/operators';
import { Dictionary } from 'src/app/helpers/utils';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'list-invitations',
  templateUrl: './list-invitations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationListComponent implements OnDestroy{
  public outgoingInvitations$:Observable<InvitationEntryInfo[]>
  public incommingInvitations$:Observable<InvitationEntryInfo[]>
  private profileDictionarySubscription$!: Subscription
  private profileDictionary:Dictionary<string> = {}
  
  constructor(private readonly _invitationStore: InvitationStore, private readonly _profileStore: ProfileStore) {
    this.outgoingInvitations$  = this._invitationStore.selectUncompletedInvitations().pipe(map(ilist=>ilist.filter(inv=>inv.invitation.inviter === this._profileStore.mypubkey)));
    this.incommingInvitations$  = this._invitationStore.selectUncompletedInvitations().pipe(map(ilist=>ilist.filter(inv=>inv.invitation.inviter === this._profileStore.mypubkey)));
  }


  ngOnInit(){
    this.profileDictionarySubscription$ = this._profileStore.selectKeyNickIndexes().subscribe(res=>this.profileDictionary = Object.assign({},...res))
         // .subscribe(res => {this.agentDictionary = Object.assign({}, ...res.map((x) => ({[x.agent_pub_key]: x.nickname})))});
  }

  ngOnDestroy(){
    this.profileDictionarySubscription$.unsubscribe()
  }

  accept(entry_hash:string){
    this._invitationStore.acceptInvitation(entry_hash)
  }

  reject(entry_hash:string){
    this._invitationStore.rejectInvitation(entry_hash)
  }

  cancel(entry_hash:string){
    this._invitationStore.clearInvitation(entry_hash)
  }

  hashToAgent(hash:string):string{
    //console.log("profile_list:",this.profileDictionary)
    return this.profileDictionary[hash]
  }

  hashListToAgentList(hashlist:string[]):string[] {
    const res:string[] = []
    for(const hash of hashlist){
      res.push(" "+this.profileDictionary[hash])
    }
    return res
  }

  editInvitation(entry_hash: string): void {
    //this._invitationStore.editInvitation(entry_hash);
  }
}


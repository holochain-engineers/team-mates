import { Component, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Dictionary } from 'src/app/helpers/utils';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { AgentProfile, KeyNick } from 'src/app/models/profile';
import { ProfileStore } from 'src/app/stores/profile.store';
import { InvitationStore } from 'src/app/stores/invitation.store';
import { AgentPubKey } from '@holochain/client';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'teams',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './teams.component.html',
})
export class TeamsComponent {
  public team$!: Observable<AgentPubKey[][]>
  public selectedPeople: KeyNick[] = [] //= [{}]//[{ agent_pub_key: "1234", nickname: 'Karyn Wright' }];
  private profileDictionarySubscription$!: Subscription
  private profileDictionary:Dictionary<string> = {}
  

  constructor(private readonly _invitationStore: InvitationStore, private readonly _profileStore: ProfileStore) {
      this.team$ = _invitationStore.selectCompletedInvitations()
      .pipe(map(invlist=>invlist.map(x=>x.invitation.invitees)))
  }

  ngOnInit(){
    this.profileDictionarySubscription$ = this._profileStore.selectKeyNickIndexes().subscribe(res=>this.profileDictionary = Object.assign({},...res))
  }

  ngOnDestroy(){
    this.profileDictionarySubscription$.unsubscribe()
  }

  hashToAgent(hash:AgentPubKey):string{
    console.debug("profile_list:",this.profileDictionary)
    return this.profileDictionary[hash.join()]
  }

  
}
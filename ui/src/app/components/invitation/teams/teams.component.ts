import { Component, Input } from '@angular/core';
import { Observable, map, Subscription } from 'rxjs';
import { Dictionary } from 'src/app/helpers/utils';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { AgentProfile, KeyNick } from 'src/app/models/profile';
import { ProfileStore } from 'src/app/store/profile.store';
import { InvitationStore } from '../../../store/invitation.store';

@Component({
  selector: 'teams',
  templateUrl: './teams.component.html',
})
export class TeamsComponent {
  public team$!: Observable<string[][]>
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

  hashToAgent(hash:string):string{
    console.log("profile_list:",this.profileDictionary)
    return this.profileDictionary[hash]
  }

  
}
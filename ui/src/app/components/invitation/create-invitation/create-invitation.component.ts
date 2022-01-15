import { Component, Input } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { KeyNick } from 'src/app/models/profile';
import { ProfileStore } from 'src/app/store/profile.store';
import { InvitationStore } from '../../../store/invitation.store';

@Component({
  selector: 'create-invitation',
  templateUrl: './create-invitation.component.html',
})
export class CreateInvitationComponent {
  @Input() invitation!: InvitationEntryInfo;
  public people$!: Observable<KeyNick[]>
  public selectedPeople: KeyNick[] = [] //= [{}]//[{ agent_pub_key: "1234", nickname: 'Karyn Wright' }];

  constructor(private readonly _invitationStore: InvitationStore, private readonly _profileStore: ProfileStore) {
    this.people$ = this._profileStore.selectKeyNickArray().pipe(map(kna=>kna.filter(kn=>kn.agent_pub_key !== this._profileStore.mypubkey)))
  }

  send() {
    console.log("creating invite ",this.selectedPeople)
    if (this.selectedPeople.length > 0){
      this._invitationStore.sendNewInvitation(this.selectedPeople.map(person=>person.agent_pub_key));
      this.selectedPeople = []
    }
  }

  clear(){
    this.selectedPeople = []
  }

  
}
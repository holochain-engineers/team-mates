import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { KeyNick } from 'src/app/models/profile';
import { ProfileStore } from 'src/app/store/profile.store';
import { InvitationStore } from '../../../store/invitation.store';

@Component({
  selector: 'create-invitation',
  templateUrl: './create-invitation.component.html',
  //providers: [InvitationStore],
})
export class CreateInvitationComponent {
  @Input() invitation!: InvitationEntryInfo;
  public people$!: Observable<KeyNick[]>
  public selectedPeople: KeyNick[] = [] //= [{}]//[{ agent_pub_key: "1234", nickname: 'Karyn Wright' }];

  constructor(private readonly _invitationStore: InvitationStore, private readonly _profileStore: ProfileStore) {
    this.people$ = this._profileStore.selectKeyNickArray()
  }

  ngOnInit() {
  }

  send() {
    console.log("creating invite ",this.selectedPeople)
    if (this.selectedPeople.length > 0){
      this._invitationStore.sendNewInvitation(this.selectedPeople.map(person=>person.agent_pub_key));
      this.selectedPeople = []
    }
  }

  cancel(){
    this.selectedPeople = []
  }


  clearModel() {
      console.log("hereo ",this.selectedPeople)
      //this.selectedPeople = [];
  }
  
}
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { AgentProfile, KeyNick } from 'src/app/models/profile';
import { ProfileStore } from 'src/app/stores/profile.store';
import { InvitationStore } from 'src/app/stores/invitation.store';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'create-invitation',
  standalone: true,
  imports: [NgSelectModule,FormsModule,CommonModule],
  templateUrl: './create-invitation.component.html',
})
export class CreateInvitationComponent {
  @Input() invitation!: InvitationEntryInfo;
  public people$!: Observable<AgentProfile[]>
  public selectedPeople: AgentProfile[] = [] //= [{}]//[{ agent_pub_key: "1234", nickname: 'Karyn Wright' }];

  constructor(private readonly _invitationStore: InvitationStore, private readonly _profileStore: ProfileStore) {
    //this.people$ = this._profileStore.selectKeyNickArray().pipe(map(kna=>kna.filter(kn=>kn.agent_pub_key !== this._profileStore.mypubkey64)))
    this.people$ = this._profileStore.selectOtherAgentProfiles()
  }

  send() {
    console.log("creating invite ",this.selectedPeople)
    if (this.selectedPeople.length > 0){
      const selections = this.selectedPeople.map(person=>person.agentPubKey)
      console.log(selections)
      this._invitationStore.sendNewInvitation(selections);
      this.selectedPeople = []
    }
  }

  clear(){
    this.selectedPeople = []
  }

  
}
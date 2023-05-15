import { Component, OnInit } from '@angular/core';
import { InvitationStore } from '../../stores/invitation.store';
import { CreateInvitationComponent } from './create-invitation/create-invitation.component';
import { InvitationListComponent } from './list-invitations/list-invitations.component';
import { TeamsComponent } from './teams/teams.component';

@Component({
  selector: 'invitation',
  standalone: true,
  imports:[CreateInvitationComponent, InvitationListComponent, TeamsComponent],
  templateUrl: './invitation.component.html'
})
export class InvitationComponent implements OnInit {
 // selectedInvitation$ = this._invitationStore.selectInvitation("123");
  

  constructor(
    private readonly _invitationStore: InvitationStore,
  ) {}

  ngOnInit(): void {

  }
}

import { Component, OnInit } from '@angular/core';
import { InvitationStore } from '../../store/invitation.store';

@Component({
  selector: 'invitation',
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

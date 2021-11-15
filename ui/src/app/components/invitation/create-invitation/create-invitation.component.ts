import { Component, Input } from '@angular/core';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { InvitationStore } from '../../../store/invitation.store';

@Component({
  selector: 'create-invitation',
  templateUrl: './create-invitation.component.html',
  providers: [InvitationStore],
})
export class CreateInvitationComponent {
  @Input() invitation!: InvitationEntryInfo;

  constructor(
    private readonly _invitationStore: InvitationStore,
  ) {}

  send(agents: string) {
    this._invitationStore.sendNewInvitation([agents]);
  }

  cancel(){}
  
}
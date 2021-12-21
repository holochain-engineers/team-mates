import { Component, Input } from '@angular/core';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { InvitationStore } from '../../../store/invitation.store';

@Component({
  selector: 'edit-invitation',
  templateUrl: './edit-invitation.component.html',
})
export class EditInvitationComponent {
  @Input() invitation!: InvitationEntryInfo;

  constructor(
    private readonly _invitationStore: InvitationStore,
  ) {}

  editInvitation() {
    //this._invitationStore.setEditedInvitation(this.invitation);
  }

  cancelEdit() {
    this._invitationStore.cancelEditInvitation();
  }

  saveEdit() {
    this._invitationStore.saveEditInvitation();
  }
  
}

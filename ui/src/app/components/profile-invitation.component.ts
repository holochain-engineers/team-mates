import { Component, OnInit } from '@angular/core';
import { InvitationStore } from '../store/invitation.store';
import { ProfileStore } from '../store/profile.store';

@Component({
  selector: 'profile-invitation-container',
  templateUrl: './profile-invitation.component.html',
  providers: [ProfileStore,InvitationStore]
})
export class ProfileInvitationComponent implements OnInit {
  myprofile$ = this._profileStore.myprofile$;

  constructor(
    private readonly _invitationStore: InvitationStore,
    private readonly _profileStore: ProfileStore
  ) {}

  ngOnInit(): void {
    this._profileStore.loadProfileEntries()
    this._invitationStore.loadInvitationEntries()
  }
}

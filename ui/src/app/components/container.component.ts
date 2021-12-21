import { Component, OnInit } from '@angular/core';
import { InvitationStore } from '../store/invitation.store';
import { ProfileStore } from '../store/profile.store';

@Component({
  selector: 'component-container',
  templateUrl: './container.component.html',
  providers: [ProfileStore,InvitationStore]
})
export class ContainerComponent implements OnInit {
  myprofile$ = this._profileStore.getMyProfile()

  constructor(
    private readonly _invitationStore: InvitationStore,
    private readonly _profileStore: ProfileStore
  ) {}

  ngOnInit(): void {
    this._profileStore.loadProfileEntries()
    this._invitationStore.loadInvitationEntries()
  }
}

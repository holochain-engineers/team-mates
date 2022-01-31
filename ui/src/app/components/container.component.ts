import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InvitationStore } from '../store/invitation.store';
import { ProfileStore } from '../store/profile.store';

@Component({
  selector: 'component-container',
  templateUrl: './container.component.html',
  providers: [ProfileStore,InvitationStore]
})
export class ContainerComponent implements OnInit {
  myprofile$ = this._profileStore.getMyProfile()
  status:string | null = ""
  statusStyling:string = "text-green-500"
  sub?:Subscription

  constructor(
    private readonly _invitationStore: InvitationStore,
    private readonly _profileStore: ProfileStore
  ) { }

  ngOnInit(): void {
    const mode = " (Mode: "+sessionStorage.getItem("status")+")"
    const stat = this._profileStore.getNetStatus()
    this.status = mode+" "+stat
    switch (stat) {
      case "CLOSED":
        this.status = "Socket status: "+stat+mode
        this.statusStyling = "text-red-500"
        break;
      case "CLOSING" || "CONNECTING":
        this.status = "Socket status: "+stat+mode
        this.statusStyling = "text-yellow-500"
        break;
      case "OPEN":
        this.status = "Socket status: "+stat+mode
        this.statusStyling = "text-green-500"
        break;
      default:
        break;
    }
    this._profileStore.loadProfileEntries()
    this._invitationStore.loadInvitationEntries()
  }
}

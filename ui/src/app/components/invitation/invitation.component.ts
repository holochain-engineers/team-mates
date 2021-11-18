import { Component, OnInit } from '@angular/core';
import { ProfileStore } from 'src/app/store/profile.store';
//import { StarWarsApiService } from '../../../services/star-wars-api.service';
//import { InvitationService } from 'src/app/services/invitation.service';
import { InvitationStore } from '../../store/invitation.store';

@Component({
  selector: 'invitation',
  templateUrl: './invitation.component.html',
  providers: [InvitationStore,ProfileStore],
})
export class InvitationComponent implements OnInit {
  selectedInvitation$ = this._invitationStore.selectInvitation("123");
  

  constructor(
    private readonly _invitationStore: InvitationStore,
    private readonly _profileStore: ProfileStore
  ) {}

  ngOnInit(): void {
    this._profileStore.loadProfileEntries()
    this._invitationStore.loadInvitationEntries()
    //this._invitationApi.getPeople().subscribe({
    //  next: (people) => {
    //    this._invitationStore.loadPeople(people);
    //  },
    //});
  }
}

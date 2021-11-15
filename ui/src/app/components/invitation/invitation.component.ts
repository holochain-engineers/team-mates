import { Component, OnInit } from '@angular/core';
//import { StarWarsApiService } from '../../../services/star-wars-api.service';
//import { InvitationService } from 'src/app/services/invitation.service';
import { InvitationStore } from '../../store/invitation.store';

@Component({
  selector: 'invitation',
  templateUrl: './invitation.component.html',
  providers: [InvitationStore],
})
export class InvitationComponent implements OnInit {
  selectedInvitation$ = this._invitationStore.selectInvitation("123");

  constructor(
    private readonly _invitationStore: InvitationStore,
   // private readonly _invitationApi: InvitationService
  ) {}

  ngOnInit(): void {
    this._invitationStore.loadInvitationEntries()
    //this._invitationApi.getPeople().subscribe({
    //  next: (people) => {
    //    this._invitationStore.loadPeople(people);
    //  },
    //});
  }
}

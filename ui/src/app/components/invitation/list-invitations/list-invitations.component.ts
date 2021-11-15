import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { InvitationStore } from '../../../store/invitation.store';

@Component({
  selector: 'list-invitations',
  templateUrl: './list-invitations.component.html',
  styleUrls: ['./list-invitations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationListComponent {
  //protected invitations$ = this._invitationStore.invitations$;
  public displayedColumns = ['firstName', 'lastName', 'studentEmail', 'registrationNumber', 'course' ];
  //the source where we will get the data
  public dataSource = this._invitationStore.invitations$; //new MatTableDataSource<InvitationEntryInfo>();

  //editedPerson$ = this._invitationStore.editedInvitation$;
  //editorId$ = this._invitationStore.editorId$;

  ngOnInit(){
    //this.dataSource.data = this.invitations$
  }

  constructor(private readonly _invitationStore: InvitationStore) {}

  editInvitation(header_hash: string): void {
    //this._invitationStore.editInvitation(header_hash);
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { InvitationService } from '../services/invitation.service';
import { Invitation, InvitationEntryInfo } from '../models/invitation';


export interface InvitationState {
  invitations: InvitationEntryInfo[];
}

@Injectable()
export class InvitationStore extends ComponentStore<InvitationState> implements OnDestroy {
 // private _saveEditInvite$ = new Subject<void>();
 // private _saveNewInvite$ = new Subject<AgentPubKeyB64[]>();
  private _subs = new Subscription();

  constructor(private readonly _invitationService: InvitationService) {
    super({invitations: []});
    
    this._subs.add(
      this._invitationService.invitationsReceived$.subscribe({
        next: (invitationEntryInfo) => {
          console.log('Invitation received:',invitationEntryInfo);
          this.upsertInvitations(invitationEntryInfo!);
        },
        error: (error) => {
          console.error('An error happened while updating Invitation:', error);
        },
      }) 
    )
    this._subs.add(
      this._invitationService.invitationsAccepted$.subscribe({
        next: (invitationEntryInfo) => {
          this.upsertInvitations(invitationEntryInfo!);
        },
        error: (error) => {
          console.error('An error happened while updating Invitation:', error);
        },
      }) 
    )
    this._subs.add(
      this._invitationService.invitationsRejected$.subscribe({
        next: (invitationEntryInfo) => {
          ///this.setEditedInvitation(invitationEntryInfo!)
          this.upsertInvitations(invitationEntryInfo!);
          //this.clearEditedInvitation();
        },
        error: (error) => {
          console.error('An error happened while updating Invitation:', error);
        },
      }) 
    )
  }

  /* selectors */

  selectInvitation(hash: string) {
    return this.select((state) => state.invitations.find(i => i.invitation_header_hash === hash));
  }
  selectInvitations(){
    return this.select(({ invitations }) => invitations);
  }

  //readonly editedInvitation$ = this.select(({ editedInvitation }) => editedInvitation).pipe(
  //  tap((invitationEntryInfo) => console.log('editedInvitation$', invitationEntryInfo))
  //);

  /* updaters */

  readonly addInvitation = this.updater((state, invitation: InvitationEntryInfo) => ({
    invitations: [...state.invitations, invitation],
  }));

  readonly updateInvitation = this.updater((state, invitation: InvitationEntryInfo) => ({
    invitations: [ ...state.invitations.filter((entry)=>{
        return entry.invitation_entry_hash !== invitation.invitation_entry_hash //? undefined : entry
      }), invitation]
  }));

  readonly loadInvitations = this.updater((state, invitations: InvitationEntryInfo[] | null) => ({
    ...state,
    invitations: invitations || [],
  }));


    // effects (handles and serializes signals from the holochain network)
  readonly upsertInvitations = this.effect((invite$: Observable<InvitationEntryInfo>) =>
    invite$.pipe(
      withLatestFrom(this.selectInvitations()),
      tap<[InvitationEntryInfo, InvitationEntryInfo[]]>(([invite, invitations]) => {
        const id = invite.invitation_entry_hash;
        const index = invitations.findIndex((cur) => {
          console.log('compare', cur, id, cur.invitation_entry_hash === id);
          return cur.invitation_entry_hash === id;
        });

        console.log('index', index, invite, invitations);

        if (index > -1) {
          const modifiedInvitations = [...invitations];
          modifiedInvitations[index] = invite;

          this.loadInvitations(modifiedInvitations);
        } else {
          console.log("adding invite:",invite)
          this.updateInvitation(invite)
        }
      })
    )
  );

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  //saveEditInvitation() {
  //  this._saveEditInvite$.next();
  //}

  //this currently is responded to by an acceptInvitation signal.. so no need to listen or wait for a response
  sendNewInvitation(agentPubKeyB64_arr: string[]){
    console.log("new invite:",agentPubKeyB64_arr)
    this._invitationService.sendInvitation(agentPubKeyB64_arr)
  }

  acceptInvitation(header_hash:string){
    this._invitationService.acceptInvitation(header_hash)
  }

  rejectInvitation(header_hash:string){
    this._invitationService.rejectInvitation(header_hash)
  }

  async loadInvitationEntries():Promise<void> {
    const invitations = await this._invitationService.getMyPendingInvitations()
    console.log("invitations:",invitations)
    this.loadInvitations(invitations)
  }
}

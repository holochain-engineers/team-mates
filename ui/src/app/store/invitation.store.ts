import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, Subject, Subscription } from 'rxjs';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { InvitationService } from '../services/invitation.service';
import { Invitation, InvitationEntryInfo } from '../models/invitation';
import { AgentPubKeyB64, HeaderHashB64, EntryHashB64 } from '@holochain-open-dev/core-types';
import { ThrowStmt } from '@angular/compiler';

/*export interface PersonState {
  people: Person[];
  editorId: number | undefined;
  editedPerson: Person | undefined;
}

const defaultState: PersonState = {
  people: [],
  editorId: undefined,
  editedPerson: undefined,
};*/

export interface InvitationState {
  invitations: InvitationEntryInfo[];
}

//todo export InviteeState

@Injectable()
export class InvitationStore extends ComponentStore<InvitationState> implements OnDestroy {
  private _saveEditInvite$ = new Subject<void>();
  private _saveNewInvite$ = new Subject<AgentPubKeyB64[]>();
  private _subs = new Subscription();

  constructor(private readonly _invitationService: InvitationService) {
    super({invitations: []});
    
    /*const saveWithData$ = this._saveEditInvite$.pipe(
      withLatestFrom(this.editedInvitation$),
      switchMap(([, invitationEntryInfo]) =>
       //console.log("not implemented") 
      this._invitationService.sendInvitation(invitationEntryInfo?.invitation.invitees)
      )
    );

    this._subs.add(
      saveWithData$.subscribe({
        next: () => {
          //this.updatePerson(invitationEntryInfo!);

          this.clearEditedInvitation();
        },
        error: (error) => {
          console.error('An error happened while remote saving:', error);
        },
      })
    );*/
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
         // this.setEditedInvitation(invitationEntryInfo!)
          this.updateInvitation(invitationEntryInfo!);
         // this.clearEditedInvitation();
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
          this.updateInvitation(invitationEntryInfo!);
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

  //readonly editorId$ = this.select(({ editorId }) => editorId);
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


    // effects (future time network)
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

  /*
    // effects (future time UI) 
  // Each new call of getMovie(id) pushed that id into movieId$ stream.
  readonly upsertInvitation = this.effect((invite$: Observable<InvitationEntryInfo>) => {
    return invite$.pipe(
      // 👇 Handle race condition with the proper choice of the flattening operator.
      switchMap((id) => id.pipe(
        //👇 Act on the result within inner pipe.
        tap({
          next: (movie) => this.addMovie(movie),
          error: (e) => this.logError(e),
        }),
        // 👇 Handle potential error within inner pipe.
        catchError(() => EMPTY),
      )),
    );
  });
*/
/*
  readonly setEditorId = this.updater(
    (state, editorId: number | undefined) => ({ ...state, editorId })
  );

  readonly setEditedInvitation = this.updater(
    (state, editedInvitation: InvitationEntryInfo | undefined) => ({ ...state, editedInvitation })
  );


  // effects (future time UI) 
  // Each new call of getMovie(id) pushed that id into movieId$ stream.
  readonly getMovie = this.effect((movieId$: Observable<string>) => {
    return movieId$.pipe(
      // 👇 Handle race condition with the proper choice of the flattening operator.
      switchMap((id) => this.moviesService.fetchMovie(id).pipe(
        //👇 Act on the result within inner pipe.
        tap({
          next: (movie) => this.addMovie(movie),
          error: (e) => this.logError(e),
        }),
        // 👇 Handle potential error within inner pipe.
        catchError(() => EMPTY),
      )),
    );
  });

  readonly editInvitation = this.effect(
    (header_hash$: Observable<string | undefined>) =>
      header_hash$.pipe(
        withLatestFrom(this.invitations$),
        tap<[string | undefined, InvitationEntryInfo[]]>(([id, invitations]) => {
          //this.setEditorId(id);

          const inviteToEdit =
            !id && id !== ""
              ? undefined
              : invitations.find((invite) => invite.invitation_header_hash === id);

          this.setEditedInvitation({ ...inviteToEdit! });
        })
      )
  );



  readonly insertInvitation = this.effect((invite$: Observable<InvitationEntryInfo>) =>
  invite$.pipe(
      withLatestFrom(this.invitations$), 
      tap<[InvitationEntryInfo, InvitationEntryInfo[]]>(([invitation, invitations]) => {
        const allEntries = [...invitations];
        allEntries.push(invitation)
        this.loadInvitations(allEntries);
      })
    )
  ) */


  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  cancelEditInvitation() {
    this.clearEditedInvitation();
  }

  private clearEditedInvitation() {
   // this.setEditorId(undefined);
   // this.setEditedInvitation(undefined);
  }

  saveEditInvitation() {
    this._saveEditInvite$.next();
  }

  //this currently is responded to by an acceptInvitation signal.. so no need to listen or wait for a response
  sendNewInvitation(agentPubKeyB64_arr: string[]){
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
    this.loadInvitations(invitations)
  }
}

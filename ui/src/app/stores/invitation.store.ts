import { Injectable, OnDestroy, Injector } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, Subscription } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { InvitationEntryInfo } from '../models/invitation';
import { environment } from '@environment';
import { InvitationReceptor } from '../receptors/invitation.receptor';
import { AgentPubKey } from '@holochain/client';

export interface InvitationState {
  invitations: InvitationEntryInfo[];
}
//TODO : make the ComponentStore composition based so we can dynamically create new stores for cell clones

@Injectable()  //Store is a provider instance for the Container component hierarchy
export class InvitationStore extends ComponentStore<InvitationState> implements OnDestroy {
  private _subs = new Subscription();
  private _cell = environment.cells[0]

  constructor(private receptor:InvitationReceptor){//private readonly _invitationService: InvitationService) {
    super({invitations: []});
   // this._invitationService = new InvitationService(injector, this._cell) //we create a zome service instance for each cell+zome

    this._subs.add(
      this.receptor.invitationsReceived$.subscribe({
        next: (invitationEntryInfo) => {
          console.log('Invitation received:',invitationEntryInfo);
          this.setInvitations(invitationEntryInfo!);
        },
        error: (error) => {
          console.error('An error happened while updating Invitation:', error);
        },
      }) 
    )
    this._subs.add(
      this.receptor.invitationsAccepted$.subscribe({
        next: (invitationEntryInfo) => {
          this.setInvitations(invitationEntryInfo!);
        },
        error: (error) => {
          console.error('An error happened while updating Invitation:', error);
        },
      }) 
    )
    this._subs.add(
      this.receptor.invitationsRejected$.subscribe({
        next: (invitationEntryInfo) => {
          ///this.setEditedInvitation(invitationEntryInfo!)
          this.setInvitations(invitationEntryInfo!);
          //this.clearEditedInvitation();
        },
        error: (error) => {
          console.error('An error happened while updating Invitation:', error);
        },
      }) 
    )
  }

  /* selectors */

  selectInvitation(actionhash: Uint8Array) {
    return this.select((state) => state.invitations.find(i => i.invitation_action_hash === actionhash));
  }
  selectInvitations(){
    return this.select(({ invitations }) => invitations);
  }

  selectCompletedInvitations(){
    return this.select((state) => state.invitations.filter(inv=>
      JSON.stringify(inv.invitation.invitees.join()) === JSON.stringify(inv.invitees_who_accepted.join())));
  }

  selectUncompletedInvitations(){
    return this.select((state) => state.invitations.filter(inv=>
      JSON.stringify(inv.invitation.invitees.join()) !== JSON.stringify(inv.invitees_who_accepted.join())));
  }



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
  readonly setInvitations = this.effect((invite$: Observable<InvitationEntryInfo>) =>
    invite$.pipe(
      withLatestFrom(this.selectInvitations()),
      tap<[InvitationEntryInfo, InvitationEntryInfo[]]>(([invite, invitations]) => {
        const id = invite.invitation_entry_hash;
        const index = invitations.findIndex((cur) => {
          //console.log('compare', cur, id, cur.invitation_entry_hash === id);
          return cur.invitation_entry_hash === id;
        });
        if (index > -1) {
          const modifiedInvitations = [...invitations];
          modifiedInvitations[index] = invite;

          this.loadInvitations(modifiedInvitations);
        } else {
          console.debug("adding invite:",invite)
          this.updateInvitation(invite)
        }
      })
    )
  );

  override ngOnDestroy() {
    this._subs.unsubscribe();
  }

  /* call zome functions */

  sendNewInvitation(agentPubKey_arr: AgentPubKey[]){
    console.debug("new invite:",agentPubKey_arr)
    this.receptor.sendInvitation(agentPubKey_arr)
  }

  acceptInvitation(action_hash:Uint8Array){
    this.receptor.acceptInvitation(action_hash)
  }

  rejectInvitation(action_hash:Uint8Array){
    this.receptor.rejectInvitation(action_hash)
  }

  clearInvitation(entry_hash:Uint8Array){
    this.receptor.clearInvitation(entry_hash)
  }

  //TODO this should be an Effect 
  async loadInvitationEntries():Promise<void> {
    const invitations = await this.receptor.getMyPendingInvitations()
    console.debug("invitations:",invitations)
    this.loadInvitations(invitations)
  }

  getNetStatus():string {
    return this.receptor.getNetworkStatus()
  }
}

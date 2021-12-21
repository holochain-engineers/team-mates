import { AgentPubKeyB64, HeaderHashB64 } from '@holochain-open-dev/core-types';
import { InvitationEntryInfo, mockInvitationEntryArray } from '../models/invitation';
import { HolochainService } from './holochain.service';
import { Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  invitationsReceived$:Subject<InvitationEntryInfo>  //new
  invitationsAccepted$ = new Subject<InvitationEntryInfo>(); //modified
  invitationsRejected$ = new Subject<InvitationEntryInfo>(); //modified
  private zomeName = 'invitations'
  private cellName = 'profile_invitation'

  constructor(private holochainService: HolochainService, ) {
    this.invitationsReceived$= new Subject<InvitationEntryInfo>();
    this.holochainService.registerCallback(this.cellName, this.zomeName, (s)=>this.signalHandler(s))
  }

  sendInvitation(input: AgentPubKeyB64[] | undefined): Promise<any>{
    if (environment.mock)
      return new Promise<any>((resolve)=>resolve)
    return this.callZome('send_invitation', input);
  }

  getMyPendingInvitations(): Promise<InvitationEntryInfo[]> {
    if (environment.mock)
      return new Promise<InvitationEntryInfo[]>((resolve) => {setTimeout(()=> resolve(mockInvitationEntryArray),3000)})
    else
      return this.callZome('get_my_pending_invitations', null);
  }

  async acceptInvitation(
    invitation_header_hash: HeaderHashB64
  ): Promise<boolean> {
    return this.callZome('accept_invitation', invitation_header_hash);
  }

  async rejectInvitation(
    invitation_header_hash: HeaderHashB64
  ): Promise<boolean> {
    return this.callZome('reject_invitation', invitation_header_hash);
  }

  async clearInvitation(
    invitation_header_hash: HeaderHashB64
  ): Promise<boolean> {
    return this.callZome('clear_invitation', invitation_header_hash);
  }

  private callZome(fn_name: string, payload: any): Promise<any> {
    return this.holochainService.call(this.cellName, this.zomeName, fn_name, payload);
  }


  async signalHandler(payload: any) {
    //console.log("handler called",payload)
    switch (payload.name) {
      case 'invitation received':
        this.invitationsReceived$.next(payload.data.InvitationReceived);
        break;

      case 'invitation accepted':
        this.invitationsAccepted$.next(payload.data.InvitationAccepted);
        break;

      case 'invitation updated':
        break;

      case 'invitation rejected':
        this.invitationsRejected$.next(payload.data.InvitationRejected);
        break;

      default:
        break;
    }
  }
}
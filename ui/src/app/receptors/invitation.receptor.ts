import { AgentPubKey, AppSignal, EntryHash, Record } from '@holochain/client';
import { HolochainService } from '../services/holochain.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inject, Injectable } from '@angular/core';
import { InvitationEntryInfo, mockInvitationEntryArray, SignalPayload } from '../models/invitation';

//injected in the store
@Injectable()
export class InvitationReceptor {
  private _cellname!:string
  private _role!:string
  private _zomes:string[] = ["invitations"]
  //private hcs = Inject(HolochainService)
  public invitationsReceived$ = new Subject<InvitationEntryInfo>()  //new
  public invitationsAccepted$ = new Subject<InvitationEntryInfo>(); //modified
  public invitationsRejected$ = new Subject<InvitationEntryInfo>(); //modified

  constructor(private hcs:HolochainService){}


  registerCallback(role:string, cellname:string){
    this._role = role
    this._cellname = cellname
    this.hcs.registerCallback(cellname,this._zomes, (s:AppSignal)=>this.signalHandler(s))
  }

  sendInvitation(input: AgentPubKey[]): Promise<any>{
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<any>((resolve)=>resolve)
    return this.callCell('send_invitations','invitations', input);
  }

  getMyPendingInvitations(): Promise<InvitationEntryInfo[]> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<InvitationEntryInfo[]>((resolve) => {setTimeout(()=> resolve(mockInvitationEntryArray),3000)})
    else
      return this.callCell('get_my_pending_invitations','invitations', null);
  }

  acceptInvitation(
    invitation_entry_hash: EntryHash
  ): Promise<boolean> {
    return this.callCell('accept_invitation','invitations', invitation_entry_hash);
  }

  rejectInvitation(
    invitation_entry_hash: EntryHash
  ): Promise<boolean> {
    return this.callCell('reject_invitation','invitations', invitation_entry_hash);
  }

  clearInvitation(
    invitation_entry_hash: EntryHash
  ): Promise<boolean> {
    return this.callCell('clear_invitation','invitations', invitation_entry_hash);
  }

  getNetworkStatus():string {
    return this.hcs.getConnectionState()
  }


  private callCell(fn_name: string, zome_name:string, payload: any): Promise<any> {
    return this.hcs.call(this._role, this._cellname, zome_name, fn_name, payload);
  }


  private signalHandler(sig: AppSignal) {
    console.log("handler called",sig)
    switch ((sig.payload as SignalPayload).name) {
      case 'invitation received':
        this.invitationsReceived$.next((sig.payload as SignalPayload).data.InvitationReceived);
        break;

      case 'invitation accepted':
        this.invitationsAccepted$.next((sig.payload as SignalPayload).data.InvitationAccepted);
        break;

      case 'invitation updated':
        break;

      case 'invitation rejected':
        this.invitationsRejected$.next((sig.payload as SignalPayload).data.InvitationRejected);
        break;

      default:
        break;
    }
  }
}
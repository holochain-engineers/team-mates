import { AgentPubKeyB64, EntryHashB64 } from '@holochain-open-dev/core-types';
import { InvitationEntryInfo, mockInvitationEntryArray } from '../models/invitation';
import { HolochainService } from './holochain.service';
import { Subject } from 'rxjs';
import { Injector} from "@angular/core";
import { environment } from '@environment';

//multiple instance per cell
export class InvitationService {
  private _cellName:string
  private _zomeName:string = 'invitations'
  private _holochainService:HolochainService
  public invitationsReceived$ = new Subject<InvitationEntryInfo>()  //new
  public invitationsAccepted$ = new Subject<InvitationEntryInfo>(); //modified
  public invitationsRejected$ = new Subject<InvitationEntryInfo>(); //modified
 
  constructor(private injector:Injector, cellname:string) {
    this._cellName = cellname
    this._holochainService = this.injector.get(HolochainService)
    this._holochainService.registerCallback(cellname, this._zomeName, (s)=>this.signalHandler(s))
  }

  sendInvitation(input: AgentPubKeyB64[] | undefined): Promise<any>{
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<any>((resolve)=>resolve)
    return this.callZome('send_invitation', input);
  }

  getMyPendingInvitations(): Promise<InvitationEntryInfo[]> {
    if (environment.mock || sessionStorage.getItem("status") == "mock")
      return new Promise<InvitationEntryInfo[]>((resolve) => {setTimeout(()=> resolve(mockInvitationEntryArray),3000)})
    else
      return this.callZome('get_my_pending_invitations', null);
  }

  acceptInvitation(
    invitation_entry_hash: EntryHashB64
  ): Promise<boolean> {
    return this.callZome('accept_invitation', invitation_entry_hash);
  }

  rejectInvitation(
    invitation_entry_hash: EntryHashB64
  ): Promise<boolean> {
    return this.callZome('reject_invitation', invitation_entry_hash);
  }

  clearInvitation(
    invitation_entry_hash: EntryHashB64
  ): Promise<boolean> {
    return this.callZome('clear_invitation', invitation_entry_hash);
  }

  getNetworkStatus():string {
    return this._holochainService.getConnectionState()
  }

  private callZome(fn_name: string, payload: any): Promise<any> {
    return this._holochainService.call(this._cellName, this._zomeName, fn_name, payload);
  }

  private signalHandler(payload: any) {
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
  
import { AgentPubKeyB64, HeaderHashB64, EntryHashB64 } from '@holochain-open-dev/core-types';


  export interface Invitation {
    inviter: AgentPubKeyB64;
    invitees: AgentPubKeyB64[];
    timestamp: any;
  }
  
  export interface InvitationEntryInfo {
    invitation: Invitation;
    invitation_entry_hash: EntryHashB64;
    invitation_header_hash: HeaderHashB64;
    invitees_who_accepted: AgentPubKeyB64[];
    invitees_who_rejected: AgentPubKeyB64[];
  }
  
  export enum InvitationStatus {
    Pending, //waiting for all invitee responses
    Completed, //all invitees have accepted
    Rejected //one or more invitees have rejected
  }

  export const mockInvitation:Invitation = {
    inviter:"12C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs",
    invitees:["13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs","13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs"],
    timestamp:"1234425567"
  }

  export const mockInvitationEntry:InvitationEntryInfo = {
    invitation: mockInvitation,
    invitation_entry_hash:"uhC0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs",
    invitation_header_hash:"hhC0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs",
    invitees_who_accepted:[],
    invitees_who_rejected: []
  }

  export const mockInvitationEntryArray:InvitationEntryInfo[] = [mockInvitationEntry]
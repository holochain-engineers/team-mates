  
import { AgentPubKeyB64, HeaderHashB64, EntryHashB64 } from '@holochain-open-dev/core-types';


  export interface Invitation {
    inviter: AgentPubKeyB64;
    invitees: AgentPubKeyB64[];
    timestamp: any;
  }

  export interface ProfiledInvitation {
    inviter: string;
    invitees: string[];
    timestamp: any;
  }
  
  export interface InvitationEntryInfo {
    invitation: Invitation;
    invitation_entry_hash: EntryHashB64;
    invitation_header_hash: HeaderHashB64;
    invitees_who_accepted: AgentPubKeyB64[];
    invitees_who_rejected: AgentPubKeyB64[];
  }

  export interface ProfiledInvitationEntry {
    invitation: ProfiledInvitation;
    invitation_entry_hash: EntryHashB64;
    invitation_header_hash: HeaderHashB64;
    invitees_who_accepted: string[];
    invitees_who_rejected: string[];
  }
  
  export enum InvitationStatus {
    Pending, //waiting for all invitee responses
    Completed, //all invitees have accepted
    Rejected //one or more invitees have rejected
  }

  export const mockInvitation:Invitation = {
    inviter:"12C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs",
    invitees:["13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-ds","13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-es"],
    timestamp:"1234425567"
  }

  export const mockInvitationEntry:InvitationEntryInfo = {
    invitation: mockInvitation,
    invitation_entry_hash:"uhC0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs",
    invitation_header_hash:"hhC0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs",
    invitees_who_accepted:[],
    invitees_who_rejected: []
  }

  export const mockInvitation2:Invitation = {
    inviter:"13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-ds",
    invitees:["12C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs","13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-es", "13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-fs"],
    timestamp:"1234425567"
  }

  export const mockInvitationEntry2:InvitationEntryInfo = {
    invitation: mockInvitation2,
    invitation_entry_hash:"uhC0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs",
    invitation_header_hash:"hhC0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs",
    invitees_who_accepted:["12C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs","13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-es", "13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-fs"],
    invitees_who_rejected: []
  }

  export const mockInvitationEntryArray:InvitationEntryInfo[] = [mockInvitationEntry, mockInvitationEntry2]
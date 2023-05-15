  
import { AgentPubKey, ActionHash, EntryHash } from '@holochain/client'

  export interface SignalPayload {
    name: string,
    data: any
  }
  
  export interface Invitation {
    inviter: AgentPubKey;
    invitees: AgentPubKey[];
    timestamp: any;
  }

  export interface ProfiledInvitation {
    inviter: string;
    invitees: string[];
    timestamp: any;
  }
  
  export interface InvitationEntryInfo {
    invitation: Invitation;
    invitation_entry_hash: EntryHash;
    invitation_action_hash: ActionHash;
    invitees_who_accepted: AgentPubKey[];
    invitees_who_rejected: AgentPubKey[];
  }

  export interface ProfiledInvitationEntry {
    invitation: ProfiledInvitation;
    invitation_entry_hash: EntryHash;
    invitation_header_hash: ActionHash;
    invitees_who_accepted: string[];
    invitees_who_rejected: string[];
  }
  
  export enum InvitationStatus {
    Pending, //waiting for all invitee responses
    Completed, //all invitees have accepted
    Rejected //one or more invitees have rejected
  }

  export const mockInvitation:Invitation = {
    inviter:new Uint8Array(12),
    invitees:[new Uint8Array(13),new Uint8Array(13),new Uint8Array(14)],
    timestamp:"1234425567"
  }

  export const mockInvitationEntry:InvitationEntryInfo = {
    invitation: mockInvitation,
    invitation_entry_hash: new Uint8Array(10),
    invitation_action_hash: new Uint8Array(10),
    invitees_who_accepted:[],
    invitees_who_rejected: []
  }

  export const mockInvitation2:Invitation = {
    inviter:new Uint8Array(12),
    invitees:[new Uint8Array(13),new Uint8Array(13),new Uint8Array(14)],
    timestamp:"1234425567"
  }

  export const mockInvitationEntry2:InvitationEntryInfo = {
    invitation: mockInvitation2,
    invitation_entry_hash: new Uint8Array(10),
    invitation_action_hash: new Uint8Array(10),
    invitees_who_accepted:[new Uint8Array(12),new Uint8Array(12), new Uint8Array(12)],
    invitees_who_rejected: []
  }

  export const mockInvitationEntryArray:InvitationEntryInfo[] = [mockInvitationEntry, mockInvitationEntry2]
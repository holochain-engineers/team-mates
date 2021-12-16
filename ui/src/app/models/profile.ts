import { Dictionary } from "../helpers/utils";
import { AgentPubKeyB64, HeaderHashB64, EntryHashB64 } from '@holochain-open-dev/core-types';

export interface Profile {
  nickname: string;
  fields: Dictionary<string>;
}

export interface AgentProfile {
  agent_pub_key: AgentPubKeyB64;
  profile: Profile | undefined;
}

export interface KeyNick {
  agent_pub_key:string;
  nickname: string
}

export interface KeyValue {
  key:string;
  value: string
}

export const mockMyProfile:Profile = {nickname: "thomas",fields:{["avatar"]:"pop"}}

export const mockMyAgentProfile:AgentProfile = {agent_pub_key: "12C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs", profile: mockMyProfile};


export const mock1Profile:Profile = {nickname: "friend1",fields:{["avatar"]:"lol"}}

export const mock1AgentProfile:AgentProfile = {agent_pub_key: "13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-ds", profile: mock1Profile};

export const mock2Profile:Profile = {nickname: "friend2",fields:{["avatar"]:"loop"}}

export const mock2AgentProfile:AgentProfile = {agent_pub_key: "13C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-es", profile: mock2Profile};

export const mockAgentProfiles:AgentProfile[] = [mock1AgentProfile,mock2AgentProfile];

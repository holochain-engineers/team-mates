import { Dictionary } from "../helpers/utils";

export interface HolonEntry {
  id: string;
  type: string
  properties: Dictionary<String>;
  timestamp: any;
}

export const mockHolonEntryArray:HolonEntry[] = [{
  id:"12C0kP3Cu8QRxERdKJZIqlI3y_gQuJke5qFp7Ae52L49N-vs",
  type: "test",
  properties: {["title"] : "myholon"},
  timestamp:"1234425567"
}]
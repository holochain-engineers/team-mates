import { Dictionary } from "../helpers/utils";

export interface TypeHeader {
  type_name:string
  description:string
}

export interface HolonDescriptor {
  typeheader:TypeHeader
}

export const mockHolonDescriptorArray:HolonDescriptor[] = [{
  typeheader: {type_name:"my_first_holontype",description:"test desc"}
},{
  typeheader: {type_name:"my_second_holontype",description:"test desc2"}
}]

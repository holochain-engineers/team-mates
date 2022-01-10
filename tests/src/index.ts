import {
  Config,
  NetworkType,
  InstallAgentsHapps,
  TransportConfigType,
} from "@holochain/tryorama";

import { Installables } from "./types";
import path from "path";
import invitations from "./zomes/team-mates";

// QUIC
const network = {
  network_type: NetworkType.QuicBootstrap,
  transport_pool: [{ type: TransportConfigType.Quic }],
  bootstrap_service: "https://bootstrap-staging.holo.host/",
};

const config = Config.gen();

const invitations_dna = path.join("../workdir/dna/invitations.dna");

const installAgents: InstallAgentsHapps = [[[invitations_dna]], [[invitations_dna]]];

invitations(config, installAgents);

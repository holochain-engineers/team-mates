import { ScenarioApi } from "@holochain/tryorama/lib/api";
import { Orchestrator,  Player, } from "@holochain/tryorama";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const sendInvitation = (guest_pub_key) => (conductor) => conductor.call("invitations", "send_invitation", [guest_pub_key]);
const getPendingInvitations = (conductor) => conductor.call("invitations", "get_my_pending_invitations",);
const acceptInvitation = (invitation_entry_hash) =>(conductor) => conductor.call("invitations", "accept_invitation",invitation_entry_hash);
const clearInvitation = (invitation_entry_hash) =>(conductor) => conductor.call("invitations", "clear_invitation",invitation_entry_hash);
const rejectInvitation = (invitation_entry_hash) => (conductor) => conductor.call("invitations", "reject_invitation",invitation_entry_hash);
const getDetails = (invitation_entry_hash) => (conductor) => conductor.call("invitations", "my_get_details",invitation_entry_hash);
export function ZomeTest(config, installAgents) {

    let orchestrator = new Orchestrator();

    orchestrator.registerScenario("zome tests", async (s: ScenarioApi, t) => {

        const [player]: Player[] = await s.players([config]);

        const [[alice_happ], [bobby_happ]] = await player.installAgentsHapps(installAgents);
     
        const alicePubKey = alice_happ.agent;
        const bobbyPubKey = bobby_happ.agent;

        const alice_conductor = alice_happ.cells[0];
        const bobby_conductor = bobby_happ.cells[0];


        player.setSignalHandler((signal) => {
            console.log("Player has received Signal:",signal.data.payload.payload);
        })

        let result = await sendInvitation(bobbyPubKey)(alice_conductor);
        await delay(1000);

        // {
        //     invitation: {
        //       inviter: <Buffer 84 20 24 5e 4b 99 bd 3c b4 df 0c 6f ff 2a 90 6d 1d 76 17 0e 01 60 ed a9 fb 1d 0d f7 be 41 bf d0 7d 46 4e c0 d8 65 19>,
        //       invitees: [Array],
        //       timestamp: [Object]
        //     },
        //     invitation_entry_hash: <Buffer 84 21 24 7b 93 1e eb 0a be 8c c7 e5 24 0f d5 ae c0 a3 ff 09 77 2c d3 b3 05 fb 2c 53 df 7f b0 6f 99 88 47 75 54 0e cf>,
        //     invitation_header_hash: <Buffer 84 29 24 89 02 eb ea 2e 12 df 87 c9 de d7 8a d9 e7 82 5f a5 56 bc 58 31 aa ce 4a 3a 58 a2 3c 78 12 35 4b 56 63 a2 b3>,
        //     invitees_who_accepted: [],
        //     invitees_who_rejected: []
        // }
    

        let bobby_invitations = await getPendingInvitations(bobby_conductor);
        await delay(100);
        let  alice_invitations = await getPendingInvitations(alice_conductor);
        await delay(100);

        t.equal(alice_invitations.length, 1)

        console.log("Hello World");

        console.log(bobbyPubKey);
        console.log(`Bobby Invitation list:`);
        console.log(bobby_invitations);



        console.log(bobby_invitations[0].invitation.timestamp);
        
        
        console.log(alicePubKey);
        console.log(`Alice Invitation list:`);
        console.log(alice_invitations);


        // await rejectInvitation(bobby_invitations[0].invitation_entry_hash)(bobby_conductor);
        // await delay(1000);
        await acceptInvitation(bobby_invitations[0].invitation_entry_hash)(bobby_conductor);
        await delay(1000);

        await clearInvitation(bobby_invitations[0].invitation_entry_hash)(bobby_conductor);
        await delay(3000);

        await clearInvitation(bobby_invitations[0].invitation_entry_hash)(alice_conductor);
        alice_invitations = await getPendingInvitations(alice_conductor);

        t.equal(alice_invitations.length, 0)
        // bobby_invitations = await getPendingInvitations(bobby_conductor);
        // await delay(100);

        // alice_invitations = await getPendingInvitations(alice_conductor);
        // await delay(100);

        // console.log(bobbyPubKey);
        // console.log(`Bobby Invitation list:`);
        // console.log(bobby_invitations);

        // console.log(alicePubKey);
        // console.log(`Alice Invitation list:`);
        // console.log(alice_invitations);
        

    });

    orchestrator.run();
}


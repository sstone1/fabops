const Client = require('fabric-client');
const config = require('./config');
const fs = require('fs-extra');
const certificate = fs.readFileSync('./local_fabric/certificate', 'utf8');
const privateKey = fs.readFileSync('./local_fabric/privateKey', 'utf8');
const fabprotos = require('fabric-protos');

(async () => {
    try {

        const encodedBlock = await fs.readFile('channel-genesis-block.bin');
        const block = fabprotos.common.Block.decode(encodedBlock);

        const client = new Client();
        await client.setAdminSigningIdentity(privateKey, certificate, 'Org1MSP');
        const channel = await client.newChannel(config.channel);
        const peer = client.newPeer('grpc://localhost:17051');
        const txId = client.newTransactionID(true);
        const proposalResponses = await channel.joinChannel({ targets: [ peer ], block, txId });
        for (const proposalResponse of proposalResponses) {
            if (proposalResponse instanceof Error) {
                throw proposalResponse;
            }
        }
        console.log('Joined peer to channel');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

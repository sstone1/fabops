const config = require('./config');
const Client = require('fabric-client');
const fs = require('fs-extra');
const certificate = fs.readFileSync('./local_fabric/certificate', 'utf8');
const privateKey = fs.readFileSync('./local_fabric/privateKey', 'utf8');

(async () => {
    try {
        
        const client = new Client();
        await client.setAdminSigningIdentity(privateKey, certificate, 'Org1MSP');
        const channel = client.newChannel(config.channel);
        const peer = client.newPeer('grpc://localhost:17051');
        const orderer = client.newOrderer('grpc://localhost:17050');
        const txId = client.newTransactionID(true);
        const [proposalResponses, proposal] = await channel.sendInstantiateProposal({ 
            chaincodeId: 'fabcar',
            chaincodeVersion: '1.0.2',
            fcn: null,
            args: [],
            targets: [ peer ],
            txId
        });
        for (const proposalResponse of proposalResponses) {
            if (proposalResponse instanceof Error) {
                throw proposalResponse;
            }
        }

        const broadcastResponse = await channel.sendTransaction({ proposal, proposalResponses, orderer, txId });
        if (broadcastResponse.status !== 'SUCCESS') {
            throw new Error(broadcastResponse.info);
        }
        
        await new Promise((resolve, reject) => {
            const channelEventHub = channel.newChannelEventHub(peer);
			channelEventHub.registerTxEvent(txId.getTransactionID(), (tx, code) => {
                if (code !== 'VALID') {
                    return reject(new Error(`Transaction has been commited, but it was invalid, code = ${code}`));
                }
                resolve();
            }, (error) => {
                reject(error);
            }, {
                disconnect: true
            });
			channelEventHub.connect();
        });
        
        console.log('Instantiated contract on channel');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

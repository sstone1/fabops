const Client = require('fabric-client');
const fs = require('fs-extra');
const certificate = fs.readFileSync('./local_fabric/certificate', 'utf8');
const privateKey = fs.readFileSync('./local_fabric/privateKey', 'utf8');

(async () => {
    try {

        const serializedPackage = await fs.readFile('fabcar@1.0.2.cds');
        
        const client = new Client();
        await client.setAdminSigningIdentity(privateKey, certificate, 'Org1MSP');
        const peer = client.newPeer('grpc://localhost:17051');
        const txId = client.newTransactionID(true);
        const [proposalResponses] = await client.installChaincode({ chaincodePackage: serializedPackage, targets: [ peer ], txId });
        for (const proposalResponse of proposalResponses) {
            if (proposalResponse instanceof Error) {
                throw proposalResponse;
            }
        }
        console.log('Installed contract onto peer');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

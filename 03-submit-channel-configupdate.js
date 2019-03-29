const config = require('./config');
const Client = require('fabric-client');
const fs = require('fs-extra');
const certificate = fs.readFileSync('./local_fabric/certificate', 'utf8');
const privateKey = fs.readFileSync('./local_fabric/privateKey', 'utf8');
const fabprotos = require('fabric-protos');

(async () => {
    try {

        const encodedConfigUpdateEnvelope = await fs.readFile('channel-configupdate.bin');
        const configUpdateEnvelope = fabprotos.common.ConfigUpdateEnvelope.decode(encodedConfigUpdateEnvelope);
        const encodedConfigUpdate = configUpdateEnvelope.config_update;
        const signatures = configUpdateEnvelope.signatures;

        const client = new Client();
        await client.setAdminSigningIdentity(privateKey, certificate, 'Org1MSP');
        const orderer = client.newOrderer('grpc://localhost:17050');
        const txId = client.newTransactionID(true);
        const response = await client.createChannel({ name: config.channel, config: encodedConfigUpdate, txId, signatures, orderer });
        if (response.status !== 'SUCCESS') {
            throw new Error(response.info);
        }
        console.log('Submitted channel config update to ordering service');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

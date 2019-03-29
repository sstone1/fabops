const Client = require('fabric-client');
const fs = require('fs-extra');
const certificate = fs.readFileSync('./local_fabric/certificate', 'utf8');
const privateKey = fs.readFileSync('./local_fabric/privateKey', 'utf8');
const fabprotos = require('fabric-protos');

(async () => {
    try {

        let encodedConfigUpdateEnvelope = await fs.readFile('channel-configupdate.bin');
        const configUpdateEnvelope = fabprotos.common.ConfigUpdateEnvelope.decode(encodedConfigUpdateEnvelope);

        const client = new Client();
        await client.setAdminSigningIdentity(privateKey, certificate, 'Org1MSP');
        const configSignature = client.signChannelConfig(configUpdateEnvelope.config_update.toBuffer());
        configUpdateEnvelope.signatures.push(configSignature);

        encodedConfigUpdateEnvelope = fabprotos.common.ConfigUpdateEnvelope.encode(configUpdateEnvelope).toBuffer();

        await fs.writeFile('channel-configupdate.bin', encodedConfigUpdateEnvelope);
        console.log('Added config signature to channel config update in "channel-configupdate.bin"');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

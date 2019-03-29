const config = require('./config');
const Client = require('fabric-client');
const fs = require('fs-extra');
const certificate = fs.readFileSync('./local_fabric/certificate', 'utf8');
const privateKey = fs.readFileSync('./local_fabric/privateKey', 'utf8');
const fabprotos = require('fabric-protos');

(async () => {
    try {

        const client = new Client();
        await client.setAdminSigningIdentity(privateKey, certificate, 'Org1MSP');
        const channel = await client.newChannel(config.channel);
        const orderer = client.newOrderer('grpc://localhost:17050');
        const block = await channel.getGenesisBlock({ orderer });

        const encodedBlock = fabprotos.common.Block.encode(block).toBuffer();

        await fs.writeFile('channel-genesis-block.bin', encodedBlock);
        console.log('Fetched channel genesis block to "channel-genesis-block.bin"');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

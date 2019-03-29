const { Package } = require('fabric-client');
const fs = require('fs-extra');

(async () => {
    try {

        const package = await Package.fromDirectory({
            name: 'fabcar',
            version: '1.0.2',
            path: '/Users/sstone1/go/src/github.com/hyperledger/fabric-samples/chaincode/fabcar/javascript',
            type: 'node'
        });

        const serializedPackage = await package.toBuffer();
        await fs.writeFile('fabcar@1.0.2.cds', serializedPackage);
        console.log('Packaged contract to "fabcar@1.0.2.cds"');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

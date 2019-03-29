const config = require('./config');
const fabprotos = require('fabric-protos');
const fs = require('fs-extra');

(async () => {
    try {

        const configUpdate = new fabprotos.common.ConfigUpdate({
            channel_id: config.channel,
            read_set: {
                groups: {
                    Application: {
                        groups: {
                            Org1MSP: {

                            }
                        }
                    }
                },
                values: {
                    Consortium: {
                        value: fabprotos.common.Consortium.encode({
                            name: 'SampleConsortium'
                        })
                    }
                }
            },
            write_set: {
                groups: {
                    Application: {
                        groups: {
                            Org1MSP: {
                                
                            }
                        },
                        mod_policy: 'Admins',
                        policies: {
                            Admins: {
                                mod_policy: 'Admins',
                                policy: {
                                    type: 1, // SIGNATURE
                                    value: fabprotos.common.SignaturePolicyEnvelope.encode({
                                        rule: {
                                            n_out_of: {
                                                n: 1,
                                                rules: [
                                                    {
                                                        signed_by: 0
                                                    }
                                                ]
                                            }
                                        },
                                        identities: [
                                            {
                                                principal_classification: 0, // ROLE
                                                principal: fabprotos.common.MSPRole.encode({
                                                    msp_identifier: 'Org1MSP',
                                                    role: 1 // ADMIN
                                                })
                                            }
                                        ]
                                    })
                                }
                            },
                            Writers: {
                                mod_policy: 'Writers',
                                policy: {
                                    type: 1, // SIGNATURE
                                    value: fabprotos.common.SignaturePolicyEnvelope.encode({
                                        rule: {
                                            n_out_of: {
                                                n: 1,
                                                rules: [
                                                    {
                                                        signed_by: 0
                                                    }
                                                ]
                                            }
                                        },
                                        identities: [
                                            {
                                                principal_classification: 0, // ROLE
                                                principal: fabprotos.common.MSPRole.encode({
                                                    msp_identifier: 'Org1MSP',
                                                    role: 0 // MEMBER
                                                })
                                            }
                                        ]
                                    })
                                }
                            },
                            Readers: {
                                mod_policy: 'Readers',
                                policy: {
                                    type: 1, // SIGNATURE
                                    value: fabprotos.common.SignaturePolicyEnvelope.encode({
                                        rule: {
                                            n_out_of: {
                                                n: 1,
                                                rules: [
                                                    {
                                                        signed_by: 0
                                                    }
                                                ]
                                            }
                                        },
                                        identities: [
                                            {
                                                principal_classification: 0, // ROLE
                                                principal: fabprotos.common.MSPRole.encode({
                                                    msp_identifier: 'Org1MSP',
                                                    role: 0 // MEMBER
                                                })
                                            }
                                        ]
                                    })
                                }
                            }
                        },
                        version: 1
                    }
                },
                values: {
                    Consortium: {
                        value: fabprotos.common.Consortium.encode({
                            name: 'SampleConsortium'
                        })
                    }
                }
            }
        });

        const configUpdateEnvelope = new fabprotos.common.ConfigUpdateEnvelope({
            config_update: configUpdate.toBuffer()
        });
        const encodedConfigUpdateEnvelope = configUpdateEnvelope.toBuffer();
        await fs.writeFile('channel-configupdate.bin', encodedConfigUpdateEnvelope);
        console.log('Wrote channel config update to "channel-configupdate.bin"');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
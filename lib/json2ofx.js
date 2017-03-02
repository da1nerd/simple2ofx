"use strict";

const ofx = require('ofx');
const simpleRoutingNumber = '062201601';
const financialInstituteOrg = 'CompassBank';
const financialInstituteFID = '2201';

function makeOfxTrans(jsonTrans) {
    let type = jsonTrans.bookkeeping_type.toUpperCase();
    return {
        TRNTYPE: type,
        DTPOSTED: jsonTrans.times.when_received,
        TRNAMT: (type === 'DEBIT' ? -1 : 1) * jsonTrans.amounts.amount / 10000.0,
        FITID: jsonTrans.uuid,
        NAME: jsonTrans.description,
        MEMO: jsonTrans.raw_description
    };
}

module.exports = {
    convert: function(json, acctnum='0000000000') {
        acctnum = acctnum + ''; // force to string
        if(typeof json === 'string') json = JSON.parse(json);
        if(!json || !json.transactions || json.transactions.length === 0) return '';
        if(acctnum.length < 4) throw new Error('account number must be at least 4 characters long.');

        // take last 4 characters of account number
        acctnum = acctnum.substring(acctnum.length-5, acctnum.length-1);

        let periodStart = 0;
        let periodEnd = 0;

        let header = {
            OFXHEADER:'100',
            DATA:'OFXSGML',
            VERSION:'102',
            SECURITY:'NONE',
            ENCODING:'USASCII',
            CHARSET:'1252',
            COMPRESSION:'NONE',
            OLDFILEUID:'NONE',
            NEWFILEUID:'NONE'
        };
        let body = {
            SIGNONMSGSRQV1: {
                SONRS: {
                    STATUS: {
                        CODE: 0,
                        SEVERITY: 'INFO'
                    },
                    LANGUAGE: 'ENG',
                    FI: {
                        ORG: financialInstituteOrg,
                        FID: financialInstituteFID
                    },
                    APPID: 'SIMPLEOFX',
                    APPVER: '1'
                }
            },
            BANKMSGSRSV1: {
                STMTTRNRS: {
                    TRNUID: 0,
                    STATUS: {
                        CODE: 0,
                        SEVERITY: 'INFO'
                    },
                    STMTRS: {
                        CURDEF: 'USD',
                        BANKACCTFROM: {
                            BANKID: simpleRoutingNumber,
                            ACCTID: acctnum,
                            ACCTTYPE: 'CHECKING'
                        },
                        BANKTRANLIST: {
                            DTSTART: periodStart,
                            DTEND: periodEnd,
                            STMTTRN:[] // transactions go here
                        }
                        // ,
                        // LEDGERBAL: {
                        //     BALAMT: '',
                        //     DTASOF: ''
                        // },
                        // AVAILBAL: {
                        //     BALAMT: '',
                        //     DTASOF: ''
                        // }
                    }
                }
            }
        };
        for(let trns of json.transactions) {
            if(trns.times.when_received > periodEnd) periodEnd = trns.times.when_received;
            if(periodStart === 0 || trns.times.when_received < periodStart) periodStart = trns.times.when_received;
            body.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.push(makeOfxTrans(trns));
        }
        body.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.DTSTART = periodStart;
        body.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.DTEND = periodEnd;
        return ofx.serialize(header, body);
    }
};
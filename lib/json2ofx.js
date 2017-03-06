"use strict";

const ofx = require('ofx');
const simpleRoutingNumber = '062201601';
const financialInstituteOrg = 'CompassBank';
const financialInstituteFID = '2201';

function makeOfxTrans(jsonTrans) {
    let type = jsonTrans.bookkeeping_type.toUpperCase();
    let memo = jsonTrans.memo ? jsonTrans.memo : jsonTrans.raw_description;
    return {
        TRNTYPE: type,
        DTPOSTED: formatDate(jsonTrans.times.when_received),
        TRNAMT: (type === 'DEBIT' ? -1 : 1) * jsonTrans.amounts.amount / 10000.0,
        FITID: jsonTrans.uuid,
        NAME: jsonTrans.description,
        MEMO: memo
    };
}

/**
 *
 * @param time the UTC time in milliseconds
 * @return {string}
 */
function formatDate(time) {
    let date = new Date(time);
    let year = date.getFullYear();
    let month = padNumber(date.getMonth() + 1);
    let day = padNumber(date.getDate());
    let hrs = padNumber(date.getHours());
    let min = padNumber(date.getMinutes());
    let sec = padNumber(date.getSeconds());
    return `${year}${month}${day}${hrs}${min}${sec}`;
}

/**
 * Pads a number to at least 2 digits.
 * e.g. 1 becomes '01'
 *
 * @param num
 * @return {string|*}
 */
function padNumber(num) {
    num = num + '';
    if(num === '') throw new Error('num cannot be an empty string');
    if(isNaN(Number(num))) return num;
    num = num.replace(/^(0+)/, '').trim();
    while(num.length < 2) {
        num = '0' + num;
    }
    return num;
}

module.exports = {
    convert: function(json, acctnum='0000000000') {
        acctnum = acctnum + ''; // force to string
        if(typeof json === 'string') json = JSON.parse(json);
        if(!json || !json.transactions || json.transactions.length === 0) return '';
        if(acctnum.length < 4) throw new Error('account number must be at least 4 characters long.');

        // take last 4 characters of account number
        acctnum = acctnum.substring(acctnum.length-4, acctnum.length);

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
        body.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.DTSTART = formatDate(periodStart);
        body.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.DTEND = formatDate(periodEnd);
        return ofx.serialize(header, body);
    }
};
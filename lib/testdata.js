module.exports = {
    ofx:`OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRQV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<LANGUAGE>ENG
<FI>
<ORG>CompassBank
<FID>2201
</FI>
<APPID>SIMPLEOFX
<APPVER>1
</SONRS>
</SIGNONMSGSRQV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>0
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>USD
<BANKACCTFROM>
<BANKID>062201601
<ACCTID>5678
<ACCTTYPE>CHECKING
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>1488422344985
<DTEND>1488472597835
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>1488472597835
<TRNAMT>1500
<FITID>uuid1
<NAME>Transfer From Chase Personal
<MEMO>Transfer from Chase Personal
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>1488422344985
<TRNAMT>-33
<FITID>uuid2
<NAME>Little Caesars
<MEMO>LITTLE CAESARS 1       
</STMTTRN>
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>
`,
    json:`{
  "transactions":[
    {
      "uuid":"uuid1",
      "user_id":"userid",
      "record_type":"JOURNALENTRY",
      "transaction_type":"ach",
      "bookkeeping_type":"credit",
      "is_hold":false,
      "is_active":true,
      "running_balance":0,
      "raw_description":"Transfer from Chase Personal",
      "description":"Transfer From Chase Personal",
      "categories":[
        {
          "uuid":"186",
          "name":"Other Income",
          "folder":"Income",
          "folder_id":26
        }
      ],
      "geo":{
        "timezone":"UTC"
      },
      "times":{
        "when_recorded":1488472597211,
        "when_recorded_local":"2017-03-02 16:36:37.211",
        "when_received":1488472597835,
        "last_modified":1488472597835,
        "last_txvia":1488472597835
      },
      "amounts":{
        "amount":15000000,
        "cleared":15000000,
        "fees":0,
        "cashback":0,
        "base":15000000
      }
    },
    {
      "uuid":"uuid2",
      "user_id":"userid",
      "record_type":"HOLD",
      "transaction_type":"signature_purchase",
      "bookkeeping_type":"debit",
      "is_hold":true,
      "is_active":true,
      "running_balance":0,
      "raw_description":"LITTLE CAESARS 1       ",
      "description":"Little Caesars",
      "labels":[
        ""
      ],
      "categories":[
        {
          "uuid":"208",
          "name":"Fast Food",
          "folder":"Food & Drink",
          "folder_id":23
        }
      ],
      "geo":{
        "street":"",
        "city":"Salem",
        "state":"OR",
        "zip":"97317",
        "timezone":"America/Los_Angeles"
      },
      "times":{
        "when_recorded":1488422344140,
        "when_recorded_local":"2017-03-01 18:39:04.14",
        "when_received":1488422344985,
        "last_modified":1488422484698,
        "last_txvia":1488422484698
      },
      "amounts":{
        "amount":330000,
        "cleared":330000,
        "fees":0,
        "cashback":0,
        "base":330000
      }
    }
  ],
  "offset":480
}`
};
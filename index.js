#! /usr/bin/env node

var fs = require('fs');
var json2ofx = require('./lib/json2ofx');

var argv = require('yargs')
    .usage('Usage: simpleofx -a [account number] -f [input file] -o [output file]')
    .help('help')
    .alias('h', 'help')
    .alias('f', 'file')
    .describe('f', 'The json file to convert')
    .alias('o', 'output')
    .describe('o', 'The destination of the new ofx file')
    .alias('a', 'acct')
    .default('a', '0000')
    .describe('a', 'Specify the account number involved in the transactions')
    .strict(true)
    .demandOption(['f', 'o'])
    .argv;

console.log('Processing...');

let data = fs.readFileSync(argv.f, 'utf-8');
if(!data) {
    console.log('Source file is empty.');
    return;
}
let ofx = json2ofx.convert(data, argv.a);
if(!ofx) {
    console.log('Failed to generate ofx');
    return;
}
fs.writeFileSync(argv.o, ofx);
console.log('Finished!');

'use strict';

jest.unmock('ofx');
jest.unmock('../lib/testdata');
jest.unmock('../lib/json2ofx');

const json2ofx = require('../lib/json2ofx');
const testdata = require('../lib/testdata');

describe('Simple', () => {
    it('should convert simple\'s json transactions to ofx', () => {
        let newofx = json2ofx.convert(testdata.json);
        expect(newofx).toEqual(testdata.ofx);
    });
});
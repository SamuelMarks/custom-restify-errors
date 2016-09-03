import {expect} from 'chai';
import {WaterlineError, fmtError} from '../index';
const WLError = require('waterline/lib/waterline/error/WLError');

describe('WaterlineError', () => {
    it('E_UNIQUE should be pretty parsed', () => {
        let error = new WLError();
        error.code = 'E_UNIQUE';
        error.message = 'duplicate key value violates unique constraint "user_tbl_pkey"';
        error.invalidAttributes = [undefined];

        const fmt_err = fmtError(error);
        expect(fmt_err.body).to.eql({
            error: 'unique_violation',
            error_message: 'duplicate key value violates unique constraint "user_tbl_pkey"'
        });
        expect(fmt_err.statusCode).to.be.equal(400);
    });
});

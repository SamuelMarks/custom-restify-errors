import { expect } from 'chai';
import { fmtError, WaterlineError } from '../index';

/* tslint:disable:no-var-requires */
const WLError = require('waterline/lib/waterline/error/WLError');

describe('WaterlineError', () => {
    it('E_UNIQUE should be pretty parsed', () => {
        const error = new WLError();
        error.code = 'E_UNIQUE';
        error.message = 'duplicate key value violates unique constraint "user_tbl_pkey"';
        error.invalidAttributes = [undefined];

        const fmt_err = fmtError(error);
        expect(fmt_err.body).to.eql({
            error: 'unique_violation',
            error_message: error.message,
            error_code: error.code
        });
        expect(fmt_err.statusCode).to.be.equal(400);
    });
});

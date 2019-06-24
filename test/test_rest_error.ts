import { expect } from 'chai';
import { InternalServerError } from 'restify-errors';

import { GenericError } from '..';
import { RError } from '../index.d';

describe('GenericError', () => {
    it('GenericError should accept object arguments', () => {
        const body = {
            foo: 'bar',
            baz: 1
        };
        const error = new GenericError({
            cause: new TypeError('foo'),
            info: body,
            message: 'some message',
            statusCode: 400,
            name: 'GenericError'
        });
        error.code = 'E_UNIQUE';

        expect(error.statusCode).to.be.equal(400);
        expect(error.cause()).to.be.instanceof(TypeError);
        expect(error.code).to.be.equal('E_UNIQUE');
        expect(error.body).to.deep.equal({
            code: 'GenericError',
            error: 'GenericError',
            error_message: 'some message'
        });
        expect((error as any as RError).jse_info).to.deep.equal(body);
        console.info('GenericError =', error, ';');

        console.info('InternalServerError =', new InternalServerError({
            cause: new Error(),
            info: {
                foo: 'bar',
                baz: 1
            }
        }, 'wrapped'), ';');
    });
});

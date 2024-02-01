import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { InternalServerError } from 'restify-errors';

import { RError } from '../interfaces.d';
import { GenericError } from '..';


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

        assert.deepStrictEqual(error.statusCode, 400);
        assert.deepStrictEqual(error.cause() instanceof TypeError, true);
        assert.deepStrictEqual(error.code, 'E_UNIQUE');
        assert.deepStrictEqual(error.body, {
            code: 'GenericError',
            error: 'GenericError',
            error_message: 'some message'
        });
        assert.deepStrictEqual((error as any as RError).jse_info, body);
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

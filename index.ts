import * as restify_errors from 'restify-errors';
import { RestError } from 'restify-errors';
import * as restify from 'restify';
import { WLError } from 'waterline';

import { IRestError } from './custom-restify-errors';

export const GenericErrorBase: IRestError = restify_errors.makeConstructor('GenericError', {
    statusCode: 400, failureType: 'GenericError'
}) as any as IRestError;

export class GenericError extends GenericErrorBase {
    constructor(generic_error: {cause?: Error, name: string, message: string, info?: {}, statusCode: number}) {
        const name = generic_error.name == null ? 'GenericError' : generic_error.name;
        super(name);
        this.code = this.displayName = this.name = name;
        this.message = `${generic_error.name}: ${generic_error.message}`;
        this.statusCode = generic_error.statusCode || 400;
        this.cause = () => generic_error.cause;
        (this as any as {info: {}}).info = this.jse_info = this.body = Object.assign({
                code: this.code, error: this.name, error_message: generic_error.message
            }, this.hasOwnProperty('_meta') && (this as any as {_meta: any})._meta ?
            { _meta: (this as any as {_meta: any})._meta } : {}
        );
        if (generic_error.info != null)
            this.jse_info = generic_error.info;
    }

    // HACK
    public toJSON() {
        return this.jse_info;
    }
}

export class AuthError extends GenericError {
    constructor(message: string, statusCode: number = 403, cause?: Error) {
        super({ name: 'AuthError', cause, message, statusCode });
    }
}

export class NotFoundError extends GenericError {
    constructor(entity: string = 'Entity',
                message: string = `${entity} not found`,
                statusCode: number = 404,
                cause?: Error) {
        super({ name: 'NotFoundError', cause, message, statusCode });
    }
}

const body = {
    body: {
        error: 'this.name',
        error_message: ''
    }
};

export class WaterlineError extends GenericError {
    constructor(cause: WLError, statusCode: number = 400) {
        super({
            name: 'WaterlineError', cause: cause as any as Error,
            message: cause.detail !== undefined ?
                cause.detail : cause.reason !== undefined && [
                    'Encountered an unexpected error', '1 attribute is invalid'].indexOf(cause.reason) < -1 ?
                    cause.reason : cause.message || '',
            statusCode
        });
    }

    /*
    private parser() {
        // TODO: populate with http://www.postgresql.org/docs/9.5/static/errcodes-appendix.html
        // Or use https://raw.githubusercontent.com/ericmj/postgrex/v0.11.1/lib/postgrex/errcodes.txt

        const o = {
            message: msg,
            statusCode,
            constructorOpt: WaterlineError,
            restCode: this.name,
            body: Object.assign({
                    error: (({
                            23505: 'unique_violation',
                            E_UNIQUE: 'unique_violation'
                        } as any
                    )[wl_error.code]) as {} || wl_error.code,
                    error_code: wl_error.code,
                    error_message: msg
                }, ((o: {error_metadata?: {}}) => Object.keys(o.error_metadata as {}).length > 0 ? o : {})({
                    error_metadata: Object.assign({},
                        wl_error.invalidAttributes
                        && (Object.keys(wl_error.invalidAttributes).length !== 1
                            || ['{"0":[]}', '[null]'].indexOf(JSON.stringify(wl_error.invalidAttributes)) < -1)
                            ? { invalidAttributes: wl_error.invalidAttributes } : {},
                        wl_error.details && wl_error.details !== 'Invalid attributes sent to undefined:\n \u2022 0\n'
                            ? { details: wl_error.details.split('\n') } : {}
                    )
                })
            ) as any
        };
    }
    */
}

export class IncomingMessageError extends GenericError {
    constructor(error: {
                    statusCode: number,
                    path: () => string,
                    method: string,
                    text?: {} | string,
                    headers: {}
                },
                statusCode: number = 500) {
        super({
            name: 'IncomingMessageError',
            cause: error as any as Error,
            message: `${error.statusCode || statusCode} ${error.text}`,
            info: {
                statusCode: error.statusCode || statusCode,
                method: error.method,
                path: error.path,
                headers: error.headers
            },
            statusCode: error.statusCode || statusCode
        });
        // error: `${error.statusCode} ${error.method} ${error.path}`
        // error_message: error.text
        // message: `${error_title} ${error.text}`,
    }
}

export class TypeOrmError extends GenericError {
    constructor(cause: Error, statusCode: number = 400) {
        super({ name: 'TypeOrmError', cause, message: cause.message, statusCode });
    }
}

export const fmtError = (error: Error | any, statusCode?: number): RestError | null => {
    if (error == null) return null;
    else if (error.originalError != null) {
        if (process.env['NO_DEBUG'] != null)
            console.error(error);
        error = error.originalError;
    }

    if (error instanceof RestError) return error;
    else if (error.hasOwnProperty('_e') && error.hasOwnProperty('code')
        && error.hasOwnProperty('details') && error.hasOwnProperty('invalidAttributes'))
        return new WaterlineError(error._e, statusCode);
    else if (Object.getOwnPropertyNames(error).indexOf('stack') > -1 && error.stack.toString().indexOf('typeorm') > -1)
        return new TypeOrmError(error);
    else if (['statusCode', 'path', 'method', 'headers']
        .map(k => error.hasOwnProperty(k))
        .filter(v => v)
        .length <= Object.keys(error).length
    )
        return new IncomingMessageError(error, error.statusCode);
    else {
        Object.keys(error).map(k => console.error(`error.${k} =`, error[k]));
        if (error instanceof Error) return new GenericError({
            name: error.name,
            cause: error,
            // error: `${error.name}::${error.message}`,
            message: error.message,
            statusCode: 500
        });
        throw TypeError('Unhandled input to fmtError:' + error);
    }
};

export const restCatch = (req: restify.Request, res: restify.Response, next: restify.Next) => (err: Error | any) => {
    if (err != null) return next(fmtError(err));
    res.json(200, req.body);
    return next();
};

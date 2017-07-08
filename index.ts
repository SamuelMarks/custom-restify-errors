import { RestError } from 'restify-errors';
import { inherits } from 'util';

import { ICustomError, IGenericErrorArgs } from 'custom-restify-errors';

export const GenericError = function(this: RestError, args: IGenericErrorArgs): void {
    this.name = args.name || args.error;
    return RestError.call(this, {
            restCode: this.name,
            statusCode: args.statusCode,
            message: `${args.error}: ${args.error_message}`,
            constructorOpt: GenericError,
            body: {
                error: args.error,
                error_message: args.error_message
            }
        } as ICustomError
    );
} as any as {new (args: IGenericErrorArgs): RestError};
inherits(GenericError, RestError);

export const AuthError = function(this: RestError, msg: string = '', statusCode: number = 401) {
    this.name = 'AuthError';
    RestError.call(this, {
            restCode: this.name,
            statusCode,
            message: msg,
            constructorOpt: AuthError,
            body: {
                error: this.name,
                error_message: msg
            }
        } as ICustomError
    );
} as any as {new (msg: string, statusCode?: number): RestError};
inherits(AuthError, RestError);

export const NotFoundError = function(this: RestError, entity: string = 'Entity', msg: string = `${entity} not found`) {
    this.name = 'NotFoundError';
    RestError.call(this, {
            restCode: this.name,
            statusCode: 404,
            message: msg,
            constructorOpt: NotFoundError,
            body: {
                error: this.name,
                error_message: msg
            }
        } as ICustomError
    );
} as any as {new (entity?: string, msg?: string): RestError};
inherits(NotFoundError, RestError);

export const WaterlineError = function(this: RestError, wl_error: Error | any, statusCode = 400) {
    this.name = 'WaterlineError';

    const msg = wl_error.detail !== undefined ?
        wl_error.detail : wl_error.reason !== undefined && [
            'Encountered an unexpected error', '1 attribute is invalid'].indexOf(wl_error.reason) < -1 ?
            wl_error.reason : wl_error.message;
    /* TODO: populate with http://www.postgresql.org/docs/9.5/static/errcodes-appendix.html
     *  Or use https://raw.githubusercontent.com/ericmj/postgrex/v0.11.1/lib/postgrex/errcodes.txt
     */

    RestError.call(this, {
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
                }, ((o: {error_metadata?: {}}) => Object.keys(o.error_metadata).length > 0 ? o : {})({
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
        } as any // ICustomError
    );
}  as any as {new (wl_error: Error | any, statusCode?: number): RestError};
inherits(WaterlineError, RestError);

export const IncomingMessageError = function(this: RestError,
                                             error: {status: number, path: string, method: string, text: {} | string}) {
    this.name = 'IncomingMessageError';
    const error_title = `${error.status} ${error.method} ${error.path}`;
    RestError.call(this, {
            message: `${error_title} ${error.text}`,
            statusCode: 500,
            constructorOpt: IncomingMessageError,
            restCode: this.name,
            body: {
                error: error_title,
                error_message: error.text
            }
        }
    );
}  as any as {new (error: {status: number, path: string, method: string, text: {} | string}): RestError};
inherits(IncomingMessageError, RestError);

export const fmtError = (error: Error | any, statusCode = 400): RestError | null => {
    if (error == null) return null;
    else if (error.originalError != null) {
        if (process.env['NO_DEBUG'] != null)
            console.error(error);
        error = error.originalError;
    }

    if (error instanceof RestError) return error;
    else if (error.invalidAttributes != null || error.hasOwnProperty('internalQuery'))
        return new GenericError({
            name: 'WLError',
            error,
            error_message: error,
            statusCode
        } as IGenericErrorArgs);
    else if (['status', 'text', 'method', 'path'].map(
            k => error.hasOwnProperty(k)).filter(v => v).length === Object.keys(error).length)
        return new IncomingMessageError(error);
    else {
        Object.keys(error).map(k => console.error(k, '=', error[k]));
        throw TypeError('Unhandled input to fmtError:' + error);
    }
};

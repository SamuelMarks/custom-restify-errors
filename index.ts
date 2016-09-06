import {RestError} from 'restify';
import {inherits} from 'util';
import {WLError} from 'waterline';
import {CustomError, GenericErrorArgs} from 'restify-errors';

interface IObjectCtor extends ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}
declare var Object: IObjectCtor;

export function fmtError(error: WLError | Error | any, statusCode = 400) {
    if (!error) return null;
    else if (error.originalError) {
        if (!process.env['NO_DEBUG'])
            console.error(error);
        error = error.originalError;
    }

    if (error instanceof RestError) return error;
    else if (error.invalidAttributes || error.hasOwnProperty('internalQuery'))
        return new WaterlineError(error, statusCode);
    else if (['status', 'text', 'method', 'path'].map(
            k => error.hasOwnProperty(k)).filter(v => v).length === Object.keys(error).length)
        return new IncomingMessageError(error);
    else {
        Object.keys(error).map(k => console.error(k, '=', error[k]));
        throw TypeError('Unhandled input to fmtError:' + error)
    }
}

export function GenericError(args: GenericErrorArgs) {
    this.name = args.name || args.error;
    RestError.call(this, <CustomError>{
            restCode: this.name,
            statusCode: args.statusCode,
            message: `${args.error}: ${args.error_message}`,
            constructorOpt: GenericError,
            body: {
                error: args.error,
                error_message: args.error_message
            }
        }
    );
}
inherits(GenericError, RestError);

export function NotFoundError(entity: string = 'Entity', msg: string = `${entity} not found`) {
    this.name = 'NotFoundError';
    RestError.call(this, <CustomError>{
            restCode: this.name,
            statusCode: 404,
            message: msg,
            constructorOpt: NotFoundError,
            body: {
                error: this.name,
                error_message: msg
            }
        }
    );
}
inherits(NotFoundError, RestError);

export function WaterlineError(wl_error: WLError, statusCode = 400) {
    this.name = 'WaterlineError';

    const msg = wl_error.detail !== undefined ?
        wl_error.detail : wl_error.reason !== undefined && [
        'Encountered an unexpected error', '1 attribute is invalid'].indexOf(wl_error.reason) < -1 ?
        wl_error.reason : wl_error.message;

    RestError.call(this, <CustomError>{
            message: msg,
            statusCode: statusCode,
            constructorOpt: WaterlineError,
            restCode: this.name,
            body: Object.assign({
                    error: {
                        /* TODO: populate with http://www.postgresql.org/docs/9.5/static/errcodes-appendix.html
                         *  Or use https://raw.githubusercontent.com/ericmj/postgrex/v0.11.1/lib/postgrex/errcodes.txt
                         */
                        23505: 'unique_violation',
                        E_UNIQUE: 'unique_violation'
                    }[wl_error.code] || wl_error.code,
                    error_code: wl_error.code,
                    error_message: msg
                }, ((o: {error_metadata?: {}}) => Object.keys(o.error_metadata).length > 0 ? o : {})({
                    error_metadata: Object.assign({},
                        wl_error.invalidAttributes
                        && (Object.keys(wl_error.invalidAttributes).length !== 1
                        || ['{"0":[]}', '[null]'].indexOf(JSON.stringify(wl_error.invalidAttributes)) < -1)
                            ? {invalidAttributes: wl_error.invalidAttributes} : {},
                        wl_error.details && wl_error.details !== 'Invalid attributes sent to undefined:\n \u2022 0\n'
                            ? {details: wl_error.details.split('\n')} : {}
                    )
                })
            )
        }
    );
}
inherits(WaterlineError, RestError);

export function IncomingMessageError(error: {status: number, path: string, method: string, text: {}|string}) {
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
}
inherits(IncomingMessageError, RestError);
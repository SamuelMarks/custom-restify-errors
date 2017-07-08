import { RestError } from 'restify-errors';

export interface ICustomError {
    body: {
        error: string,
        error_message: string,
        error_metadata?: {}
    };
    statusCode: number;
    message: string;
    /* tslint:disable:ban-types */
    constructorOpt: Function;
    restCode: string;
}

export interface IGenericErrorArgs {
    name?: string;
    error: string;
    error_message: string;
    statusCode: number;
}

export declare const GenericError: new (args: IGenericErrorArgs) => RestError;
export declare const AuthError: new (msg: string, statusCode?: number) => RestError;
export declare const NotFoundError: new (entity?: string, msg?: string) => RestError;
export declare const WaterlineError: new (wl_error: any, statusCode?: number) => RestError;
export declare const IncomingMessageError: new (error: {
    status: number;
    path: string;
    method: string;
    text: string | {};
}) => RestError;
export declare const fmtError: (error: any, statusCode?: number) => RestError;

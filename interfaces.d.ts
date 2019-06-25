import { RestError } from 'restify-errors';
import * as VError from 'verror';

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

export interface IGenericErrorArgs extends VError {
    error: string;
    error_message: string;
    statusCode: number;
}

export type RError = RestError & {
    jse_info: {},
    jse_shortmsg: string,
    jse_cause: Error
};

export interface IRestError {
    _meta?: any;

    new(message: string): RError;

    new(obj: {cause: Error, info: {}}, message: string): RError;
}

/* tslint:disable:no-reference */
///<reference path="./node_modules/@types/restify/index.d.ts"/>

import * as restify_errors from 'restify-errors';
import { RestError } from 'restify-errors';
import * as VError from 'verror';
import { WLError } from 'waterline';
import * as restify from 'restify';

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

export declare const GenericErrorBase: IRestError;

export declare class GenericError extends GenericErrorBase {
    constructor(generic_error: {
        cause?: Error;
        name: string;
        message: string;
        info?: {};
        statusCode: number;
    });
}

export declare class AuthError extends GenericError {
    constructor(message: string, statusCode?: number, cause?: Error);
}

export declare class NotFoundError extends GenericError {
    constructor(entity?: string, message?: string, statusCode?: number, cause?: Error);
}

export declare class WaterlineError extends GenericError {
    constructor(cause: WLError, statusCode?: number);
}

export declare class IncomingMessageError extends GenericError {
    constructor(error: {
                    status: number;
                    path: string;
                    method: string;
                    text: {} | string;
                },
                statusCode?: number);
}

export declare class TypeOrmError extends GenericError {
    constructor(cause: Error, statusCode?: number);
}

export declare const fmtError: (error: any, statusCode?: number) => restify_errors.RestError | null;
export declare const restCatch: (req: restify.Request, res: restify.Response, next: restify.Next) => (err: any) => void;

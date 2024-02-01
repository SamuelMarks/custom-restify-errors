/// <reference path="typings/modules/waterline/index.d.ts" />
import { RestError } from 'restify-errors';
import * as restify from 'restify';
import { WLError } from 'waterline';
import { IRestError } from './interfaces.d';
export declare const GenericErrorBase: IRestError;
export declare class GenericError extends GenericErrorBase {
    constructor(generic_error: {
        cause?: Error;
        name: string;
        message: string;
        info?: {};
        statusCode: number;
    });
    toJSON(): {};
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
        statusCode: number;
        path: () => string;
        method: string;
        text?: {} | string;
        headers: {};
    }, statusCode?: number);
}
export declare class TypeOrmError extends GenericError {
    constructor(cause: Error, statusCode?: number);
}
export declare const fmtError: (error: Error | any, statusCode?: number) => RestError | null;
export declare const restCatch: (req: restify.Request, res: restify.Response, next: restify.Next) => (err: Error | any) => void;

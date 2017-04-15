import { WLError } from 'waterline';

declare const restify_errors: restify_errors.restify_errors;

/* tslint:disable:no-namespace no-internal-module */
declare module restify_errors {
    /* tslint:disable:class-name interface-name */
    export interface restify_errors {
        ICustomError: ICustomError;
        fmtError(error: WLError | Error | any, statusCode?: number);
        NotFoundError(string): void;
        WaterlineError(wl_error: WLError, statusCode?: number): void;
        AuthError(msg: string, statusCode?: number): void;
        IncomingMessageError(wl_error: WLError, statusCode?: number): void;
        GenericError(args: GenericErrorArgs): void;
    }

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

    export interface GenericErrorArgs {
        name?: string;
        error: string;
        error_message: string;
        statusCode: number;
    }
}

export = restify_errors;

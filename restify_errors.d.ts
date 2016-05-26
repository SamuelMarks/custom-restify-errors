import {WLError} from 'waterline';

declare var restify_errors: restify_errors.restify_errors;

declare module restify_errors {
    export interface restify_errors {
        fmtError(error: WLError | Error | any, statusCode?: number);
        CustomError: CustomError;
        NotFoundError(string): void;
        WaterlineError(wl_error: WLError, statusCode?: number): void;
    }

    export interface CustomError {
        body: {
            error: string,
            error_message: string,
            error_metadata?: {}
        };
        statusCode: number;
        message: string;
        constructorOpt: Function;
        restCode: string;
    }
}

export = restify_errors;
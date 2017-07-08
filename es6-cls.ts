import * as verror from 'verror';
import VError = require('verror');

class RestErrorBase extends Error implements VError {
    public cause = verror.cause as any;
    public info = verror.info;
    public fullStack = verror.fullStack;
    public findCauseByName = verror.findCauseByName;
    public hasCauseWithName = verror.hasCauseWithName;
    public errorFromList = verror.errorFromList;
    public errorForEach = verror.errorForEach;
    public name: string;
    public message: string;
    public restCode: string;
    public statusCode: string;
    public body: {error: string, error_message: string};
}

export class RestErrorC extends RestErrorBase {
    constructor(message: string, ...params: any[]) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RestErrorBase.prototype);
    }

    // constructor(options: VError.Options | Error, message: string, ...params: any[]);
    // constructor(message: string, ...params: any[]);
}
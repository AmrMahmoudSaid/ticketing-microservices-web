import {CustomError} from "./custom-error";

export class NotFound extends CustomError {
    statusCode = 404;
    constructor() {
        super('Route not found');
        Object.setPrototypeOf(this, NotFound.prototype);
    }
    serializeErrors(): { message: string; field?: string }[] {
        return [{message : 'Not found'}];
    }
}
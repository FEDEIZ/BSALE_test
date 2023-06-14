import { StatusCodes } from "http-status-codes";

export class BSaleError extends Error{
    public code: StatusCodes;
    public message: string;
    constructor(message: string, code: StatusCodes = 400){
        super(message);
        this.code = code;
    }
}

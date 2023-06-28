import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


export const fligthValidation = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        next();
      }
    else{
        const {id} = req.params;
        if(!(+id)){ 
            return res.status(StatusCodes.BAD_REQUEST).send({code: StatusCodes.BAD_REQUEST, message: "The flight id must be a number"})
        }
        next();
    }
}
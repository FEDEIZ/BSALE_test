import { NextFunction, Request, Response, Router } from "express";
import {autoCheckIn} from "./../controllers/autoCheckIn"
import { BSaleError } from "../utils";
import { StatusCodes } from "http-status-codes";

export default function checkIn(): Router {
    return Router()
        .get("/:id/passengers", async (req: Request, res:Response, next: NextFunction) => {
            const result = await autoCheckIn(req.params.id);
            if(!result.length) return res.status(StatusCodes.NOT_FOUND).send({code: StatusCodes.NOT_FOUND, data: {}})
            return res.send({code: StatusCodes.OK, data: result})
        })
    
}
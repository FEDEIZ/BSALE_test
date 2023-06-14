import { NextFunction, Request, Response, Router } from "express";
import {autoCheckIn} from "./../controllers/autoCheckIn"
import { BSaleError } from "../utils";
import { StatusCodes } from "http-status-codes";

export default function checkIn(): Router {
    return Router()
        .get("/:id/passengers", async (req: Request, res:Response, next: NextFunction) => {
            const result = await autoCheckIn(req.params.id);
            return res.send({code: StatusCodes.OK, data: result})
        })
    
}
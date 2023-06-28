import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AutoCheckInController } from "../controllers/autoCheckIn";
import { fligthValidation } from "../middlewares/validation";

export default function checkIn(controller: AutoCheckInController): Router {
    return Router()
        .get("/:id/passengers", fligthValidation, async (req: Request, res:Response, next: NextFunction) => {
            try{
                const result = await controller.getAutoCheckIn(req.params.id);
                return res.send({code: StatusCodes.OK, data: result})
            }
            catch(error){
                next(error);
            } 
        })
    
}
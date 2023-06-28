import { NextFunction, Request, Response } from "express";
import { getConnection } from "../../db";
import { StatusCodes } from "http-status-codes";
import { BSaleError } from "..";

export const configServer = (_req, res: Response, next: NextFunction) => {
    res
      .header("Access-Control-Allow-Origin", "*")
      .header(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
      )
      .header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
      );
    next();
}

export const healthServer =  async (_, res: Response, next: NextFunction) => {
      
    try{
      const connection = await getConnection();
          
      const isDbConnected = connection.isInitialized;
      const health = {
        timestamp: new Date(),
        status: isDbConnected ? "healthy" : "warning",
        db: isDbConnected ? "connected" : "disconnected",
      };
      res.status(StatusCodes.OK).json(health);
    }
    catch(err) {next(err)};
  }

export const errorServer = (err: BSaleError | Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof BSaleError) {
    if(err.code === StatusCodes.NOT_FOUND) return res.status(err.code).send({code: err.code, data: {}})
        return res.status(err.code || 400).send({
        code: err.code,
        errors: err.message
        });
  }
    console.log(err)
    return res.status(StatusCodes.BAD_REQUEST).send({ code: 400 , errors: 'could not connect to db'});
  
  }

export const notFoundServer = (_req: Request, res: Response, _next: NextFunction) =>
res.status(StatusCodes.BAD_REQUEST).send({ code: 400 , errors: 'NOT FOUND'})
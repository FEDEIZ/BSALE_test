import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan"
import {StatusCodes} from "http-status-codes"
import { getConnection } from "./db";

export async function createApp() : Promise<Express.Application> {
  
   const connection =  await getConnection();

    const app = express();

    app.use(express.json())
    app.use(morgan("dev"))
    app.use((_req, res: Response, next: NextFunction) => {
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
    })
      
    //routers
    app.get("/fligths", async (req: Request, res:Response) => {
     const connection = await getConnection();
     const result = await connection.manager.query(`SELECT * FROM flight`);
     return res.status(200).json(result);
     
    })
  
    
    app.get("/health", async (_, res: Response) => {
      const isDbConnected = connection.isInitialized;
      const health = {
        timestamp: new Date(),
        status: isDbConnected ? "healthy" : "warning",
        db: isDbConnected ? "connected" : "disconnected",
      };

      res.status(StatusCodes.OK).json(health);
    })
    
    app.use((_req, res: Response, next: NextFunction) => {
        return res.status(404).send("NOT FOUND!")
        //next(new BaseError('Not found', StatusCodes.NOT_FOUND));
    });
  
    // // Error handler middleware
    // app.use((err: BaseError | Error, _req: Request, res: Response, _next: NextFunction) => {
    //   if (err instanceof BaseError) {
    //   return res.status(err.statusCode || 500).send({
    //     error: true,
    //     message: err.message,
    //     description: err.description
    //   });
    // }
    //   console.log(err)
    //   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: true , message: 'Internal Server Error', describe: err.message });
    
    // });

  return app;
}



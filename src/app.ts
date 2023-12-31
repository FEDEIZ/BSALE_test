import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan"
import {StatusCodes} from "http-status-codes"
import { getConnection } from "./db";
import { BSaleError } from "./utils";
import checkIn from "./routes/autoCheckIn";

export async function createApp() : Promise<Express.Application> {

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
      
    app.get("/health", async (_, res: Response, next: NextFunction) => {
      
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
    })
    
    //Routers
    app.use("/flights", checkIn());
  
    app.use((err: BSaleError | Error, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof BSaleError) {
      if(err.code === StatusCodes.NOT_FOUND) return res.status(err.code).send({code: err.code, data: {}})
      return res.status(err.code || 400).send({
        code: err.code,
        errors: err.message
      });
    }
      console.log(err)
      return res.status(StatusCodes.BAD_REQUEST).send({ code: 400 , errors: 'could not connect to db'});
    
    });

    app.use("*", (_req: Request, res: Response, _next: NextFunction) =>
       res.status(StatusCodes.BAD_REQUEST).send({ code: 400 , errors: 'could not connect to db'})
    );

  return app;
}



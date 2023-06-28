import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan"
import {StatusCodes} from "http-status-codes"
import { getConnection } from "./db";
import { BSaleError } from "./utils";


import autoCheckIn from "./routes/autoCheckIn";
import {AutoCheckInController} from "./controllers/autoCheckIn"
import { GeneralDAO } from "./dao/general.dao";
import { configServer, errorServer, healthServer, notFoundServer } from "./utils/handlers";

// Data acces objects
const dao = new GeneralDAO();

// Controllers
const controller = new AutoCheckInController(dao);

//Routers
const autoCheckInRouter = autoCheckIn(controller);

export async function createApp() : Promise<Express.Application> {

    const app = express();

    app.use(express.json())
    app.use(morgan("dev"))
    app.use(configServer)
      
    app.get("/health", healthServer)
    

    app.use("/flights", autoCheckInRouter);
  
    app.use(errorServer);

    app.use("*", notFoundServer)
   

  return app;
}



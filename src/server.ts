import * as http from "http";
import { logger } from "./logger";
import dotenv from "dotenv";
dotenv.config();
// Routes


export default async function server(createAppFunction: any){

  const server: http.Server = http.createServer(await createAppFunction());

  const port = process.env.PORT;

  server
    .listen(port)
    .on("listening", () => {
      logger().info(`Listening on port ${port}`);
    })
    .on("error", (err) => {
      logger().error(err);
    });

  return server;
}

import dotenv from "dotenv";

import { logger } from "./logger";
import { DataSource } from "typeorm";



dotenv.config();

const MySQLDataSource = new DataSource({
  type: "mysql",
  synchronize: false,
  logging: false,
  host: process.env.DB_URL,
  //port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
  });
  
export async function getConnection(): Promise<DataSource> {
    const { isInitialized } = MySQLDataSource;
    if (!isInitialized) {
        return MySQLDataSource.initialize()
        .then((connection) => {
            logger().info("Connected to MySQL");
            return connection;
        })
        .catch((err) => {
            logger().error(err);
            return err;
        });
    }
    return MySQLDataSource;
}

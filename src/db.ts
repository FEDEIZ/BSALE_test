import dotenv from "dotenv";

import { logger } from "./logger";
import { DataSource } from "typeorm";
import fs from "fs";
import path from "path";


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

export async function dbToCache(conn : DataSource){
    try{
    const tables = ['flight', 'airplane', 'seat','boarding_pass', 'passenger', 'purchase', 'seat_type']
    
    for(let i=0; i<tables.length; i++){        
        let data = JSON.stringify(await conn.manager.query(`SELECT * FROM ${tables[i]}`), null, 2);
        const filePath = path.join(__dirname, "./../.cache", `${tables[i]}.json`);
        fs.writeFileSync(filePath, data);
        }
    }
    catch (err) {
        console.error(err);
      } finally {
        conn.destroy()
      }
}

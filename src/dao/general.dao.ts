import { DataSource, EntityManager, SelectQueryBuilder } from "typeorm";
import { getConnection } from "../db";

import { Passenger } from "../domain/passenger";
import { GeneralRepo } from "../repositories/general.repo";
import { BoardingPass } from "../domain/boardingPass";
import { Flight } from "../domain/flight";

export class GeneralDAO{

    async readFlight(id: string | undefined): Promise<Flight> {
        let sql = `SELECT * FROM flight WHERE flight.flight_id = ${id}`;
        const conn = await getConnection();
        const result = await conn.manager.query(sql);
        return result[0] as Flight;
    }

    async searchPassenger(query?: string | undefined): Promise<Passenger[]> {
        let sql = `SELECT * FROM passenger`;
        if(query){
            sql = query;
        }
        const conn = await getConnection();
        const result = await conn.manager.query(sql);
        return result as Passenger[];
    }
  
    async readSeats(id: number){
        let sql = `SELECT seat_id, seat_column, seat_row, seat_type_id 
                    FROM airplane a JOIN seat s 
                    ON a.airplane_id = s.airplane_id 
                    WHERE a.airplane_id = ${id}
                    ORDER BY s.seat_row ASC, s.seat_column ASC`

        const conn = await getConnection();
        const result = await conn.manager.query(sql);
        return result;
    }
}

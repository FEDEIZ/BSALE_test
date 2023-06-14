import { DataSource, EntityManager, SelectQueryBuilder } from "typeorm";
import { getConnection } from "../db";
import { BoardingPass } from "../domain/boardingPass";
import { BoardingPassRepo } from "../repositories/boardingPass.repo";

export class BoardingPassDAO implements BoardingPassRepo{

    read(id: string): Promise<BoardingPass> {
        throw new Error("Method not implemented.");
    }
    
    async search(querys?: string) : Promise<BoardingPass[]>{
        let sql = `SELECT * FROM boarding_pass`;
        if(querys){
            sql = querys;
        }
        const conn = await getConnection();
        const result = await conn.manager.query(sql);
        return result;
    };
    
}

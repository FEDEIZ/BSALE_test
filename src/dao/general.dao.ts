import { DataSource, EntityManager, SelectQueryBuilder } from "typeorm";
import { getConnection } from "../db";

import { Passenger } from "../domain/passenger";
import { GeneralRepo } from "../repositories/general.repo";
import { Flight } from "../domain/flight";
import { Seat, SeatType } from "../domain/seat";

export class GeneralDAO implements GeneralRepo{

    async readFlight(id: string | undefined): Promise<Flight | undefined> {
        let sql = `SELECT * FROM flight WHERE flight.flight_id = ${id}`;
        const conn = await getConnection();
        const result = await conn.manager.query(sql);
        if(result[0]){
            const flight: Flight = {
                flightId: result[0]['flight_id'],
                takeoffDateTime: result[0]['takeoff_date_time'],
                takeoffAirport: result[0]['takeoff_airport'],
                landingDateTime: result[0]['landing_date_time'],
                landingAirport: result[0]['landing_airport'],
                airplaneId: result[0]['airplane_id']
            }
            return flight as Flight;
        }
        return undefined;
    }

    async searchPassengerByFlight(id: string): Promise<Passenger[]> {
        let sql = `SELECT p.passenger_id, p.dni, p.name, p.age, p.country, bp.boarding_pass_id, bp.purchase_id, bp.seat_type_id, bp.seat_id
        FROM passenger p 
        JOIN boarding_pass bp ON p.passenger_id = bp.passenger_id 
        WHERE bp.flight_id = ${id}
        ORDER BY bp.seat_type_id, bp.purchase_id`;
        
        const conn = await getConnection();
        const result = await conn.manager.query(sql);
        const passenger : Passenger[] = [];
        for(let r of result){
            let p: Passenger = {
                passengerId: r['passenger_id'],
                dni: parseInt(r['dni']),
                name: r['name'],
                age: r['age'],
                country: r['country'],
                boardingPassId: r['boarding_pass_id'],
                purchaseId: r['purchase_id'],
                seatTypeId: r['seat_type_id'],
                seatId: r['seat_id'],
                seat: ""
            }
            passenger.push(p)
        }
        return passenger as Passenger[];
    }
  
    async readFreeSeats(id: string) {
        let sql = `SELECT s.seat_id, s.seat_column, s.seat_row, s.seat_type_id
                    FROM seat s 
                    JOIN airplane a ON s.airplane_id = a.airplane_id
                    JOIN flight f ON f.airplane_id = a.airplane_id               
                    WHERE f.flight_id = ${id}
                    ORDER BY s.seat_row,s.seat_column, s.seat_type_id;`;
        
        const conn = await getConnection();
        const result = await conn.manager.query(sql);
        
        const seats : Seat[] = [];

   
    
        for(let r of result){
            let p: Seat = {
                seatId: r['seat_id'],
                seatColumn: r['seat_column'],
                seatRow: r['seat_row'],
                seatTypeId: r['seat_type_id'],
                airplaneId: r['airplane_id']
            }
            seats.push(p)
        }
        
       
        // Ordeno y retorno asientos por cercania privilegiando la clase
        return [
            ...orderSeats(seats.filter(s => s.seatTypeId === SeatType.HC)),
            ...orderSeats(seats.filter(s => s.seatTypeId === SeatType.MC)),
            ...orderSeats(seats.filter(s => s.seatTypeId === SeatType.EC))
        ];
        
    }
}


function orderSeats(seats: Seat[]) {
    const orderedSeats : Seat[] = [];
    const orderedSeatsCR : object[] = [];
    const seatsCR = seats.map(s => {return {c: s.seatColumn.charCodeAt(0), r: s.seatRow}})
    // Ordenar los asientos por fila y columna
    seatsCR.sort((a, b) => {
      if (a.r !== b.r) {
        return a.r - b.r; // Ordenar por fila ascendente
      } else {
        return a.c - b.c; // Ordenar por columna ascendente
      }
    });
  
    orderedSeatsCR.push(seatsCR[0]); // Agregar el primer asiento a la lista ordenada
    seatsCR.splice(0, 1); // Eliminar el primer asiento del array original
  
    while (seatsCR.length) {
      let currentSeat = orderedSeatsCR[orderedSeatsCR.length - 1]; // Último asiento agregado
  
      // Buscar un asiento con igual fila pero columna adyacente
      let adjacentSeat = seatsCR.find(seat => seat.r === currentSeat['r'] && Math.abs(seat.c - currentSeat['c']) === 1);
  
      // Si no se encuentra, buscar un asiento con igual columna pero fila adyacente
      if (!adjacentSeat) {
        adjacentSeat = seatsCR.find(seat => seat.c === currentSeat['c'] && Math.abs(seat.r -currentSeat['r']) === 1);
      }
  
      // Si no se encuentra ninguno de los casos anteriores, buscar el asiento más cercano en distancia
      if (!adjacentSeat) {
        adjacentSeat = seatsCR.reduce((closestSeat, seat) => {
          const currentDistance = Math.abs(seat.c - currentSeat['c']) + Math.abs(seat.r - currentSeat['r']);
          const closestDistance = Math.abs(closestSeat.c - currentSeat['c']) + Math.abs(closestSeat.r - currentSeat['r']);
  
          return currentDistance < closestDistance ? seat : closestSeat;
        });
      }
  
      orderedSeatsCR.push(adjacentSeat); // Agregar el asiento encontrado a la lista ordenada
      seatsCR.splice(seatsCR.findIndex(seat => seat === adjacentSeat), 1); // Eliminar el asiento del array original
    }
    orderedSeatsCR.forEach(s => {
        let seat = seats.find(item => item.seatRow === s['r'] && item.seatColumn === String.fromCharCode(s['c']))
        if(seat) orderedSeats.push(seat);
    });
    return orderedSeats;
  }
  
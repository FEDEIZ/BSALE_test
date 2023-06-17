import { DataSource, EntityManager, SelectQueryBuilder } from "typeorm";
import { getConnection } from "../db";

import { Passenger } from "../domain/passenger";
import { GeneralRepo } from "../repositories/general.repo";
import { Flight } from "../domain/flight";
import { Seat, SeatType } from "../domain/seat";

export class GeneralDAO implements GeneralRepo{

    async readFlight(id: string | undefined): Promise<Flight> {
        let sql = `SELECT * FROM flight WHERE flight.flight_id = ${id}`;
        const conn = await getConnection();
        const result = await conn.manager.query(sql);
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
                seatId: r['seat_id']
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
        return [...ordenarAsientosCercania(seats.filter(s => s.seatTypeId === SeatType.HC)),
                ...ordenarAsientosCercania(seats.filter(s => s.seatTypeId === SeatType.MC)),
                ...ordenarAsientosCercania(seats.filter(s => s.seatTypeId === SeatType.EC))
                ] as Seat[];
        
    }
}

function calculateDistance(seat1: Seat, seat2: Seat): number {
    const distance = Math.abs(seat1.seatColumn.charCodeAt(0) - seat2.seatColumn.charCodeAt(0)) + Math.abs(seat1.seatRow - seat2.seatRow);
    return distance;
}
  
function ordenarAsientosCercania(asientos: Seat[]): Seat[] {
// Crear una copia del array original
const sortedAsientos: Seat[] = [...asientos];

// Obtener el primer asiento (puede ser aleatorio)
const currentSeat = sortedAsientos[0];

// Ordenar los asientos restantes basado en la distancia al asiento actual
sortedAsientos.sort((seat1, seat2) => {
    const distance1 = calculateDistance(currentSeat, seat1);
    const distance2 = calculateDistance(currentSeat, seat2);
    return distance1 - distance2;
});

return sortedAsientos;
}
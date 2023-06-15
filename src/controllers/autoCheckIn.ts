import { GeneralDAO } from "../dao/general.dao";
import { BoardingPass } from "../domain/boardingPass";
import { CheckIn } from "../domain/checkIn";
import { Passenger } from "../domain/passenger";

export const autoCheckIn = async (flightId: string) => {
    const checkIn : CheckIn = {
        takeOffDateTime: 0,
        takeOffAirport: "",
        landingDateTime: 0,
        landingAirport: "",
        airplaneId: 0,
        passengers: [],
        flightId: 0
    }

    
    const flight = await new GeneralDAO().readFlight(flightId);
    
    checkIn.flightId = flight.flight_id;
    checkIn.takeOffAirport = flight.takeoff_airport;
    checkIn.takeOffDateTime = flight.takeoff_date_time;
    checkIn.landingAirport = flight.landing_airport;
    checkIn.airplaneId = flight.airplane_id;
    
    
    const passengers = await new GeneralDAO().searchPassenger(`SELECT * FROM passenger p 
                                                                JOIN boarding_pass bp ON p.passenger_id = bp.passenger_id 
                                                                WHERE bp.flight_id = ${flightId}
                                                                ORDER BY bp.purchase_id`
                                                            );

    checkIn.passengers = await setSeats(checkIn.airplaneId, passengers);;
    return checkIn;
} 

async function setSeats(airplane: number, passengers : Passenger[]): Promise<Passenger[]>{
    const seats = await new GeneralDAO().readSeats(airplane);
    // LOGICA PARA ACOMODARLOS SEGUN CRITERIOS DEL TEST
    return passengers;
}

/*

[
  {
    "airplane_id": 1,
    "name": "AirNova-660"
  },
  {
    "airplane_id": 2,
    "name": "AirMax-720neo"
  }
]

*/
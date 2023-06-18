import { StatusCodes } from "http-status-codes";
import { GeneralDAO } from "../../dao/general.dao";
import { CheckIn } from "../../domain/checkIn";
import { BSaleError } from "../../utils";
import { setSeats } from "./setSeats";
import { orderFreeSeats  } from "./orderFreeSeats";
import { SeatType } from "../../domain/seat";


export default  async function(flightId: string) {
    const checkIn : CheckIn = {
      flightId: 0,
      takeoffDateTime: 0,
      takeoffAirport: "",
      landingDateTime: 0,
      landingAirport: "",
      airplaneId: 0,
      passengers: []
    }

    
    const flight = await new GeneralDAO().readFlight(flightId);
        
    if(flight) Object.assign(checkIn, flight);
    else throw new BSaleError("",StatusCodes.NOT_FOUND);
    
    
    const passengers = await new GeneralDAO().searchPassengerByFlight(flightId);
    
    const seats = await new GeneralDAO().searchSeatsByFlight(flightId )
    
    // Ordering seats for every seat type. HC has best priority
    const freeSeats = [
                        ...orderFreeSeats(seats.filter(s => s.seatTypeId === SeatType.HC)),
                        ...orderFreeSeats(seats.filter(s => s.seatTypeId === SeatType.MC)),
                        ...orderFreeSeats(seats.filter(s => s.seatTypeId === SeatType.EC))
                      ]

    checkIn.passengers = setSeats(freeSeats,passengers).map(({ seatRow,seatColumn, ...rest }) => rest);
    
    return checkIn;
}
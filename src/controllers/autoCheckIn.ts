import { StatusCodes } from "http-status-codes";
import { GeneralDAO } from "../dao/general.dao";
import { CheckIn } from "../domain/checkIn";
import { Passenger } from "../domain/passenger";
import { Seat } from "../domain/seat";
import { BSaleError } from "../utils";


export const autoCheckIn = async (flightId: string) => {
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
        
    Object.assign(checkIn, flight);
    
    
    const passengers = await new GeneralDAO().searchPassengerByFlight(flightId);
    
    // // PASAJEROS CON ASIENTO ASIGNADO AGREGO AL CHECKIN
    // passengers.filter(p => p.seatId).forEach(p => checkIn.passengers.push(p));

    const freeSeats = await new GeneralDAO().readFreeSeats(passengers.filter(p => p.seatId), flightId )
    
    return (freeSeats);
    console.log("pasajeros totales: " + passengers.length, "pasajeros con asiento: " + passengers.filter(p => p.seatId).length, "pasajeros sin asientos: " + passengers.filter(p => !p.seatId).length);
    
    return setSeats(freeSeats,passengers);

    //checkIn.passengers = [...setSeats(freeSeats,passengers)]
    return checkIn;
} 

function setSeats(freeSeats: Seat[], passengers : Passenger[]): Passenger[]{
    const passengerCheckIn : Passenger[] = [];

  // PASAJEROS CON ASIENTO ASIGNADO AGREGO AL CHECKIN
  passengers.filter(p => p.seatId).forEach(p => passengerCheckIn.push(p));
  
  const passengersToCheckIn = passengers.filter(p => !p.seatId);
  //VERIFICO ESPACIO RESTANTE PARA PASAJEROS SIN ASIENTO
  if(passengersToCheckIn.length > freeSeats.length) throw new BSaleError("There is no space left for this flight for all the passenger list without seat assigned")
  
  //ASIGNO ASIENTOS CON CRITERIO LOGICO

  const passengersByPurchaseId = groupPassengersByPurchaseId(passengersToCheckIn);

  


  return passengersToCheckIn;
}

function groupPassengersByPurchaseId(passengers: Passenger[]): Passenger[][] {
  const passengerMap: { [key: number]: Passenger[] } = {};

  // Agrupar los pasajeros por purchaseId
  for (const passenger of passengers) {
    if (passenger.purchaseId in passengerMap) {
      passengerMap[passenger.purchaseId].push(passenger);
    } else {
      passengerMap[passenger.purchaseId] = [passenger];
    }
  }

  // Convertir el objeto en un array de subarrays
  const groupedPassengers =  Object.values(passengerMap);

  // Los subarreglos se ordenan por clase
  groupedPassengers.sort((a, b) => a[0].seatTypeId - b[0].seatTypeId);

  // Cada sub-arreglo a su vez pone al principio un pasajero menor
  
  groupedPassengers.forEach((subarray) => {
    subarray.sort((a, b) => {
      if (a.age < 18 && b.age >= 18) {
        return 1; // Move passenger over 18 to the next index
      } else if (a.age >= 18 && b.age < 18) {
        return -1; // Move passenger under 18 to the previous index
      } else {
        return 0; // Maintain the original order
      }
    });
  });

  return groupedPassengers;
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
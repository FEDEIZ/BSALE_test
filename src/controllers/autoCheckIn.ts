import { StatusCodes } from "http-status-codes";
import { GeneralDAO } from "../dao/general.dao";
import { CheckIn } from "../domain/checkIn";
import { Passenger } from "../domain/passenger";
import { Seat, SeatType } from "../domain/seat";
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
        
    if(flight) Object.assign(checkIn, flight);
    else throw new BSaleError("",StatusCodes.NOT_FOUND);
    
    
    const passengers = await new GeneralDAO().searchPassengerByFlight(flightId);
    
    const seatsOrder = await new GeneralDAO().readFreeSeats(flightId )
    
    checkIn.passengers = setSeats(seatsOrder,passengers);
    
    return checkIn;
} 

function setSeats(seatsOrder: Seat[], passengers : Passenger[]): Passenger[]{
    const passengerCheckedIn : Passenger[] = [];


  // PASAJEROS CON ASIENTO ASIGNADO AGREGO AL CHECKIN
  passengers.filter(p => p.seatId).forEach(p => passengerCheckedIn.push(p));
  
  // ASIENTOS LIBRES Y OCUPADOS
  const fullSeats = passengers.filter(p => p.seatId).map(p => p.seatId);
  const freeSeats = seatsOrder.filter(s => !fullSeats.includes(s.seatId))


  //VERIFICO ESPACIO RESTANTE PARA PASAJEROS SIN ASIENTO
  const passengersToCheckIn = passengers.filter(p => !p.seatId);
  if(passengersToCheckIn.length > freeSeats.length) throw new BSaleError("There is no space left for this flight for all the passenger list without seat assigned")
  
  //ASIGNO ASIENTOS CON CRITERIO LOGICO

  const passengersByPurchaseId = groupPassengersByPurchaseId(passengersToCheckIn);

  


  while(passengersToCheckIn.length){
    for(let purchase of passengersByPurchaseId){

        for(let i=0; i<purchase.length;i++){
          purchase[i].seatId = freeSeats[0].seatId;
          // purchase[i].seatColumn = freeSeats[0].seatColumn;
          // purchase[i].seatRow = freeSeats[0].seatRow;
          passengerCheckedIn.push(purchase[i])
          freeSeats.shift();
          let index = passengersToCheckIn.findIndex(p => p.dni === purchase[i].dni);
          passengersToCheckIn.splice(index, 1); 
        }       
    
    }

  }
  
  // console.log(passengerCheckedIn.find((p, index) => {
  //   if(p[index +1]) return p[index].age <18 && p[index].purchaseId !== p[index+1].purchaseId  }));
  // const minors = passengerCheckedIn.filter(p => p.age <18);
  // console.log(passengerCheckedIn.filter(p => minors.some(m => m.purchaseId === p.purchaseId )));
  return passengerCheckedIn;
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
        return -1; 
      } else if (a.age >= 18 && b.age < 18) {
        return 1; 
      } else {
        return 0; 
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
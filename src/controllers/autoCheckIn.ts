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
          purchase[i].seatColumn = freeSeats[0].seatColumn;
          purchase[i].seatRow = freeSeats[0].seatRow;
          passengerCheckedIn.push(purchase[i])
          freeSeats.shift();
          let index = passengersToCheckIn.findIndex(p => p.dni === purchase[i].dni);
          passengersToCheckIn.splice(index, 1); 
        }       
    
    }

  }
  
  //Ultimo chequeo para menores
  const minors = passengerCheckedIn.filter(p => p.age <18);

  for(let i=0; i<minors.length; i++){
    
    let minorIndex = passengerCheckedIn.findIndex( p => p.dni === minors[i].dni);
    let companion = [passengerCheckedIn[minorIndex-1], passengerCheckedIn[minorIndex+1]];

    if(!companion.some(c => c.seatRow === minors[i].seatRow && c.purchaseId === minors[i].purchaseId)){


      const strange = companion.find(c => c.purchaseId !== minors[i].purchaseId);
      const indexStrange = passengerCheckedIn.findIndex(p => p.dni === strange?.dni);
      const adult = companion.find(c => c.purchaseId === minors[i].purchaseId);
      const indexAdult = passengerCheckedIn.findIndex(p => p.dni === adult?.dni);

      if(adult && strange){
      let aux = {...strange};
        strange.seatId = adult.seatId;
        strange.seatRow = adult.seatRow;
        strange.seatColumn = adult.seatColumn;

        adult.seatId = aux.seatId;
        adult.seatRow = aux.seatRow;
        adult.seatColumn = aux.seatColumn;

        passengerCheckedIn[indexAdult] = adult;
        passengerCheckedIn[indexStrange] = strange;

      }


    }
  }
  
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
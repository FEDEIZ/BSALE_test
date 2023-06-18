import { Passenger } from "../../domain/passenger";
import { Seat } from "../../domain/seat";
import { BSaleError } from "../../utils";
import { checkForMinors } from "./checkMinors";
import { groupPassengersByPurchaseId } from "./groupPassenger";

export function setSeats(seatsOrder: Seat[], passengers : Passenger[]): Passenger[]{
    let passengerCheckedIn : Passenger[] = [];


  //Check In Passenger with assigned seats
  passengers.filter(p => p.seatId).forEach(p => passengerCheckedIn.push(p));
  
  // Free and ocupated seats
  const fullSeats = passengers.filter(p => p.seatId).map(p => p.seatId);
  const freeSeats = seatsOrder.filter(s => !fullSeats.includes(s.seatId))


  //Verify if there is enough space for the rest
  const passengersToCheckIn = passengers.filter(p => !p.seatId);
  if(passengersToCheckIn.length > freeSeats.length) throw new BSaleError("There is no space left for this flight for all the passenger list without seat assigned")
  
  //Beggining to assign seats

  //Group passengers by purchase
  const passengersByPurchaseId = groupPassengersByPurchaseId(passengersToCheckIn);

  // Assigns seats for every purchase
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
  
  //Last check for minors so they sit by side an adult
  passengerCheckedIn = checkForMinors([...passengerCheckedIn]);
  
  return passengerCheckedIn;
}
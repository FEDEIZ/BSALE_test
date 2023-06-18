import { Passenger } from "../../domain/passenger";

export function checkForMinors(passengerCheckedIn: Passenger[]): Passenger[]{
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
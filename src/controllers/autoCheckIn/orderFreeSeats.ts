import { Seat } from "../../domain/seat";

export function orderFreeSeats(seats: Seat[]) {

    const orderedSeats : Seat[] = [];
    const orderedSeatsCR : object[] = [];
    const seatsCR = seats.map(s => {return {c: s.seatColumn.charCodeAt(0), r: s.seatRow}})
    // Order by row and column

    seatsCR.sort((a, b) => {
      if (a.r !== b.r) {
        return a.r - b.r; 
      } else {
        return a.c - b.c; 
      }
    });
  
    // initial order
    orderedSeatsCR.push(seatsCR[0]); 
    seatsCR.splice(0, 1); 
  
    // order seats
    while (seatsCR.length) {
      let currentSeat = orderedSeatsCR[orderedSeatsCR.length - 1]; 
  
      // adjacent by column
      let adjacentSeat = seatsCR.find(seat => seat.r === currentSeat['r'] && Math.abs(seat.c - currentSeat['c']) === 1);
  
      // adjacent by row
      if (!adjacentSeat) {
        adjacentSeat = seatsCR.find(seat => seat.c === currentSeat['c'] && Math.abs(seat.r -currentSeat['r']) === 1);
      }
  
      // Look for the next closest
      if (!adjacentSeat) {
        adjacentSeat = seatsCR.reduce((closestSeat, seat) => {
          const currentDistance = Math.abs(seat.c - currentSeat['c']) + Math.abs(seat.r - currentSeat['r']);
          const closestDistance = Math.abs(closestSeat.c - currentSeat['c']) + Math.abs(closestSeat.r - currentSeat['r']);
  
          return currentDistance < closestDistance ? seat : closestSeat;
        });
      }
  
      orderedSeatsCR.push(adjacentSeat); // Add the seat
      seatsCR.splice(seatsCR.findIndex(seat => seat === adjacentSeat), 1);
    }

    orderedSeatsCR.forEach(s => {
        let seat = seats.find(item => item.seatRow === s['r'] && item.seatColumn === String.fromCharCode(s['c']))
        if(seat) orderedSeats.push(seat);
    });
    return orderedSeats;
  }
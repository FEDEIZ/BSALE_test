import { Passenger } from "../../domain/passenger";

export function groupPassengersByPurchaseId(passengers: Passenger[]): Passenger[][] {
    const passengerMap: { [key: number]: Passenger[] } = {};
  
    // Group passengers by purchaseId
    for (const passenger of passengers) {
      if (passenger.purchaseId in passengerMap) {
        passengerMap[passenger.purchaseId].push(passenger);
      } else {
        passengerMap[passenger.purchaseId] = [passenger];
      }
    }
  
    const groupedPassengers =  Object.values(passengerMap);
  
    // Passengers ordered by seat type. From HC to EC
    groupedPassengers.sort((a, b) => a[0].seatTypeId - b[0].seatTypeId);
  
  
    // Every group put a minor first
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
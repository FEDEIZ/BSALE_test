import { GeneralDAO } from "../dao/general.dao";
import { BoardingPass } from "../domain/boardingPass";
import { CheckIn } from "../domain/checkIn";

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

    // const boardingPasses =  await new GeneralDAO().searchBP( `SELECT bp.purchase_id, bp.passenger_id, bp.seat_type_id, bp.seat_id FROM boarding_pass bp 
    //                                                             WHERE bp.flight_id = ${flightId}
    //                                                             ORDER BY bp.purchase_id`);
    
    const flight = await new GeneralDAO().readFlight(flightId);
    
    checkIn.flightId = flight.flight_id;
    checkIn.takeOffAirport = flight.takeoff_airport;
    checkIn.takeOffDateTime = flight.takeoff_date_time;
    checkIn.landingAirport = flight.landing_airport;
    checkIn.airplaneId = flight.airplane_id;
    
    // let purchaseIndex = boardingPasses[0].purchase_id; // first purchase_id
    // const bpByPurchase = [boardingPasses.filter(bp => bp.purchase_id === purchaseIndex)]; // initial value
    // let subArray: BoardingPass[] = [];
    // purchaseIndex = boardingPasses[bpByPurchase[0].length].purchase_id; // second purchase_id
    
    // for(let i = bpByPurchase[0].length ; i<boardingPasses.length; i++){
    //     if(boardingPasses[i].purchase_id === purchaseIndex){
    //         subArray.push(boardingPasses[i]);
    //     }
    //     else{
    //         bpByPurchase.push(subArray);
    //         subArray = [];
    //         purchaseIndex =  boardingPasses[bpByPurchase[0].length].purchase_id
    //     }
    // }

    const passengers = await new GeneralDAO().searchPassenger(`SELECT * FROM passenger p 
                                                                JOIN boarding_pass bp ON p.passenger_id = bp.passenger_id 
                                                                WHERE bp.flight_id = ${flightId}
                                                                ORDER BY bp.purchase_id`
                                                            );

   

    checkIn.passengers = passengers;
    return checkIn;
} 



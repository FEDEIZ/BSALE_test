import { BoardingPassDAO } from "../dao/boardingPass.dao";
import { BoardingPass } from "../domain/boardingPass";

export const autoCheckIn = async (flightId: string) => {
    const boardingPasses =  await new BoardingPassDAO().search( `SELECT bp.purchase_id, bp.passenger_id, bp.seat_type_id, bp.seat_id FROM boarding_pass bp 
                                                                WHERE bp.flight_id = ${flightId}
                                                                ORDER BY bp.purchase_id`);
    
    //const passenger = await new PassangerDAO().search(`SELECT * FROM passanger`);
    
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

    


    return boardingPasses;
} 



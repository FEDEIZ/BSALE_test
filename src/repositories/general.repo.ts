import { Flight } from "../domain/flight";
import { Passenger } from "../domain/passenger";
import { Seat } from "../domain/seat";

export interface GeneralRepo {
    readFlight(id :string): Promise<Flight | undefined>;
    searchPassengerByFlight(id: string): Promise<Passenger[]>;
    searchSeatsByFlight(id: string): Promise<Seat[]>
    
}
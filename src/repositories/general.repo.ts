import { Flight } from "../domain/flight";
import { Passenger } from "../domain/passenger";

export interface GeneralRepo {
    readFlight(id :string): Promise<Flight | undefined>;
    searchPassengerByFlight(id: string): Promise<Passenger[]>;
    
}
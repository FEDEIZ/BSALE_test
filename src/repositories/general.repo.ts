import { BoardingPass } from "../domain/boardingPass";
import { Flight } from "../domain/flight";
import { Passenger } from "../domain/passenger";
import { ICRUD } from "../utils/interfaces/ICRUD";
import { ISearch } from "../utils/interfaces/ISearch";

export interface GeneralRepo {
    readFlight(id :string): Promise<Flight>;
    searchPassenger(query?: string): Promise<Passenger[]>;
}
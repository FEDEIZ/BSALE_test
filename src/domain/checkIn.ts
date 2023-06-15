import { Passenger } from "./passenger";

export interface CheckIn{
    flightId: number,
    takeOffDateTime: number,
    takeOffAirport: string, 
    landingDateTime: number, 
    landingAirport: string,
    airplaneId: number,
    passengers: Passenger[]
}
import { Passenger } from "./passenger";

export interface CheckIn{
    flightId: string,
    takeOffDateTime: number,
    takeOffAirport: string, 
    landingDateTime: number, 
    landingAirport: string,
    airplaneId: number,
    passengers: Passenger[]
}
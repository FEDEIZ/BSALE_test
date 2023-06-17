import { Passenger } from "./passenger";

export interface CheckIn{
    flightId: number,
    takeoffDateTime: number,
    takeoffAirport: string, 
    landingDateTime: number, 
    landingAirport: string,
    airplaneId: number,
    passengers: Passenger[]
}
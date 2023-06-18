
export interface CheckIn{
    flightId: number,
    takeoffDateTime: number,
    takeoffAirport: string, 
    landingDateTime: number, 
    landingAirport: string,
    airplaneId: number,
    passengers: any[]
}
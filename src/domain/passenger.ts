export interface Passenger{
    passengerId: number,
    dni: number,
    name: string,
    age: number,
    country: string,
    boardingPassId: number,
    purchaseId: number,
    seatTypeId: number,
    seatId: number | null;
    seat: string,
}
export interface Seat {
    seatId: number | null;
    seatColumn: string;
    seatRow: number;
    seatTypeId: number;
    airplaneId: number
}

export enum SeatType{
    "HC" = 1,
    "MC" = 2,
    "EC" = 3
}
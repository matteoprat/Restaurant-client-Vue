import { Reservation, Reservations } from "./interfaces";

function formatUniqueID(date: Date, time: number, table: number): string {
  // uniqueID will be like 01-01-2022|0|1 where 0 is the time ID and 1 is the table ID
  const stringDate = date.toISOString().slice(0, 10);
  return `${stringDate}|${String(time)}|${String(table)}`;
}

function formatUniqueID2(date: string, time: number, table: number): string {
  // uniqueID will be like 01-01-2022|0|1 where 0 is the time ID and 1 is the table ID
  return `${date}|${String(time)}|${String(table)}`;
}

function buildReservationList(data: Reservation[]): Reservations {
  const reservations: Reservations = {};
  data.forEach((element) => {
    const uniqueID = formatUniqueID(
      new Date(element.booking_date),
      element.booking_time,
      element.booking_table
    );
    reservations[uniqueID] = element;
  });
  return reservations;
}

function dataFromUniqueID(uniqueID: string): string[] {
  return uniqueID.split("|");
}

export {
  formatUniqueID,
  formatUniqueID2,
  buildReservationList,
  dataFromUniqueID,
};

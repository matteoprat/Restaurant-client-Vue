interface Customer {
  id: number;
  name: string;
  email: string;
}

interface Reservation {
  id: number;
  customer_id: number;
  booking_date: Date;
  booking_table: number;
  booking_time: number;
  booked_seats: number;
}

interface Reservations {
  [propName: string]: Reservation;
}

export { Customer, Reservation, Reservations };

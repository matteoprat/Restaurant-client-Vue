import { Customer, Reservations } from "./interfaces";

const loadCustomers = async (): Promise<Customer[] | null> => {
  const response = await fetch("http://localhost:5000/api/customer");
  const data = await response.json();
  return data.result;
};

const loadReservations = async (
  fromDate: string,
  toDate: string
) => {
  const goodFrom = new Date(fromDate).toISOString().slice(0, 10);
  const goodTo = new Date(toDate).toISOString().slice(0, 10);
  const response = await fetch(
    `http://localhost:5000/api/reservations?from=${encodeURIComponent(
      goodFrom
    )}&to=${encodeURIComponent(goodTo)}`
  );
  const result = await response.json();
  if (result.message === "Success") {
    return result.data;
  } else {
    return result.message;
  }
};

const deleteReservation = async (reservationID: number): Promise<string[]> => {
  const response = await fetch(
    "http://localhost:5000/api/reservations/" + String(reservationID),
    {
      method: "DELETE",
    }
  );
  const result = await response.json();
  return result.message === "Success" ? [result.message] : result.message;
};

interface ReservationData {
  date: Date;
  time: string;
  table: string;
  customer: string;
  nseats: string;
}

const insertReservation = async (
  reservationData: ReservationData
): Promise<string[]> => {
  const response = await fetch("http://localhost:5000/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reservationData),
  });
  const result = await response.json();

  return result.message === "Success" ? [result.message] : result.message;
};

interface UpdateData {
  newCustomerID: string;
  newSeats: string;
}

const editReservation = async (
  updateData: UpdateData,
  reservationID: string
): Promise<string[]> => {
  const response = await fetch(
    "http://localhost:5000/api/reservations/" + reservationID,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    }
  );
  const result = await response.json();
  return result.message === "Success" ? [result.message] : result.message;
};

export {
  loadCustomers,
  loadReservations,
  deleteReservation,
  insertReservation,
  editReservation,
};

<template>
  <div id="reservation-window">
    <div class="reservation-container">
      <div class="reservation-row">
        <h3>Booking for {{ displayDate }} - table {{ displayTable }}</h3>
      </div>
      <div class="reservation-row">
        <h4>Time: {{ timeZone[reservation.booking_time] }}</h4>
      </div>

      <slot v-if="success === false && error === false">
        <div class="reservation-row">
          <label for="email">Email: </label>
          <select
            class="customer-select"
            v-model="customerID"
            @change="username = customerList[customerID].name"
          >
            <option v-for="(customer, i) in customerList" :value="i" :key="i">
              {{ customer.email }}
            </option>
          </select>
        </div>
        <div class="reservation-row">
          <label for="name">Name:</label>
          <input
            type="text"
            name="customerName"
            v-model="username"
            disabled="true"
          />
        </div>
        <div class="reservation-row">
          <label for="seats">People: </label>
          <select name="seats" class="customer-select" v-model="seats">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div class="reservation-row">
          <button
            class="customer-button"
            name="submit"
            @click="editThisReservation"
          >
            Edit Reservation
          </button>
          <button class="btn-delete" name="closewindow" @click="closeWindow">
            Close Window
          </button>
        </div>
      </slot>

      <slot v-else-if="success === true">
        <div class="reservation-row">
          The reservation has been changed successfully.
        </div>
        <div class="reservation-row">
          <button
            class="customer-button"
            name="closewindow"
            @click="closeWindowEdited"
          >
            Close Window
          </button>
        </div>
      </slot>

      <slot v-else>
        <div class="reservation-row">Something went wrong.</div>
        <div class="reservation-row">
          <ul>
            <li v-for="(mess, idx) in messages" :key="'err-' + idx">
              {{ mess }}
            </li>
          </ul>
        </div>
        <div class="reservation-row">
          <button
            class="customer-button"
            name="closewindow"
            @click="closeWindow"
          >
            Close Window
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Customer } from "@/libs/interfaces";
import { editReservation } from "@/libs/dbActions";
export default defineComponent({
  name: "EditReservation",
  emits: ["close", "edited"],
  props: ["customerList", "reservation"],
  setup(props) {
    const tmpCustomers: Customer[] = [...props.customerList];
    const timeZone = {
      "0": "19:00 - 20:00",
      "1": "20:00 - 21:00",
      "2": "21:00 - 22:00",
      "3": "22:00 - 23:00",
      "4": "23:00 - 24:00",
    };
    const [year, month, day] = props.reservation.booking_date.split("-");
    const displayDate = ref<string>(day + "-" + month + "-" + year);
    const displayTable = ref<string>(
      String(props.reservation.booking_table + 1)
    );

    const customerID = ref<number>(
      tmpCustomers.findIndex((data) => data.email === props.reservation.email)
    );
    const username = ref<string>(tmpCustomers[customerID.value].name);
    const seats = ref<number>(props.reservation.booked_seats);

    const messages = ref<Array<string>>([""]);
    const success = ref<boolean>(false);
    const error = ref<boolean>(false);

    return {
      timeZone,
      displayDate,
      displayTable,
      customerID,
      username,
      seats,
      messages,
      success,
      error,
    };
  },
  methods: {
    closeWindow() {
      this.$emit("close");
    },
    closeWindowEdited() {
      this.$emit("edited");
    },
    async editThisReservation() {
      this.messages = await editReservation(
        {
          newCustomerID: this.customerList[this.customerID].id,
          newSeats: String(this.seats),
        },
        this.reservation.id
      );
      if (this.messages[0] === "Success") {
        this.success = true;
      } else {
        this.error = true;
      }
    },
  },
});
</script>

<template>
  <div id="reservation-window">
    <div class="reservation-container">
      <div class="reservation-row">
        <h3>
          Book table # {{ String(Number(table) + 1) }} for {{ displayDate }}
        </h3>
      </div>
      <div class="reservation-row">
        <h4>Time: {{ timeZone[time] }}</h4>
      </div>

      <slot v-if="!errorValues.length && success === false">
        <div class="reservation-row">
          <label for="email">Email:</label>
          <select
            v-if="customerList.length"
            class="customer-select"
            v-model="customerID"
            @change="username = customerList[customerID].name"
          >
            <option v-for="(customer, i) in customerList" :value="i" :key="i">
              {{ customer.email }}
            </option>
          </select>
          <select v-else class="customer-select" v-model="customerID">
            <option :value="customerID">No users inside database</option>
          </select>
        </div>

        <div class="reservation-row">
          <label for="name">Name:</label>
          <input type="text" v-model="username" disabled="true" />
        </div>

        <div class="reservation-row">
          <label for="seats">People: </label>
          <select v-model="seats" name="seats" class="customer-select">
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
            @click="addReservation"
            :disabled="customerID === -1"
          >
            Add Reservation
          </button>
          <button
            class="btn-delete"
            name="closewindow"
            @click="toggleAddWindow"
          >
            Close Window
          </button>
        </div>
      </slot>

      <slot v-else-if="!errorValues.length && success === true">
        <div class="reservation-row">
          Successfully reserved for {{ seats }} people.<br />
          Customer: {{ username }}
        </div>
        <div class="reservation-row">
          <button
            class="customer-button"
            name="closewindow"
            @click="closeUpdate"
          >
            Close Window
          </button>
        </div>
      </slot>

      <slot v-else>
        <div class="reservation-row">
          Something went wrong:<br />
          <ul>
            <li v-for="(error, idx) in errorValues" :key="idx">{{ error }}</li>
          </ul>
        </div>
        <div class="reservation-row">
          <button class="customer-button" name="submit" @click="retry">
            Retry
          </button>
          <button
            class="btn-delete"
            name="closewindow"
            @click="toggleAddWindow"
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
import { dataFromUniqueID } from "@/libs/reservationID";
import { insertReservation } from "@/libs/dbActions";

export default defineComponent({
  name: "AddReservation",
  emit: ["close"],
  props: ["uniqueID", "toggleAddWindow", "customerList"],
  setup(props) {
    // Unique ID related data
    const split: string[] = dataFromUniqueID(props.uniqueID);
    const date = ref<string>(split[0]);
    const time = ref<number>(Number(split[1]));
    const table = ref<number>(Number(split[2]));

    // display date format
    const [year, month, day] = date.value.split("-");
    const displayDate = ref<string>(day + "-" + month + "-" + year);

    // Customer default user
    const customerID = props.customerList.length
      ? ref<number>(0)
      : ref<number>(-1);
    const username = props.customerList.length
      ? ref<string>(props.customerList[0].name)
      : ref<string>("");

    const timeZone = ref({
      0: "19:00 - 20:00",
      1: "20:00 - 21:00",
      2: "21:00 - 22:00",
      3: "22:00 - 23:00",
      4: "23:00 - 24:00",
    });

    // Seats
    const seats = ref<number>(1);

    const errorValues = ref<Array<string>>([]);
    const success = ref<boolean>(false);

    return {
      date,
      time,
      table,
      customerID,
      username,
      seats,
      errorValues,
      timeZone,
      displayDate,
      success,
    };
  },
  methods: {
    async addReservation() {
      const reservationData = {
        date: new Date(this.date),
        time: String(this.time),
        table: String(this.table),
        customer: String(this.customerList[this.customerID].id),
        nseats: String(this.seats),
      };
      const reply = await insertReservation(reservationData);

      if (reply[0] === "Success") {
        this.success = true;
      } else {
        this.errorValues = [...reply];
      }
    },
    retry() {
      this.errorValues = [];
      this.success = false;
    },
    closeUpdate() {
      this.$emit("close");
      this.toggleAddWindow();
    },
  },
});
</script>

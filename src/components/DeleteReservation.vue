<template>
  <div id="delete-window">
    <div class="delete-container">
      <div class="delete-row">
        <h3>Reservation for {{ displayDate }}</h3>
      </div>

      <slot v-if="success === false && error === false">
        <div class="delete-row">
          Email: {{ reservationData.email }} Name:
          {{ reservationData.name }} Seats: {{ reservationData.booked_seats }}
        </div>
        <div class="reservation-row">
          <button
            class="btn-delete"
            name="submit"
            @click="deleteThisReservation()"
          >
            Delete Reservation
          </button>
          <button
            class="customer-button"
            name="closewindow"
            @click="closeWindow()"
          >
            Close Window
          </button>
        </div>
      </slot>

      <slot v-else-if="success === true">
        <div class="delete-row">Reservation successfully deleted</div>
        <button
          class="customer-button"
          name="closewindow"
          @click="closeWindowDeleted()"
        >
          Close Window
        </button>
      </slot>

      <slot v-else>
        <div class="delete-row">
          Something went wrong:
          <ul>
            <li v-for="(mess, idx) in message" :key="'error' + idx">
              {{ mess }}
            </li>
          </ul>
        </div>
        <button
          class="customer-button"
          name="closewindow"
          @click="closeWindow()"
        >
          Close Window
        </button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { deleteReservation } from "@/libs/dbActions";
export default defineComponent({
  name: "DeleteReservation",
  emits: ["close", "deleted"],
  props: ["reservationData"],
  setup(props) {
    const [year, month, day] = props.reservationData.booking_date.split("-");
    const displayDate = ref<string>(day + "-" + month + "-" + year);
    const success = ref<boolean>(false);
    const error = ref<boolean>(false);
    const message = ref<Array<string>>([""]);

    return { displayDate, success, error, message };
  },
  methods: {
    closeWindow() {
      this.$emit("close");
    },
    closeWindowDeleted() {
      this.$emit("deleted");
    },
    async deleteThisReservation() {
      this.message = [""];
      const result = await deleteReservation(this.reservationData.id);
      if (result[0] === "Success") {
        this.success = true;
      } else {
        this.success = false;
        this.error = true;
        this.message = [...result];
      }
    },
  },
});
</script>

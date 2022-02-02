<template>
  <td v-if="!reservations.hasOwnProperty(uniqueID)" className="tg-0lax cols">
    <div className="row-btn">
      <div className="table-detail">
        Free:
        <button
          className=" btn-small"
          :name="'add' + uniqueID"
          value="add"
          @click="addReservation(uniqueID)"
        >
          Add
        </button>
      </div>
    </div>
  </td>
  <td v-else className="tg-0lax cols">
    <div className="row-btn">
      <div className="table-detail">
        <span
          :title="
            reservations[uniqueID].name +
            ' ' +
            reservations[uniqueID].email +
            ' People:' +
            reservations[uniqueID].booked_seats
          "
          >RESERVED</span
        >
        <button
          className="btn-edit btn-small"
          :name="'edit' + uniqueID"
          value="edit"
          @click="editReservation(uniqueID)"
        >
          Edit
        </button>
        <button
          className="btn-delete btn-small"
          :name="'delete' + uniqueID"
          value="delete"
          @click="delReservation(uniqueID)"
        >
          Delete
        </button>
      </div>
    </div>
  </td>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TableCell",
  props: [
    "reservations",
    "uniqueID",
    "addReservation",
    "delReservation",
    "editReservation",
  ],
  data: () => {
    return {
      timeZone: {
        0: "19:00 - 20:00",
        1: "20:00 - 21:00",
        2: "21:00 - 22:00",
        3: "22:00 - 23:00",
        4: "23:00 - 24:00",
      },
    };
  },
});
</script>

<template>
  <tr v-for="time in [0, 1, 2, 3, 4]" :key="date + String(time)">
    <td>{{ timeZone[time] }}</td>
    <slot
      v-for="table in [0, 1, 2, 3, 4]"
      :key="date + String(time) + String(table)"
    >
      <TableCell
        :uniqueID="`${date}|${String(time)}|${String(table)}`"
        :reservations="reservations"
        :addReservation="addReservation"
        :editReservation="editReservation"
        :delReservation="delReservation"
      />
    </slot>
  </tr>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TableCell from "@/components/TableCell.vue";
export default defineComponent({
  name: "TableRow",
  components: { TableCell },
  props: [
    "reservations",
    "day",
    "date",
    "addReservation",
    "editReservation",
    "delReservation",
  ],
  setup() {
    const timeZone = ref({
      0: "19:00 - 20:00",
      1: "20:00 - 21:00",
      2: "21:00 - 22:00",
      3: "22:00 - 23:00",
      4: "23:00 - 24:00",
    });
    return { timeZone };
  },
});
</script>

<template>
  <table class="tg" v-for="(date, day) in dates" :key="day">
    <thead>
      <tr>
        <th class="tg-0pky" colspan="6">
          <h1 class="date">{{ calcCurrentDate(date) }}</h1>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="tg-0lax col1">TIME</td>
        <td class="tg-0lax cols">TABLE #1</td>
        <td class="tg-0lax cols">TABLE #2</td>
        <td class="tg-0lax cols">TABLE #3</td>
        <td class="tg-0lax cols">TABLE #4</td>
        <td class="tg-0lax cols">TABLE #5</td>
      </tr>
      <TableRow
        :reservations="reservations"
        :day="day"
        :date="date"
        :delReservation="delReservation"
        :addReservation="addReservation"
        :editReservation="editReservation"
      />
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TableRow from "@/components/TableRow.vue";
export default defineComponent({
  name: "Tables",
  components: { TableRow },
  props: [
    "reservations",
    "days",
    "dates",
    "addReservation",
    "editReservation",
    "delReservation",
  ],
  methods: {
    calcCurrentDate(date: string): string {
      const [year, month, dayN] = date.split("-");
      return dayN + "-" + month + "-" + year;
    },
  },
});
</script>

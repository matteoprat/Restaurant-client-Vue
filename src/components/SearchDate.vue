<template>
  <section id="searchbox-section">
    <div id="form1">
      <span class="exlabel">Select a day:</span>
      <div class="react-datepicker-wrapper">
        <div class="react-datepicker__input-container">
          <Datepicker
            v-model="newDate"
            :range="true"
            :format="formatDate"
            :enableTimePicker="false"
            @update:modelValue="changeDate()"
          >
            <template #clear-icon> </template>
          </Datepicker>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Datepicker from "vue3-date-time-picker";
import "vue3-date-time-picker/dist/main.css";

export default defineComponent({
  name: "SearchDate",
  components: { Datepicker },
  emits: ["updateDates"],
  props: ["range"],
  data: (props) => {
    return {
      newDate: props.range as Date[],
    };
  },
  methods: {
    formatDate() {
      if (!this.newDate[1]) {
        this.newDate[1] = this.newDate[0];
      }
      const day1 = this.newDate[0].getDate();
      const month1 = this.newDate[0].getMonth() + 1;
      const year1 = this.newDate[0].getFullYear();

      const day2 = this.newDate[1].getDate();
      const month2 = this.newDate[1].getMonth() + 1;
      const year2 = this.newDate[1].getFullYear();
      return `From ${day1}/${month1}/${year1} to ${day2}/${month2}/${year2}`;
    },
    changeDate() {
      if (!this.newDate[1]) {
        this.newDate[1] = this.newDate[0];
      }
      this.$emit("updateDates", [...this.newDate]);
    },
  },
});
</script>

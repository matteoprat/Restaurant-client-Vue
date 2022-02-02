<template>
  <Header />
  <CustomerSection
    @updateCustomerList="updateCustomerList()"
    @deletedCustomer="updateBoth()"
    :customerList="customerList"
  />
  <SearchDate :range="range" @updateDates="newDates" />
  <Tables
    :reservations="reservationList"
    :dates="dates"
    :delReservation="delReservation"
    :addReservation="addReservation"
    :editReservation="editReservation"
  />
  <AddReservation
    v-if="toggleAdd === true"
    :customerList="customerList"
    :uniqueID="uniqueID"
    :toggleAddWindow="toggleAddWindow"
    @close="updateReservations"
  />
  <DeleteReservation
    v-if="toggleDelete === true"
    :reservationData="reservationList[uniqueID]"
    @close="toggleDeleteWindow"
    @deleted="removedReservation"
  />
  <EditReservation
    v-if="toggleEdit === true"
    :customerList="customerList"
    :reservation="reservationList[uniqueID]"
    @close="toggleEditWindow"
    @edited="editedReservation"
  />
  <div>&nbsp;</div>

  <div id="alert"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import "@/assets/styles/App.css";
import CustomerSection from "@/components/CustomerSection.vue";
import Header from "@/components/Header.vue";
import SearchDate from "@/components/SearchDate.vue";
import Tables from "@/components/Tables.vue";
import AddReservation from "@/components/AddReservation.vue";
import DeleteReservation from "@/components/DeleteReservation.vue";
import EditReservation from "@/components/EditReservation.vue";
import { loadCustomers, loadReservations } from "@/libs/dbActions";
import { Customer, Reservations } from "@/libs/interfaces";
import { buildReservationList } from "@/libs/reservationID";

export default defineComponent({
  name: "App",
  components: {
    Header,
    CustomerSection,
    SearchDate,
    Tables,
    AddReservation,
    DeleteReservation,
    EditReservation,
  },
  setup() {
    // Setting up date variables
    const dateFrom = new Date();
    const dateTo = new Date();
    const range = ref<Array<Date>>([dateFrom, dateTo]);

    // Loading reservation list from database
    const reservationList = ref<Reservations|Array<string>>({});
    const days = ref<number>(1);
    // loading customer list from database
    const customerList = ref<Array<Customer>|null>([]);

    // controller for add / edit / delete windows
    const toggleAdd = ref<boolean>(false);
    const toggleEdit = ref<boolean>(false);
    const toggleDelete = ref<boolean>(false);

    const dates = ref<Array<string>>([dateFrom.toISOString().slice(0, 10)]);

    // store for uniqueID returned from cells add / edit / delete buttons
    const uniqueID = ref<string>("");

    onMounted(async () => {
      customerList.value = await loadCustomers();
      reservationList.value = buildReservationList(
        await loadReservations(dateFrom.toString(), dateTo.toString())
      );
    });

    return {
      dateFrom,
      dateTo,
      reservationList,
      customerList,
      range,
      days,
      toggleAdd,
      toggleEdit,
      toggleDelete,
      uniqueID,
      dates,
    };
  },
  methods: {
    toggleAddWindow() {
      this.toggleAdd = !this.toggleAdd;
    },
    toggleEditWindow() {
      this.toggleEdit = !this.toggleEdit;
    },
    toggleDeleteWindow() {
      this.toggleDelete = !this.toggleDelete;
    },
    async newDates(newDates: Date[]) {
      this.range[0] = newDates[0];
      this.range[1] = newDates[1];

      // compute number of days between dates
      this.days = Math.ceil(
        (newDates[1].getTime() - newDates[0].getTime()) / (3600 * 24 * 1000) + 1
      );

      // reset and refill the dates variables used to create tables and uniqueIDs
      this.dates = [];
      for (let i = 0; i < this.days; i++) {
        this.dates.push(
          new Date(newDates[0].getTime() + 3600 * 24 * 1000 * i)
            .toISOString()
            .slice(0, 10)
        );
      }

      // loading data from reservations again
      await this.updateReservations();
    },
    async updateCustomerList() {
      // update customer list *by fetching database*
      this.customerList = await loadCustomers();
    },
    async updateReservations() {
      this.reservationList = buildReservationList(
        await loadReservations(
          this.range[0].toString(),
          this.range[1].toString()
        )
      );
    },
    async updateBoth() {
      await this.updateCustomerList();
      await this.updateReservations();
    },
    addReservation(uniqueID: string) {
      this.uniqueID = uniqueID;
      this.toggleAddWindow();
    },
    delReservation(uniqueID: string) {
      this.uniqueID = uniqueID;
      this.toggleDeleteWindow();
    },
    editReservation(uniqueID: string) {
      this.uniqueID = uniqueID;
      this.toggleEditWindow();
    },
    async removedReservation() {
      await this.updateReservations();
      this.toggleDeleteWindow();
    },
    async editedReservation() {
      this.updateReservations();
      this.toggleEditWindow();
    },
  },
});
</script>

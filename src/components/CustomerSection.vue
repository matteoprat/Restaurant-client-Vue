<template>
  <section id="customer-section">
    <div id="customer-box">
      <select
        class="customer-select"
        v-model="currentView"
        @change="sectionControl()"
      >
        <option value="add">add customer</option>
        <option value="edit">edit customer</option>
        <option value="delete">delete customer</option>
      </select>

      <form v-if="currentView === 'add'" @submit.prevent="addCustomer()">
        <label for="name">Name: </label>
        <input
          type="text"
          class="customer-input"
          name="customerName"
          v-model="username"
          required="true"
        />
        <label for="email">Email: </label>
        <input
          class="customer-input"
          type="email"
          id="email"
          name="email"
          v-model="email"
        />
        <button class="customer-button" name="submit">ADD CUSTOMER</button>
      </form>

      <form v-else-if="currentView === 'edit'" @submit.prevent="editCustomer()">
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
        <label for="name">Name:</label>
        <input v-if="customerList.length" type="text" v-model="username" />
        <input v-else type="text" name="customerName" disabled="true" />
        <button
          class="customer-button"
          name="submit"
          :disabled="!customerList.length"
        >
          EDIT CUSTOMER
        </button>
      </form>

      <form v-else @submit.prevent="deleteCustomer()">
        <label for="email">Email:</label>
        <select
          v-if="customerList.length"
          class="customer-select"
          v-model="customerID"
        >
          <option v-for="(customer, i) in customerList" :value="i" :key="i">
            {{ customer.email }}
          </option>
        </select>
        <select v-else class="customer-select" v-model="customerID">
          <option value="-1">No users inside database</option>
        </select>
        <button
          class="customer-button"
          name="submit"
          :disabled="!customerList.length"
        >
          DELETE CUSTOMER
        </button>
      </form>
    </div>
  </section>
  <teleport to="#teleport-target">
    <AlertWindow
      v-if="toggleAlert == true"
      :msg="message"
      :alertType="alertType"
      @close="toggleAlertWindow()"
    />
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  execAddCustomer,
  execEditCustomer,
  execDeleteCustomer,
} from "@/libs/customers";
import AlertWindow from "@/components/AlertWindow.vue";

export default defineComponent({
  name: "CustomerSection",
  props: ["customerList"],
  emits: ["updateCustomerList", "deletedCustomer"],
  components: {
    AlertWindow,
  },
  setup() {
    const username = ref<string>("");
    const email = ref<string>("");
    const currentView = ref<string>("add");
    const toggleAlert = ref<boolean>(false);
    const customerID = ref<number>(0);
    const message = ref<Array<string>>([]);
    const alertType = ref<string>("info");

    return {
      username,
      email,
      currentView,
      toggleAlert,
      customerID,
      message,
      alertType,
    };
  },
  methods: {
    toggleAlertWindow() {
      this.toggleAlert = !this.toggleAlert;
    },
    async addCustomer() {
      // Try to add a new customer, if no errors append the new customer to the customer list
      const message = await execAddCustomer(this.email, this.username);
      if (message === "Success") {
        this.message = [message];
        this.alertType = "info";
        this.$emit("updateCustomerList");
      } else {
        this.message = [...message];
        this.alertType = "warning";
      }
      this.toggleAlert = true;
    },
    async editCustomer() {
      // Try to edit an existing customer by changing its name, if success update customer list
      const message = await execEditCustomer(
        this.customerList[this.customerID].id,
        this.username
      );
      if (message === "Success") {
        this.message = [message];
        this.alertType = "info";
        this.$emit("updateCustomerList");
      } else {
        this.message = [...message];
        this.alertType = "warning";
      }
      this.toggleAlert = true;
    },
    async deleteCustomer() {
      // Try to delete an existing customer from database, if successfully require from db data again
      const message = await execDeleteCustomer(
        this.customerList[this.customerID].id
      );
      if (message === "Success") {
        this.message = [message];
        this.alertType = "info";
        this.$emit("deletedCustomer");
      } else {
        this.message = [...message];
        this.alertType = "warning";
      }
      this.toggleAlert = true;
    },
    sectionControl() {
      if (this.currentView === "edit" && this.customerList.length) {
        this.username = this.customerList[0].name;
      } else {
        this.username = "";
        this.email="";
      }
    },
  },
});
</script>

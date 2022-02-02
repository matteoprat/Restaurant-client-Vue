<template>
  <div class="alert-window">
    <div :class="'inner-alert alert-' + alertType">
      <div v-for="(message, i) in msg" :key="i">{{ message }}</div>
      <div>&nbsp;</div>
      <button name="close" value="close" @click="closeBtn">CLOSE</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AlertWindow",
  emits: ["close"],
  props: ["alertType", "msg"],
  methods: {
    closeBtn() {
      this.$emit("close");
    },
  },
});
</script>

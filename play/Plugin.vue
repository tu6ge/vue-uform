<script setup>
import { ref } from "vue";
const val = ref("abc");
</script>
<template>
  <div>
    <u-field v-model="val" v-slot="{ value, update }">
      <!-- <input :value="value" @input="update($event.target.value)" /> -->
      <input f-model />
    </u-field>
  </div>
</template>

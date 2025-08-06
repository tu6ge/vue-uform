<script setup>
import { ref } from "vue";
const value = ref("abc");
</script>
<template>
  <div>
    <input f-model:value />
    <input :value="value" />
  </div>
</template>

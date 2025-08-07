<script setup>
import { ref } from "vue";
const val = ref("abc");
import { NInput } from "naive-ui";
import { ElInput } from "element-plus";
const val2 = ref("ccc");
</script>
<template>
  <div>
    <u-field v-model="val" v-slot="{ value, update }">
      <!-- <input :value="value" @input="update($event.target.value)" /> -->
      <input f-model />
      <n-input f-model:value></n-input>
      <ElInput f-model></ElInput>
    </u-field>

    <n-input v-model:value="val2"></n-input>
    <ElInput v-model="val2"></ElInput>
  </div>
</template>

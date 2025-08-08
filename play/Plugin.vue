<script setup>
import { ref } from "vue";
const val = ref("abc");
import { NInput } from "naive-ui";
import { ElInput } from "element-plus";
const val2 = ref("foo2");
const val3 = ref("foo");
</script>
<template>
  <div>
    <u-field v-model="val2" v-slot="{ value, update }">
      <input type="radio" value="foo1" f-model />
      <input type="radio" value="foo2" f-model />
      <input type="radio" value="foo3" f-model />
    </u-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const val = ref("abc");
import { NInput, NRadio, NMention, NRate, NTransfer } from "naive-ui";
import { ElInput } from "element-plus";
const val2 = ref("Definitely Maybe");
const val3 = ref("0");
const options = [
  {
    label: "07akioni",
    value: "07akioni",
  },
  {
    label: "star-kirby",
    value: "star-kirby",
  },
  {
    label: "广东路",
    value: "广东路",
  },
  {
    label: "颐和园路5号",
    value: "颐和园路5号",
  },
];

const val4 = ref("content");
</script>
<template>
  <div>
    val2: {{ val2 }}
    <u-field v-model="val2" v-slot="{ value, update }">
      <n-mention type="textarea" f-model:value :options="options" />
    </u-field>

    val3: {{ val3 }}
    <u-field v-model="val3" v-slot="{ value, update }">
      <n-rate f-model:value />
    </u-field>

    val4: {{ val4 }}
    <u-field v-model="val4" v-slot="{ value, update }">
      <textarea f-model></textarea>
      <input type="tel" f-model />
    </u-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const val1 = ref("A");
const val2 = ref(["A", "B"]);
</script>
<template>
  <div>
    val1: {{ val1 }}
    <u-field v-model="val1" v-slot="{ value, update }">
      <select :value="value" @change="update($event.target.value)">
        <option disabled value="">Please select one</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>
    </u-field>

    <u-field v-model="val1" v-slot="{ value, update }">
      <select f-model>
        <option disabled value="">Please select one</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>
    </u-field>

    val2: {{ JSON.stringify(val2) }}
    <u-field v-model="val2" v-slot="{ value, update }">
      <select
        @change="
          update(
            Array.from($event.target.selectedOptions).map(
              (option) => option.value
            )
          )
        "
        multiple
      >
        <option disabled value="">Please select one</option>
        <option :selected="value.find((res) => res == 'A')">A</option>
        <option :selected="value.find((res) => res == 'B')">B</option>
        <option :selected="value.find((res) => res == 'C')">C</option>
      </select>
    </u-field>

    <u-field v-model="val2" v-slot="{ value, update }">
      <select f-model multiple>
        <option disabled value="">Please select one</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>
    </u-field>
  </div>
</template>

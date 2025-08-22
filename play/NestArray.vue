<script setup lang="ts">
import { ref } from "vue";

let formValues: { name: string[] } = {
  name: [],
};
formValues.name[1] = "foo";

const list = ref<number[]>([]);
list.value = [0, 1, 2];

function onSave(data: {}) {
  alert(JSON.stringify(data, null, 2));
}

function removeItem(index: number) {
  list.value.splice(index, 1);
}
function addItem() {
  list.value.push(2);
}
</script>
<template>
  <u-form :values="formValues" @submit="onSave">
    <div v-for="(item, key) in list">
      <u-field
        :name="`name[${item}]`"
        :label="`Name #${key + 1}`"
        v-slot="{ value, update }"
      >
        <input f-model />

        <button type="button" @click="removeItem(key)">Remove Item</button>
      </u-field>
    </div>

    <button type="button" @click="addItem">Add Item</button>
    <u-submit></u-submit>
  </u-form>
</template>
<style>
input {
  border: 1px solid #000000 !important;
}
</style>

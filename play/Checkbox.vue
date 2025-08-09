<script setup lang="ts">
import { ref } from "vue";
const val1 = ref<Boolean>(false);
const val2 = ref<Array<string>>(["foo1", "foo2"]);
</script>
<template>
  <div>
    val1:{{ val1 }}
    <u-field v-model="val1" v-slot="{ value, update }">
      <input
        type="checkbox"
        :checked="value"
        @change="update($event.target.checked)"
      />
    </u-field>

    val2 :{{ JSON.stringify(val2) }}
    <u-field v-model="val2" v-slot="{ value, update }">
      <input
        type="checkbox"
        :checked="value.find((res) => res == 'foo1') != undefined"
        value="foo1"
        @change="update('foo1', 'array')"
      />
      <input
        type="checkbox"
        :checked="value.find((res) => res == 'foo2') != undefined"
        value="foo2"
        @change="update('foo2', 'array')"
      />
    </u-field>
  </div>
</template>

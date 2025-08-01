<script setup lang="ts">
import { h } from "vue";
import { createScheme, SchemeArg } from "vue-uform";

const myScheme = createScheme((arg: SchemeArg) => {
  return h("div", {}, [h("label", arg.label)]);
});
</script>

<template>
  <div>Welcome</div>
  <u-form abc="7687">
    <u-field name="username" label="Username" :scheme="myScheme"></u-field>

    <u-field name="password" label="Password" v-slot="{value, update}">
      <input :value="value" @input="update"></input>
    </u-field>
  </u-form>
</template>

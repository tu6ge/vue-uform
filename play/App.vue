<script setup lang="ts">
import { h, ref } from "vue";
import { SchemeArg } from "vue-uform";
import { NInput } from "naive-ui";

const myScheme = (arg: SchemeArg) => {
  return h(
    "div",
    {
      style: { color: "red" },
    },
    [h("label", arg.label)]
  );
};

const myScheme2 = (arg: SchemeArg) => {
  return h(
    "div",
    {
      style: { color: "green" },
    },
    [h("label", arg.label), arg.getSlots(), h("div", arg.valueRef.value)]
  );
};

const username = ref("Join");
const email = ref("xxx@yyy.com");
const formValues = {
  username: "Join",
  password: "101010",
  email: "xxx@yyy.com",
};

function doSave(data: Object) {
  console.log(data);
}
</script>

<template>
  <div>Welcome</div>
  <u-form :values="formValues" @submit="doSave">
    <u-field name="username" label="Username" :scheme="myScheme"></u-field>
    <u-field
      name="username"
      label="Scheme2"
      :scheme="myScheme2"
      v-slot="{ value, update }"
      value="hello"
    >
      <input :value="value" @input="update($event.target.value)" />
    </u-field>

    <u-field
      name="username"
      label="Scheme2 Email"
      :scheme="myScheme2"
      v-slot="{ value, update }"
      v-model="email"
    >
      <input :value="value" @input="update($event.target.value)" />
    </u-field>

    <u-field
      name="password"
      label="Password"
      v-model="username"
      help="please input your password"
      v-slot="{ value, update }"
    >
      <input :value="value" @input="update($event.target.value)" />
    </u-field>

    <u-field name="username" v-slot="{ value, update }" custom>
      <div class="full-custom-style">
        <label>Username</label>
        <input :value="value" @input="update($event.target.value)" />
        <div>Help message</div>
      </div>
    </u-field>

    <u-field
      name="password"
      label="NaiveInput"
      help="please input your password"
      value="accc"
      v-slot="{ value, update }"
    >
      <n-input :value="value" @input="update($event)" />
    </u-field>

    <u-submit></u-submit>
  </u-form>
</template>

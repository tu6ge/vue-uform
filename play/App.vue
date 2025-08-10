<script setup lang="ts">
import { h, ref } from "vue";
import { SchemeArg, FieldNode } from "vue-uform";
import { NInput, NButton } from "naive-ui";

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
    [
      h("label", arg.label),
      arg.getSlots(),
      h("div", arg.valueRef.value),
      h("div", JSON.stringify(arg.messages.value)),
    ]
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

function isfruit(node: FieldNode): boolean | string {
  const { value } = node;
  if (value.value != "apple" && value.value != "banan") {
    return "this value is not apple or banan";
  }
  return true;
}
const formRef = ref();
function handlerReset() {
  formRef.value.reset({ username22: "resetValue22" });
}
</script>

<template>
  <div>Welcome</div>
  <u-form :values="formValues" @submit="doSave" ref="formRef">
    <u-field name="username" label="Username" :scheme="myScheme"></u-field>
    <u-field
      name="username22"
      label="Scheme2"
      :scheme="myScheme2"
      validation="required"
      v-slot="{ value, update }"
      value="hello"
    >
      <input
        :value="value"
        @input="update(($event.target as HTMLInputElement).value)"
      />
    </u-field>

    <u-field
      name="username"
      label="Scheme2 Email"
      :scheme="myScheme2"
      v-slot="{ value, update }"
      v-model="email"
    >
      <input
        :value="value"
        @input="update(($event.target as HTMLInputElement).value)"
      />
    </u-field>

    <u-field
      name="password"
      label="Password"
      v-model="username"
      validation="required|number"
      help="please input your password"
      v-slot="{ value, update }"
    >
      <input
        :value="value"
        @input="update(($event.target as HTMLInputElement).value)"
      />
    </u-field>
    <u-field
      name="confirm_password"
      label="Cofirm Password"
      validation="required|confirm:password"
      :validation-messages="{
        confirm: 'the confirm password is not same as password',
      }"
      help="please input your password again"
      v-slot="{ value, update }"
    >
      <input
        :value="value"
        @input="update(($event.target as HTMLInputElement).value)"
      />
    </u-field>

    <u-field
      name="username"
      validation="required"
      v-slot="{ value, update, messages }"
      custom
    >
      <div class="full-custom-style">
        <label>Username</label>
        <input
          :value="value"
          @input="update(($event.target as HTMLInputElement).value)"
        />
        <div>Help message</div>
        <div>{{ JSON.stringify(messages) }}</div>
      </div>
    </u-field>

    <u-field
      name="password2"
      label="NaiveInput"
      help="please input your password"
      validation="required"
      v-slot="{ value, update, hasError }"
    >
      <n-input
        :value="value"
        @input="update($event)"
        :status="hasError ? 'error' : undefined"
      />
    </u-field>

    <u-field
      name="fruit"
      label="Fruit"
      help="please input a fruit"
      :rules="{ isfruit }"
      validation="required|isfruit"
      v-slot="{ value, update, hasError }"
    >
      <n-input
        :value="value"
        @input="update($event)"
        :status="hasError ? 'error' : undefined"
      />
    </u-field>

    <u-submit>Save</u-submit>

    <u-submit custom v-slot="{ submit }">
      <n-button @click="submit">Submit</n-button>
    </u-submit>
    <button type="button" @click="handlerReset">Reset</button>

    <u-reset></u-reset>
  </u-form>
</template>

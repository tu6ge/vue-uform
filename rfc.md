# RFC

```vue
<script setup>
const formData = ref({
  username: "",
  password: "",
});

import myForm from "xxxlibrary";
import naivePlugin from "@xxxx/naive-ui";
myForm.plugin(naivePlugin);
Vue.use(myForm);

function handleSave(obj) {
  console.log(obj);
}
</script>
<template>
  <div>
    <u-form :values="formData" @submit="handleSave">
      <u-input label="Username" type="n-input" name="username"> </u-input>
      <u-input
        label="Password"
        type="n-input-password"
        name="password"
        show-password
      >
      </u-input>
      <u-submit>Submit</u-submit>
      <!-- or -->
      <u-submit v-slot="{ submit }">
        <a @click="submit">Submit</a>
      </u-submit>
    </u-form>
  </div>
</template>
```

```vue
<script setup>
import { h } from "vue";

import { wrapper, label, input, help, message, prefix, suffix } from "useForm";
const myFieldScheme = createField(() => {
  return h(wrapper, [h(label), h("div"), h(input), h(help)]);
});
</script>
```

```vue
<template>
  <div>
    <u-form :values="formData" @submit="handleSave">
      <u-input label="Username" name="username" v-slot="{ value, update }">
        <n-input :value="value" @update:value="update"></n-input>
      </u-input>

      <u-input label="Username" name="username" v-slot="{ value, update }">
        <n-input f-model:value@update="value"></n-input>
      </u-input>

      <u-input label="Username" name="username" v-slot="{ value, update }">
        <n-input f-model:value></n-input>
      </u-input>

      <u-input name="username" v-slot="{ value, update, messages }" custom>
        <div class="flex">
          <label>Username</label>
          <n-input f-model:value></n-input>
          <!-- or -->
          <el-input f-model></el-input>
        </div>
        <div v-if="messages.length > 0">{{ messages[0] }}</div>
      </u-input>

      <u-submit>Submit</u-submit>
      <!-- or -->
      <u-submit v-slot="{ submit }" custom>
        <a @click="submit">Submit</a>
      </u-submit>
    </u-form>
  </div>
</template>
```

# custom field scheme

```vue
<script setup>
import { h } from "vue";

import { createField } from "useForm";
const myFieldScheme = createField((cxt) => {
  return h("div", {}, [
    h(
      "div",
      {
        class: "flex",
      },
      [h("label", cxt.label), cxt.slot]
    ),
    h("div", cxt.help),
    h("div", cxt.message[0]),
    h("div", cxt.message[1]),
  ]);
});
</script>
```

# custom validation

```vue
<script setup lang="ts">
function isfruit(node) {
  const { value } = node;
  if (value != "apple" || value != "banan") {
    return "this value is not apple or banan";
  }
  return true;
}
</script>
<template>
  <u-field label="Name" :validation="['required', isfruit]"></u-field>
</template>
```

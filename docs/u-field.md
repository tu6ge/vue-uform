# u-field component

This is a component for form fields, with each instance corresponding to one input in the form. We can use this component to implement two-way binding with custom input elements or input components, perform validation, and apply custom schemes.

## This is a basic example

```vue
<template>
  <u-field
    name="username"
    label="Username"
    help="Please input your username"
    validation="required"
    v-slot="{ value, update }"
  >
    <input :value="value" @input="($event) => update($event.target.value)" />
    <!-- or -->
    <input f-model />
  </u-field>
</template>
```

::: tip
`f-model` is a syntax sugar for two-way binding similar to `v-model`. The difference is that it establishes two-way binding with its parent component, rather than with the component itself.
:::

It will be transformed into the following HTML code

```html
<div class="u-field-wrap">
  <div class="u-field-input-wrap">
    <label class="u-label">Username</label>
    <!-- input slot -->
  </div>
  <div class="u-field-help">Please input your username</div>
  <ul class="u-validation-message">
    <li>validation1 error</li>
    <!-- more validation error-->
  </ul>
</div>
```

It’s worth mentioning that when you install this library, it comes with no styles, which means you can freely add styles to match your own page design.

Not only that, you can also customize the structure between these HTML elements by using the custom prop.

## This is an example of custom prop

```vue
<template>
  <u-field v-slot="{ value, update, hasError, messages }" custom>
    <div class="my-input-wrap">
      <label>MyLabel</label>
      <input f-model />
      <div>My input help message</div>
      <ul class="validation-messages" v-if="hasError">
        <li v-for="msg in messages">{{ msg }}</li>
      </ul>
    </div>
  </u-field>
</template>
```

## Other custom method

You can using `scheme` prop custom field's scheme:

```vue
<script setup lang="ts">
import { h } from "vue";
import { SchemeArg } from "vue-uform";
const myScheme = (arg: SchemeArg) => {
  return h(
    "div",
    {
      style: { color: "green" },
    },
    [h("label", arg.label), arg.slot(), h("div", arg.help)]
  );
};
</script>
<template>
  <u-field
    :scheme="myScheme"
    name="username"
    label="Username"
    v-slot="{ value, update }"
  >
    <input f-model />
  </u-field>
  <u-field
    :scheme="myScheme"
    name="password"
    label="Password"
    v-slot="{ value, update }"
  >
    <input type="password" f-model />
  </u-field>
</template>
```

::: tip
In addition to the custom and scheme mentioned above, we also support setting scheme on the u-form component to customize the structure of form fields. Their priorities are: `custom` prop > u-field's `scheme` > u-form's `scheme` > default configure.
:::

## Props

| Name                | Description                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| name                | bind with `u-form` component's values key                                                                     |
| label               | show label message of the field,or show label in validation messages                                          |
| help                | form field input help message                                                                                 |
| validation          | bind validation rules with it's name                                                                          |
| validation-messages | custom validation message using an object                                                                     |
| rules               | add custom validation rules                                                                                   |
| custom              | Re-layout form fields using HTML elements.                                                                    |
| scheme              | Use Vue’s h function to assemble HTML elements, allowing the HTML structure to be reused between form fields. |

## Slot Argments

| Name     | Description                                                                                 |
| -------- | ------------------------------------------------------------------------------------------- |
| value    | Pass the value of u-field to its child components.                                          |
| update   | When the child component updates the data, this update event should be triggered.           |
| hasError | If the validation fails, it will return true; the default is false.                         |
| messages | This is a collection of all the validation error messages for this u-field.this is an array |

## Scheme Argments

| Name     | Description                                                                                  |
| -------- | -------------------------------------------------------------------------------------------- |
| name     | the form field's key                                                                         |
| label    | the field's showing label message                                                            |
| valueRef | the field's value,this is reactive                                                           |
| help     | the field's help message                                                                     |
| hasError | If the validation fails, it will return true; the default is false.                          |
| messages | This is a collection of all the validation error messages for this u-field. this is an array |

# Vue-uForm

This library is an abstraction of forms, which includes not only basic data initialization, submission,
and data reset, but also a set of data validation mechanisms

simple example:

```vue
<script setup>
const formValues = {
  username: "",
  password: "",
};
function doLogin(data) {
  console.log(data);
}
</script>
<template>
  <u-form :values="formValues" @submit="doLogin">
    <u-field
      name="username"
      label="Username"
      validation="required"
      v-slot="{ value, update }"
    >
      <!-- f-model is a directive similar to v-model, but designed for vue-uform fields. -->
      <input f-model />
    </u-field>
    <u-field
      name="password"
      label="Password"
      validation="required"
      v-slot="{ value, update }"
    >
      <input type="password" f-model />
    </u-field>
    <u-submit>Login</u-submit>
    <!-- or -->
    <u-submit custom v-slot="{ submit }">
      <button :style="{ color: 'blue' }" @click="submit">Login</button>
    </u-submit>
  </u-form>
</template>
```

As you can see, our library does not contain any styles.This means that you can freely combine div elements and styles, we do not have built-in input components for every case. you should to be use any input element or third input components.

To achieve functions such as form validation, we should not only have the input element but also information like label, help, and validation message. on default, my `<u-field>` component structure is:

```html
<div class="u-field-wrap">
  <div class="u-field-input-wrap">
    <label class="u-label">MyLabel</label>
    <!-- input slot -->
  </div>
  <div class="u-field-help">My help info</div>
  <ul class="u-validation-message">
    <li>validation1 error</li>
    <!-- more validation error-->
  </ul>
</div>
```

You can add styles on this basis to customize your page. Not just that, you can customize this element structure like this:

```vue
<template>
  <u-field v-slot="{ value, update }" custom>
    <div class="my-input-wrap">
      <label>MyLabel</label>
      <input f-model />
    </div>
  </u-field>
</template>
```

In some cases, you may want all fields in a form to share the same structure, and this library can also meet your needs:

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
  <u-form :scheme="myScheme">
    <u-field name="username" label="Username" v-slot="{ value, update }">
      <input f-model />
    </u-field>
    <u-field name="password" label="Password" v-slot="{ value, update }">
      <input type="password" f-model />
    </u-field>
  </u-form>
</template>
```

you can using [`h`](https://vuejs.org/guide/extras/render-function.html) function freely combine elements

the `f-model` is a sugar like `v-model`, this usage is [here](./packages/vite-plugin/README.md).

## Validation Usage

```vue
<script setup>
import { FieldNode } from "vue-uform";
function isfruit({ value }: FieldNode): boolean | string {
  if (value != "apple" && value != "banana") {
    return "this value is not apple or banana";
  }
  return true;
}
</script>
<template>
  <u-form>
    <!-- using build-in validation rules -->
    <u-field
      validation="required|number|between:10,20"
      v-slot="{ value, update }"
    >
      <input f-model />
    </u-field>

    <!-- using custom validation rule -->
    <u-field
      validation="isfruit"
      :rules="{ isfruit }"
      v-slot="{ value, update }"
    >
      <input f-model />
    </u-field>

    <!-- using custom validation message -->
    <u-field
      validation="isfruit"
      :rules="{ isfruit }"
      :validation-messages="{
        isfruit: 'custom error message',
      }"
      v-slot="{ value, update }"
    >
      <input f-model />
    </u-field>
  </u-form>
</template>
```

## Validation Available

## Built-in Validation Rules

You can use the following built-in validation rules in the `validation` prop of `<u-field>`.  
Multiple rules can be combined with `|`, and rule parameters are passed with `:`, multiple parameters separated by `,`.

Example:

```vue
<u-field name="username" validation="required|alpha|min:3|max:12" />
```

1. required

Description

The field value must not be empty. Empty strings (""), null, undefined, and empty arrays are considered invalid.

Parameters
None

Example

```vue
<u-field name="email" validation="required" />
```

2. number

Description

The value must be a number or a string that can be parsed into a number.

Parameters
None

Example

```vue
<u-field name="age" validation="number" />
```

3. confirm

Description

The value must match the value of another field (commonly used for password confirmation).

Parameters

fieldName – the name of the field to compare with.

Example

```vue
<u-field name="password" validation="required" />
<u-field name="confirmPassword" validation="confirm:password" />
```

4. accepted

Description

The field value must be true, "yes", "on", or "1" (commonly used for terms & conditions checkboxes).

Parameters

None

Example

```vue
<u-field name="terms" validation="accepted" />
```

5. alpha

Description

The value may only contain alphabetic characters (A-Z, a-z).

Parameters

None

Example

```vue
<u-field name="firstName" validation="alpha" />
```

6. alphanumeric

Description

The value may only contain letters and numbers.

Parameters

None

Example

```vue
<u-field name="username" validation="alphanumeric" />
```

7. between

Description

The value must be between the specified minimum and maximum (numeric range).

Parameters

min,max – range boundaries.

Example

```vue
<u-field name="age" validation="between:18,65" />
```

8. email

Description

The value must be a valid email address.

Parameters

None

Example

```vue
<u-field name="email" validation="email" />
```

9. ends_with

Description

The value must end with one of the specified substrings.

Parameters

value1,value2,... – allowed endings.

Example

```vue
<u-field name="domain" validation="ends_with:.com,.org" />
```

10. is

Description

The value must equal (==) the specified value.

Parameters

expectedValue

Example

```vue
<u-field name="promoCode" validation="is:FREE100" />
```

11. length

Description
The value’s length must be between the specified minimum and maximum.

Parameters

- mix
- max

Example

```vue
<u-field name="password" validation="length:6,10" />
```

12. lowercase

Description

The value must be entirely lowercase letters.

Parameters
None

Example

```vue
<u-field name="slug" validation="lowercase" />
```

13. max

Description

The value must not be greater than the specified maximum numeric

Example

```vue
<u-field name="age" validation="max:120" />
```

14. min

Description

The value must not be less than the specified minimum (numeric).

Parameters

minValue

Example

```vue
<u-field name="age" validation="min:18" />
```

15. not

Description

The value must not equal any of the specified values.

Parameters

value1,value2,...

Example

```vue
<u-field name="username" validation="not:admin,root" />
```

16. starts_with

Description

The value must start with one of the specified
substrings.

Parameters

value1,value2,...

Example

```vue
<u-field name="phone" validation="starts_with:+86,+1" />
```

17. uppercase

Description

The value must be entirely uppercase letters.

Parameters

None

Example

```vue
<u-field name="code" validation="uppercase" />
```

18. url

Description

The value must be a valid URL.

Parameters

None

Example

```vue
<u-field name="website" validation="url" />
```

## Custom Validation

Example with argment

```vue
<script setup lang="ts">
import { FieldNode } from "vue-uform";

// Custom validation rule with parameters
function minWords({ value }: FieldNode, min: number): boolean | string {
  const wordCount = String(value).trim().split(/\s+/).length;
  if (wordCount < min) {
    return `Please enter at least ${min} words.`;
  }
  return true;
}
</script>

<template>
  <u-form>
    <u-field
      name="bio"
      label="Short Bio"
      validation="min_words:5"
      :rules="{ min_words: minWords }"
      v-slot="{ value, update }"
    >
      <textarea f-model></textarea>
    </u-field>
  </u-form>
</template>
```

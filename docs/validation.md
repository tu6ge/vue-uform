# Validation

You can use the following built-in or custom validation rules in the `validation` prop of `<u-field>`.  
Multiple rules can be combined with `|`, and rule parameters are passed with `:`, multiple parameters separated by `,`.

This is an example:

```vue
<u-field name="username" validation="required|alpha|min:3|max:12" />
```

## Custom Message

you can using `validation-messages` to custom validation message:

```vue
<u-field
  name="username"
  validation="required"
  :validation-messages="{ required: 'custom required message' }"
></u-field>
```

## Custom Validation Rule

This is an example of custom validation rule:

```vue
<script setup lang="ts">
import { FieldNode } from "vue-uform";
function isfruit({ value }: FieldNode): boolean | string {
  if (value != "apple" && value != "banana") {
    return "this value is not apple or banana";
  }
  return true;
}
</script>
<template>
  <u-field validation="isfruit" :rules="{ isfruit }" v-slot="{ value, update }">
    <input f-model />
  </u-field>
</template>
```

Fisrt, you should to be using `rules` prop to register the rule, next use the rule in validation prop

::: tip
You can use both the rules and validation-message props simultaneously.Their priority is such that validation-message takes precedence over the messages defined in rules.
:::

## Custom Rule with argments

You can set parameters on a custom rule, like this:

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

## Built-in Validation Rules

### required

Description

The field value must not be empty. Empty strings (""), null, undefined, and empty arrays are considered invalid.

Parameters
None

Example

```vue
<u-field name="email" validation="required" />
```

### number

Description

The value must be a number or a string that can be parsed into a number.

Parameters
None

Example

```vue
<u-field name="age" validation="number" />
```

### confirm

Description

The value must match the value of another field (commonly used for password confirmation).

Parameters

fieldName – the name of the field to compare with.

Example

```vue
<u-field name="password" validation="required" />
<u-field name="confirmPassword" validation="confirm:password" />
```

### accepted

Description

The field value must be true, "yes", "on", or "1" (commonly used for terms & conditions checkboxes).

Parameters

None

Example

```vue
<u-field name="terms" validation="accepted" />
```

### alpha

Description

The value may only contain alphabetic characters (A-Z, a-z).

Parameters

None

Example

```vue
<u-field name="firstName" validation="alpha" />
```

### alphanumeric

Description

The value may only contain letters and numbers.

Parameters

None

Example

```vue
<u-field name="username" validation="alphanumeric" />
```

### between

Description

The value must be between the specified minimum and maximum (numeric range).

Parameters

min,max – range boundaries.

Example

```vue
<u-field name="age" validation="between:18,65" />
```

### email

Description

The value must be a valid email address.

Parameters

None

Example

```vue
<u-field name="email" validation="email" />
```

### ends_with

Description

The value must end with one of the specified substrings.

Parameters

value1,value2,... – allowed endings.

Example

```vue
<u-field name="domain" validation="ends_with:.com,.org" />
```

### is

Description

The value must equal (==) the specified value.

Parameters

expectedValue

Example

```vue
<u-field name="promoCode" validation="is:FREE100" />
```

### length

Description
The value’s length must be between the specified minimum and maximum.

Parameters

- mix
- max

Example

```vue
<u-field name="password" validation="length:6,10" />
```

### lowercase

Description

The value must be entirely lowercase letters.

Parameters
None

Example

```vue
<u-field name="slug" validation="lowercase" />
```

### max

Description

The value must not be greater than the specified maximum numeric

Example

```vue
<u-field name="age" validation="max:120" />
```

### min

Description

The value must not be less than the specified minimum (numeric).

Parameters

minValue

Example

```vue
<u-field name="age" validation="min:18" />
```

### not

Description

The value must not equal any of the specified values.

Parameters

value1,value2,...

Example

```vue
<u-field name="username" validation="not:admin,root" />
```

### starts_with

Description

The value must start with one of the specified
substrings.

Parameters

value1,value2,...

Example

```vue
<u-field name="phone" validation="starts_with:+86,+1" />
```

### uppercase

Description

The value must be entirely uppercase letters.

Parameters

None

Example

```vue
<u-field name="code" validation="uppercase" />
```

### url

Description

The value must be a valid URL.

Parameters

None

Example

```vue
<u-field name="website" validation="url" />
```

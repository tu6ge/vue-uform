# u-reset component

You can use u-reset to reset the form, and you can also customize its style.

For its basic usage, you can refer to the documentation of the u-form component.

## custom content

Here is an example of how to customize it.

```vue
<template>
  <u-reset custom v-slot="{ reset }">
    <button type="button" :style="{ color: 'blue' }" @click="reset">
      Custom Reset
    </button>
  </u-reset>
</template>
```

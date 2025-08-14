# u-submit component

You can use u-submit to submit the form, and you can also customize its style.

For its basic usage, you can refer to the documentation of the u-form component.

## custom content

Here is an example of how to customize it.

```vue
<template>
  <u-submit custom v-slot="{ submit }">
    <button type="button" :style="{ color: 'blue' }" @click="submit">
      Custom Submit
    </button>
  </u-submit>
</template>
```

# @vue-uform/vite-plugin

This is a vite plugin, A plugin used in conjunction with vue-uform.

used before:

```vue
<tempalte>
  <u-field v-slot="{value,update}">
    <input :value="value" @input="$event=>update($event.target.value)"/>
  </u-field>
</tempalte>
```

used after:

```vue
<tempalte>
  <u-field v-slot="{value,update}">
    <input f-model />
  </u-field>
</tempalte>
```

As you can see, it's like a v-model, also a grammatical sugar.

## Usage

1. basic input type,e.g. text,password,tel,email...

The sugar code:

```vue
<input type="text" f-model />
```

will general this code:

```vue
<input type="text" :value="value" @input="$event=>update($event.target.value) />
```

2. radio input

the sugar code:

```vue
<input type="radio" value="foo" f-model />
```

will general this code:

```vue
<input
  type="radio"
  value="foo"
  :checked="value == 'foo'"
  @change="($event) => update('foo')"
/>
```

3. checkbox input

the sugar code:

```vue
<input type="checkbox" f-model />
```

will general this code:

```vue
<input
  type="checkbox"
  :checked="value"
  @change="($event) => update($event.target.checked)"
/>
```

4. checkbox group input, this `u-field`'s value is an array

the sugar code:

```vue
<input type="checkbox" value="foo1" f-model />
```

will general this code:

```vue
<input
  type="checkbox"
  value="foo1"
  :checked="value.find((res) => res == 'foo1') != undefined"
  @change="($event) => update('foo1', 'array')"
/>
```

5. select input

the sugar code:

```vue
<select f-model>
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

will general this code:

```vue
<select :value="value" @change="update($event.target.value)">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

6. select with multiple

the sugar code:

```vue
<select f-model multiple>
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

will general this code:

```vue
<select
  multiple
  @change="
    update(
      Array.from($event.target.selectedOptions).map((option) => option.value)
    )
  "
>
  <option disabled value="" :selected="value.find((res) => res == '')">Please select one</option>
  <option :selected="value.find((res) => res == 'A')">A</option>
  <option :selected="value.find((res) => res == 'B')">B</option>
  <option :selected="value.find((res) => res == 'C')">C</option>
</select>
```

7. third UI component examples:

```vue
<n-input f-model:value></n-input>
<el-input f-model></el-input>
```

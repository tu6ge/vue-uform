# f-model Sugar

`f-model` is a syntax sugar for two-way binding similar to `v-model`. The difference is that it establishes two-way binding with its parent component, rather than with the component itself. it support all basic input type,(e.g.: input,textarea,radio,checkbox,select) and third UI components(e.g.: ElementPlusUI, NaiveUI).

## Usage

1. basic input type,e.g. text,password,tel,email...

The sugar code:

```vue
<input type="text" f-model />
```

will generate this code:

```vue
<input
  type="text"
  :value="value"
  @input="($event) => update($event.target.value)"
/>
```

2. radio input

Bind the radio button value directly. The field will be updated when selected.

the sugar code:

```vue
<input type="radio" value="foo" f-model />
```

will generate this code:

```vue
<input
  type="radio"
  value="foo"
  :checked="value == 'foo'"
  @change="($event) => update('foo')"
/>
```

3. checkbox input

Bind the checkbox value directly. The field will be updated when selected.

the sugar code:

```vue
<input type="checkbox" f-model />
```

will generate this code:

```vue
<input
  type="checkbox"
  :checked="value"
  @change="($event) => update($event.target.checked)"
/>
```

4. checkbox group input, this `u-field`'s value is must an array

the sugar code:

```vue
<input type="checkbox" value="foo1" f-model />
```

will generate this code:

```vue
<input
  type="checkbox"
  value="foo1"
  :checked="value.find((res) => res == 'foo1') != undefined"
  @change="($event) => update('foo1', 'array')"
/>
```

5. select input

Bind the select value directly. The field will be updated when selected.

the sugar code:

```vue
<select f-model>
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

will generate this code:

```vue
<select :value="value" @change="update($event.target.value)">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

6. select with multiple, this `u-field`'s value is must an array

the sugar code:

```vue
<select f-model multiple>
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

will generate this code:

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
<!-- Naive UI -->
<n-input f-model:value></n-input>

<!-- Element Plus UI -->
<el-input f-model></el-input>

<!-- Antd UI -->
<a-input f-model:value></a-input>

<!-- Vuetify UI -->
<v-text-field label="Text" f-model></v-text-field>
```

# vue-listable

## Getting started

Vue-listable is an advanced data table plugin for vue.js.

## Installation

Using NPM:

```bash
npm install vue-listable --save
```

## Basic usage

### Vue.js

```javascript
import Vue from 'vue'
import VueListable from 'vue-listable'

Vue.use(VueListable)
```

Same for nuxt.js:

### Nuxt.js

Create vue-listable.js in plugins directory:

```javascript
import Vue from 'vue'
import VueListable from 'vue-listable'

Vue.use(VueListable)
```

Then in nuxt.config.js:

```javascript
module.exports = {
  plugins: [
    {
      src: '~/plugins/vue-listable.js'
    }
  ]
}
```

## Component

Inside template use listable component:

```html
<listable />
```

## Options

### @search

Type: Function

Default: none

Executes when user is typing in any search input.

```html
<listable @search="onSearch" />
<script>
export default {
  methods: {
    onSearch(searched) {
      console.log(searched);
    }
  }
}
</script>
```

### @checked

Type: Function

Default: none

Executes after checkbox is checked.

```html
<listable @checked="onCheck" />
<script>
export default {
  methods: {
    onCheck(checked) {
      console.log(checked);
    }
  }
}
</script>
```

### @sorted

Type: Function

Default: none

Executes after column sort.

```html
<listable :headings="headings" @sorted="onSort" />
<script>
export default {
  data: () => ({
    headings: [
      {
        display: "ID",
        column: "id",
        sortable: true,
        descending: true
      },
      {
        display: "Name",
        column: "name"
      },
      {
        display: "Date",
        column: "created_at",
        sortable: true,
        descending: false
      }
    ]
  }),
  methods: {
    onSort(sort) {
      let column = sort.column;
      let descending = sort.descending;
      let ascending = !descending;
      console.log(column);
      console.log(descending);
      console.log(ascending);
    }
  }
}
</script>
```

### @expanded

Type: Function

Default: none

Executes after row expand.

```html
<listable @expanded="onExpanded" />
<script>
export default {
  methods: {
    onExpanded(expanded) {
      console.log(expanded);
    }
  }
}
</script>
```

### headings

Type: Array

Default: empty array

Array with all table headers cells.

```js
cells: [
  {
    name: "ID",
    column: "id",
    search: false
  },
  {
    name: "Name",
    column: "name",
    search: true
  }
]
```

#### Options inside headings

##### name

Type: String

Default: empty string

Displayed name.

##### column

Type: String

Default: null

Column name inside "data" attribute.

##### search

Type: Boolean

Default: false

Experimental function. Shows search input in header.

##### sortable

Type: Boolean

Default: false

Allows user to click on header column. It emits event with information about clicked column and direction (descending or not).

##### descending

Type: Boolean

Default: true

Available when column is set to sortable. True means that sort is descending, false means that sort is ascending.

### data

Type: Array

Default: empty array

Array with all table body data.

```js
data: [
  {
    id: 1,
    name: "MacOS"
  },
  {
    id: 2,
    name: "Linux"
  },
  {
    id: 3,
    name: "Windows"
  }
]
```

### checkbox

Type: Boolean

Default: false

If set to true, first column will contain checkbox.

```html
<listable :checkbox="true" />
```

### expandable

Type: Boolean

Default: false

If set to true, row may be expanded with expander slot.

```html
<listable :expandable="true">
  <div slot="expander" slot-scope="item">
    {{ item }}
  </div>
</listable>
```

### responsive

Type: Boolean

Default: true

If set to true, listable will handle table 
responsiveness.

```html
<listable :responsive="true" />
```

## Handle empty rows

```html
<listable>
  <template slot="empty">
    No data
  </template>
</listable>
```

## License

`vue-listable` uses the MIT License (MIT). Please see the [license file](https://github.com/malekim/vue-listable/blob/master/LICENSE) for more information.
# vue-listable [![codecov](https://codecov.io/gh/malekim/vue-listable/branch/master/graph/badge.svg)](https://codecov.io/gh/malekim/vue-listable)

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
<Listable />
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
<Listable @checked="onCheck" />
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

Executes after column sort. Each column except clicked one is reset to default sort direction.

```html
<Listable :headings="headings" @sorted="onSort" />
<script>
export default {
  data: () => ({
    headings: [
      {
        display: "ID",
        column: "id",
        sortable: true,
        ascending: true
      },
      {
        display: "Name",
        column: "name"
      },
      {
        display: "Date",
        column: "created_at",
        sortable: true,
        ascending: false
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
<Listable @expanded="onExpanded" />
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

### tableClasses

Type: Array

Default: empty array

```html
<Listable :tableClasses="['table', 'is-striped']" />
```

Array with CSS classes added to table HTML element.

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

Allows user to click on header column. It emits event with information about clicked column and direction (ascending or not).

##### ascending

Type: Boolean

Default: true

Available when column is set to sortable. True means that sort is ascending, false means that sort is descending.

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
<Listable :checkbox="true" />
```

### expandable

Type: Boolean

Default: false

If set to true, row may be expanded with expander slot.

```html
<Listable :expandable="true">
  <div slot="expander" slot-scope="item">
    {{ item }}
  </div>
</Listable>
```

### responsive

Type: Boolean

Default: true

If set to true, listable will handle table 
responsiveness.

```html
<Listable :responsive="true" />
```

## Hooks

Hooks are handlers for each table row and each table cell. With hook it is possible to manipulate classes and styles of rows and cells in vue way.

Simple hook is to handle table cells, and rowHook is to handle table rows. 

First argument of handler is always object with classes and styles applied to handled element.

Second argument is always row of currently operated data.

Third argument in simple hook is column name.

Why not refs? Refs causes update, so update for each row is slower than using handlers. 

```html
<template>
  <div>
    <Listable
      :headings="headings"
      :data="items"
      :hook="onHook"
      :rowHook="onRowHook"
    />
  </div>
</template>
<script>
export default {
  data: () => ({
    headings: [
      {
        display: "ID",
        column: "id",
      },
      {
        display: "Name",
        column: "name",
        search: true
      },
      {
        display: "Paid",
        column: "is_paid"
      },
      {
        display: "New",
        column: "is_new"
      }
    ],
    items: [
      {
        id: 1,
        name: "Shoes"
        is_paid: true,
        is_new: false
      },
      {
        id: 2,
        name: "Apple"
        is_paid: false,
        is_new: true
      }
    ]
  }),
  methods: {
    onHook(calculated, row, column) {
      console.info(row);
      if (column == "id") {
        calculated.style.backgroundColor = 'rgb(225, 225, 225)';
      }
      if (column == "is_new") {
        // if row.is_new is true a class new is added
        // if row.is_new is false a class new is not added
        calculated.class['new'] = row.is_new;
      }
    },
    onRowHook(calculated, row) {
      console.info(row);
      // if row.paid is true a class paid is added
      // if row.paid is false a class paid is not added
      calculated.class['paid'] = row.is_paid;
    }
  }
}
</script>
```

## Handle empty rows

```html
<Listable>
  <template slot="empty">
    No data
  </template>
</Listable>
```

## Typescript

Add type to tsconfig.json
```json
{
  "compilerOptions": {
    // some options
    // ...
    // some options
    "types": [
      "vue-listable/types"
    ]
  }
}
```

## License

`vue-listable` uses the MIT License (MIT). Please see the [license file](https://github.com/malekim/vue-listable/blob/master/LICENSE) for more information.
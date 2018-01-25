# Easy Dux

Out of the box reducer creators.

## Installation

`yarn add easydux`

## Usage

```js
import { object } from 'easydux';

const myReducer = object({
  SET: 'SET_ACTION_TYPE',
  CLEAR: 'CLEAR_ACTION_TYPE',
});

const store = createStore(myReducer);

store.dispatch({
  type: 'SET_ACTION_TYPE',
  data: { hello: 'world' },
});

store.getState();
// { "hello": "world" }

store.dispatch({
  type: 'CLEAR_ACTION_TYPE',
});

store.getState();
// { }

```

## Values

Value reducers.

## Arrays

Array reducers.

## Objects

Object reducers. Action behavior is similar to `React.Component().setState`.

## Integrating Reducers

These are just reducers. You should have no problem calling them like this:

```js
const myObjectReducer = object({
  SET: 'SET_ACTION_TYPE',
  CLEAR: 'CLEAR_ACTION_TYPE',
});

function myReducer(state, action) {
  switch (action.type) {
    case 'MY_CUSTOM_ACTION':
      return { my: 'custom behavior' };
    default:
      return myObjectReducer(state, action);  
  }
}
``` 

## Api

- [value](#value)
- [object](#object)
- [array](#array)

### `value(actionTypes, default)`

Returns a reducer that sets or clears a single value.

- `actionTypes`: *object* no single type is required
  - `SET`: *string* the action type to set the state
  - `CLEAR`: *string* the action type to clear the state
- `default`: *any* default state - will be reset to this state on `CLEAR` *defaults to null*

```js
import { value } from 'easydux';

const myValueReducer = value({
  SET: 'SET_VALUE_TYPE',
  CLEAR: 'CLEAR_VALUE_TYPE',
});
```

### Value Actions

- **type**: `SET` Sets reducer state.
  - **data**: `state` | `function<newState>(state, action)`
- **type**: `CLEAR` Sets reducer to default.


```js

const mySetValueActionCreator = data => ({
  type: 'SET_VALUE_TYPE',
  data: 'new data',
});

// or

const mySetValueActionCreator = data => ({
  type: 'SET_VALUE_TYPE',
  data: state => 'new data',
});

const myClearValueActionCreator = data => ({
  type: 'CLEAR_VALUE_TYPE',
});

```

### `array(actionTypes, default)`

Returns a reducer that sets or clears a single value.

- `actionTypes`: *object* no single type is required
  - `SET`: *string* the action type to set the state
  - `CLEAR`: *string* the action type to clear the state
  - `SET_AT`: *string* the action type to set a single item in the state
  - `INSERT_AT`: *string* the action type to insert a single item in the state
  - `PUSH`: *string* the action type to push a single element onto the state at the end
  - `UNSHIFT`: *string* the action type to push some elements onto the state at the front
  - `CONCAT`: *string* the action type to push some elements onto the state at the end
  - `CONCAT_TO`: *string* the action type to push some elements onto the state at the front
  - `POP`: *string* the action type to remove a single element from the end of the array
  - `SHIFT`: *string* the action type to remove a single element from the front of the array
  - `REMOVE_AT`: *string* the action type to remove a single item from the state
  - `SLICE`: *string* the action type to slice the state into a subset
  - `MAP`: *string* the action type to map the state
  - `FILTER`: *string* the action type to filter the state 
- `default`: *array* default state - will be reset to this state on `CLEAR` *defaults to []*

```js
import { array } from 'easydux';

const myArrayReducer = array({
  SET: 'SET_ARRAY_TYPE',
  CLEAR: 'CLEAR_ARRAY_TYPE',
  SET_AT: 'SET_AT_ARRAY_TYPE',
  INSERT_AT: 'INSERT_AT_ARRAY_TYPE',
  PUSH: 'PUSH_ARRAY_TYPE',
  UNSHIFT: 'UNSHIFT_ARRAY_TYPE',
  CONCAT: 'CONCAT_ARRAY_TYPE',
  CONCAT_TO: 'CONCAT_TO_ARRAY_TYPE',
  POP: 'POP_ARRAY_TYPE',
  SHIFT: 'SHIFT_ARRAY_TYPE',
  REMOVE_AT: 'REMOVE_AT_ARRAY_TYPE',
  SLICE: 'SLICE_ARRAY_TYPE',
  MAP: 'MAP_ARRAY_TYPE',
  FILTER: 'FILTER_ARRAY_TYPE',
});
```

### Array Actions

- **type**: `SET` Sets reducer state.
  - **data**: `state` | `function<newState>(state, action)`
  - **post-processors**: [see below](#optional-post-processors)
- **type**: `CLEAR` Sets reducer to default.
- **type**: `SET_AT` Sets value at index.
  - **index**: `number`
  - **data**: `state` | `function<newState>(state[index], action, state)`
  - **post-processors**: [see below](#optional-post-processors)
- **type**: `INSERT_AT` Inserts value at index, adding one element to the state.
  - **index**: `number`: index of new value
  - **data**: `state` | `function<newState>(null, action, state)`
  - **post-processors**: [see below](#optional-post-processors)
- **type**: `PUSH` Adds value to end of state.
  - **data**: `state` | `function<newState>(null, action, state)`
  - **post-processors**: [see below](#optional-post-processors)
- **type**: `UNSHIFT` Adds value to front of state.
  - **data**: *value | (null, action, state) => value*: `state` or `function<newState>(null, action, state)`
  - **post-processors**: [see below](#optional-post-processors)
- **type**: `CONCAT` Adds values to end of state.
  - **data**: `state` | `function<newState>(null, action, state)`
  - **post-processors**: [see below](#optional-post-processors)
- **type**: `CONCAT_TO` Adds values to front of state.
  - **data**: `state` | `function<newState>(null, action, state)`
  - **post-processors**: [see below](#optional-post-processors)
- **type**: `POP` Remove value from end of state.
- **type**: `SHIFT` Remove value from front of state.
- **type**: `REMOVE_AT` Remove value from index in state.
  - **index**: `number`: index of removed value
- **type**: `SLICE` Remove value from slice of state.
  - **start**: `number`: start of slice *defaults to `0`*
  - **end**: `number`: end of slice
- **type**: `MAP` Runs state through `lodash/map`.
  - **data**: `string` | `function<value>(element, index, state)`: passed to `lodash/map`
- **type**: `FILTER` Runs state through `lodash/filter`.
  - **data**: `object` | `function<boolean>(element, index, state)`: passed to `lodash/filter`
  
#### Optional Post-Processors

- **type**: `SET|SET_AT|CONACT|CONCAT_TO|INSERT_AT|PUSH|UNSHIFT` The following keys will post-process the state.
  - **uniq**: `boolean`: should the new state run through `lodash/uniq` default: `false`
  - **compact**: `boolean`: should the new state run through `lodash/compact` default: `false`
  - **sort**: `string | function<boolean>(element, index, state)`: passed to `lodash/sortBy` default: `undefined` (no sort)


```js

const mySetArrayActionCreator = data => ({
  type: 'SET_ARRAY_TYPE',
  data: ['new data'],
});

// or

const mySetArrayActionCreator = data => ({
  type: 'SET_ARRAY_TYPE',
  data: state => ['new data'],
});

const myClearArrayActionCreator = data => ({
  type: 'CLEAR_ARRAY_TYPE',
});


```

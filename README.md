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

## Integrating Reducers

These are just reducers. You could even call them like this:

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

You'll likely just include them with `combineReducers` like this though.

```js
const myObjectReducer = object({
  SET: 'SET_ACTION_TYPE',
  CLEAR: 'CLEAR_ACTION_TYPE',
});

const reducer = combineReducers({
  reducerKey: myObjectReducer,
});

createStore(reducer);
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
  SET: 'SET_ARRAY',
  CLEAR: 'CLEAR_ARRAY',
  SET_AT: 'SET_AT_ARRAY',
  INSERT_AT: 'INSERT_AT_ARRAY',
  PUSH: 'PUSH_ARRAY',
  UNSHIFT: 'UNSHIFT_ARRAY',
  CONCAT: 'CONCAT_ARRAY',
  CONCAT_TO: 'CONCAT_TO_ARRAY',
  POP: 'POP_ARRAY',
  SHIFT: 'SHIFT_ARRAY',
  REMOVE_AT: 'REMOVE_AT_ARRAY',
  SLICE: 'SLICE_ARRAY',
  MAP: 'MAP_ARRAY',
  FILTER: 'FILTER_ARRAY',
});
```

### Array Actions

```js
import { array } from 'easydux';
import { createStore } from 'redux';

const reducer = array({
  SET: 'MY_ARRAY_SET',
});

const store = createStore(reducer);

store.dispatch({
  type: 'MY_ARRAY_SET',
  data: ['new', 'state', 'new', null],
  uniq: true, // optional
  compact: true, // optional
  sort: item => -item.length,
});

store.getState();
// [ 'state', 'new' ]
```

- **type**: `SET` Sets reducer state.
  - **data**: `state` | `function<newState>(state, action)`
  - **...post-processors**: [see below](#optional-post-processors)
- **type**: `CLEAR` Sets reducer to default.
- **type**: `SET_AT` Sets value at index.
  - **index**: `number`
  - **data**: `state` | `function<newState>(state[index], action, state)`
  - **...post-processors**: [see below](#optional-post-processors)
- **type**: `INSERT_AT` Inserts value at index, adding one element to the state.
  - **index**: `number`: index of new value
  - **data**: `state` | `function<newState>(null, action, state)`
  - **...post-processors**: [see below](#optional-post-processors)
- **type**: `PUSH` Adds value to end of state.
  - **data**: `state` | `function<newState>(null, action, state)`
  - **...post-processors**: [see below](#optional-post-processors)
- **type**: `UNSHIFT` Adds value to front of state.
  - **data**: *value | (null, action, state) => value*: `state` or `function<newState>(null, action, state)`
  - **...post-processors**: [see below](#optional-post-processors)
- **type**: `CONCAT` Adds values to end of state.
  - **data**: `state` | `function<newState>(null, action, state)`
  - **...post-processors**: [see below](#optional-post-processors)
- **type**: `CONCAT_TO` Adds values to front of state.
  - **data**: `state` | `function<newState>(null, action, state)`
  - **...post-processors**: [see below](#optional-post-processors)
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
  type: 'SET_ARRAY',
  data: ['new', 'data'],
});

// or

const mySetArrayActionCreator = data => ({
  type: 'SET_ARRAY',
  data: state => ['new', 'data'],
});

const myClearArrayActionCreator = data => ({
  type: 'CLEAR_ARRAY',
});

const mySetAtActionCreator = data => ({
  type: 'SET_AT_ARRAY',
  index: 1,
  data: oldVal => 'newVal',
});

const myInsertAtActionCreator = data => ({
  type: 'INSERT_AT_ARRAY',
  index: 1,
  data: () => 'newVal',
});

const myPushActionCreator = data => ({
  type: 'PUSH_ARRAY',
  data: 'newVal at end',
});

const myUnshiftActionCreator = data => ({
  type: 'UNSHIFT_ARRAY',
  data: 'newVal at front',
});

const myConcatActionCreator = data => ({
  type: 'CONCAT_ARRAY',
  data: ['newVal 1 at end', 'newVal 2 at end'],
});

const myConcatToActionCreator = data => ({
  type: 'CONCAT_AT_ARRAY',
  data: ['newVal 1 at start', 'newVal 2 at start'],
});

const myPopActionCreator = data => ({
  type: 'POP_ARRAY',
});

const myShiftActionCreator = data => ({
  type: 'SHIFT_ARRAY',
});

const myRemoveAtActionCreator = data => ({
  type: 'REMOVE_AT_ARRAY',
  index: 1,
});

const mySliceActionCreator = data => ({
  type: 'SLICE_ARRAY',
  start: 1,
  end: -1,
});

const myMapActionCreator = data => ({
  type: 'MAP_ARRAY',
  data: element => element,
});

const myFilterActionCreator = data => ({
  type: 'FILTER_ARRAY',
  data: element => !!element,
});

```

### `object(actionTypes, default)`

Returns a reducer that sets or clears a single value.

- `actionTypes`: *object* no single type is required
  - `SET`: *string* the action type to assign the state
  - `CLEAR`: *string* the action type to clear the state
  - `MERGE`: *string* the action type to merge the state
  - `REPLACE`: *string* the action type to replace the state
  - `FILTER`: *string* the action type to remove properties from the state
  - `MAP_VALUES`: *string* the action type to map state values
  - `MAP_KEYS`: *string* the action type to map state keys
- `default`: *object* default state - will be reset to this state on `CLEAR` *defaults to {}*

```js
import { object } from 'easydux';

const myObjectReducer = object({
  SET: 'SET_OBJECT',
  CLEAR: 'CLEAR_OBJECT',
  MERGE: 'MERGE_OBJECT',
  REPLACE: 'REPLACE_OBJECT',
  FILTER: 'FILTER_OBJECT',
  MAP_VALUES: 'MAP_VALUES_OBJECT',
  MAP_KEYS: 'MAP_KEYS_OBJECT',
});
```

### Object Actions

```js
import { object } from 'easydux';
import { createStore } from 'redux';

const reducer = object({
  SET: 'MY_OBJECT_SET',
});

const store = createStore(reducer);

store.dispatch({
  type: 'MY_OBJECT_SET',
  data: { hi: { mom: "I'm on TV!" } },
});

store.getState();
// { "hi": { "mom": "I'm on TV!" } }

store.dispatch({
  type: 'MY_OBJECT_SET',
  data: onWhere => onWhere.replace('TV', 'github'),
  key: 'hi.mom',
  depth: 2, // optional
});

store.getState();
// { "hi": { "mom": "I'm on github!" } }
```

- **type**: `SET` Sets reducer state. Set behavior tries to imitate `React.Component().setState`
  - **data**: `state` | `function<newState>(state, action)`
    - whatever is passed to the reducer is merged with the state one level deep.
      - If a function is passed to data, state will be passed as that function's first argument and the result will be merged with the current state.
  - **depth**: `number`: the depth of the merge data will have with original state. *defaults* to `1`
  - **key**: [see below](#object-key)
- **type**: `MERGE` Merges reducer state. Uses `lodash/merge`.
  - **data**: `state` | `function<newState>(state, action)`
  - **key**: [see below](#object-key)
- **type**: `REPLACE` Replaces reducer state.
  - **data**: `state` | `function<newState>(state, action)`
  - **key**: [see below](#object-key)
- **type**: `MAP_VALUES` Runs state through `lodash/mapValues`.
  - **data**: `function<value>(element, key, state)`: passed to `lodash/mapValues`
  - **key**: [see below](#object-key)
- **type**: `MAP_KEYS` Runs state through `lodash/mapKeys`.
  - **data**: `function<value>(element, key, state)`: passed to `lodash/mapKeys`
  - **key**: [see below](#object-key)
- **type**: `CLEAR` Sets reducer to default.
- **type**: `FILTER` Runs state through `lodash/omit` or `lodash/omitBy`.
  - **data**: `array` | `function<boolean>(element, index, state)`: passed to `lodash/omit` for arrays and `lodash/omitBy` for functions
  - **key**: [see below](#object-key)

```js

const mySetObjectActionCreator = data => ({
  type: 'SET_OBJECT',
  data: { hello: 'world' },
});

// or

const mySetObjectActionCreator = data => ({
  type: 'SET_OBJECT',
  data: state => ({ hello: 'world' }),
});

const myMergeObjectActionCreator = data => ({
  type: 'MERGE_OBJECT',
  data: state => ({ hello: 'world' }),
});

const myReplaceObjectActionCreator = data => ({
  type: 'REPLACE_OBJECT',
  data: state => ({ hello: 'world' }),
});

const myClearObjectActionCreator = data => ({
  type: 'CLEAR_OBJECT',
});

const myFilterActionCreator = data => ({
  type: 'FILTER_OBJECT',
  data: element => !!element,
});

```

#### Object-key

- **key**: `string` | `array`: A key to target in the reducer state.

The same kind of argument you would pass to `lodash/get`. `key` contextualizes your action around a certain value in an object - passing the value of this key in the object to your data function and then setting the data (or the result of the data function) at the key in the object.

```js
const reducer = object({
  SET: 'MY_OBJECT_SET',
});

const store = createStore(reducer, {
  hello: {
    my: 'honey',
  },
});

store.dispatch({
  type: 'MY_OBJECT_SET',
  data: ({ my }) => ({ my: 'baby' }),
  key: 'hello',
})

store.getState();
// { hello: { my: 'baby' } }

// or

store.dispatch({
  type: 'MY_OBJECT_SET',
  data: honey => 'baby', // or just data: 'baby'
  key: 'hello.my', // or ['hello', 'my']
})

store.getState();
// { hello: { my: 'baby' } }
```

## License

`easydux` is free software under the MIT license.

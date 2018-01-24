import { assert } from 'chai';
import { createStore, combineReducers } from 'redux';
import {
  value,
  object,
  array,
} from '../src';

const SET_ARRAY = 'SET_ARRAY';
const SET_OBJECT = 'SET_OBJECT';
const SET_VALUE = 'SET_VALUE';

const reducer = combineReducers({
  array: array({
    SET: SET_ARRAY,
  }),
  object: object({
    SET: SET_OBJECT,
  }),
  value: value({
    SET: SET_VALUE,
  }),
});

const selectValue = state => state.value;
const selectObject = state => state.object;
const selectArray = state => state.array;

describe('easy dux it.', () => {
  it('objects should work', () => {
    let result;
    const store = createStore(reducer);
    store.dispatch({
      type: SET_OBJECT,
      data: { foo: 'bar', fiz: 'buz', message: { hi: 'mom' } },
    });
    result = selectObject(store.getState());
    assert.equal(result.foo, 'bar');
    store.dispatch({
      type: SET_OBJECT,
      data: 'baz',
      key: 'foo',
    });
    result = selectObject(store.getState());
    assert.equal(result.foo, 'baz');

    store.dispatch({
      type: SET_OBJECT,
      data: baz => baz + 'z',
      key: ['foo'],
    });
    result = selectObject(store.getState());
    assert.equal(result.foo, 'bazz');

    store.dispatch({
      type: SET_OBJECT,
      data: mom => mom + ' + dad',
      key: 'message.hi',
    });
    result = selectObject(store.getState());
    assert.equal(result.message.hi, 'mom + dad');
  });
  it('reducer should work', () => {
    createStore(reducer);
  });
});

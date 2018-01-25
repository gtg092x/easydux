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
const FILTER_OBJECT = 'FILTER_OBJECT';

const reducer = combineReducers({
  array: array({
    SET: SET_ARRAY,
  }),
  object: object({
    SET: SET_OBJECT,
    FILTER: FILTER_OBJECT,
  }),
  value: value({
    SET: SET_VALUE,
  }),
});

const selectValue = state => state.value;
const selectObject = state => state.object;
const selectArray = state => state.array;

describe('easy dux it.', () => {
  it('arrays should work', () => {
    let result;
    const store = createStore(reducer);
    store.dispatch({
      type: SET_ARRAY,
      data: [1, 2, 3],
    });
    result = selectArray(store.getState());
    assert.equal(result[0], 1);

    store.dispatch({
      type: SET_ARRAY,
      uniq: true,
      data: [1, 1, 3],
    });
    result = selectArray(store.getState());
    assert.equal(result[1], 3);

    store.dispatch({
      type: SET_ARRAY,
      compact: true,
      data: [null, 3],
    });
    result = selectArray(store.getState());
    assert.equal(result[0], 3);

    store.dispatch({
      type: SET_ARRAY,
      data: ['new', 'state', 'new', null],
      uniq: true, // optional
      compact: true, // optional
      sort: item => -item.length,
    });

    result = selectArray(store.getState());
    assert.equal(result[0], 'state');
    assert.equal(result[1], 'new');

  });
  it('values should work', () => {
    let result;
    const store = createStore(reducer);
    store.dispatch({
      type: SET_VALUE,
      data: 1,
    });
    result = selectValue(store.getState());
    assert.equal(result, 1);
  });
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
      data: baz => ({ foo: 'baz' }),
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

    store.dispatch({
      type: FILTER_OBJECT,
      data: mom => !!mom,
      key: 'message',
    });
    result = selectObject(store.getState());
    assert.deepEqual(result.message, {});
  });
  it('reducer should work', () => {
    createStore(reducer);
  });
});

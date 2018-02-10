import { assert } from 'chai';
import { createStore, combineReducers } from 'redux';
import get from 'lodash.get';
import {
  value,
  object,
  array,
} from '../src';
import copyDepth from '../src/copy'

const SET_ARRAY = 'SET_ARRAY';
const SET_OBJECT = 'SET_OBJECT';
const REPLACE_OBJECT = 'REPLACE_OBJECT';
const SET_VALUE = 'SET_VALUE';
const FILTER_OBJECT = 'FILTER_OBJECT';
const MERGE_OBJECT = 'MERGE_OBJECT';

const reducer = combineReducers({
  array: array({
    SET: SET_ARRAY,
  }),
  object: object({
    SET: SET_OBJECT,
    REPLACE: REPLACE_OBJECT,
    MERGE: MERGE_OBJECT,
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
  it('copy shouldnt break', () => {
    const c = copyDepth(2,
      {},
      {
        locale: 'en',
        ageInterests: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        ageInterests: [1, 2, 3, 4, 5, 6, 7],
      },
    );
  });
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
      type: SET_OBJECT,
      data: mom => mom + ' + dad',
      key: ['message', 'hi'],
    });
    result = selectObject(store.getState());
    assert.equal(result.message.hi, 'mom + dad + dad');

    store.dispatch({
      type: SET_OBJECT,
      data: () => 'bob',
      key: 'message.test.again.yes',
    });
    result = selectObject(store.getState());
    assert.equal(result.message.test.again.yes, 'bob');

    store.dispatch({
      type: FILTER_OBJECT,
      data: mom => !!mom,
      key: 'message',
    });
    result = selectObject(store.getState());
    assert.deepEqual(result.message, {});

    store.dispatch({
      type: REPLACE_OBJECT,
      data: { mynew: { cool: 'state' } },
    });
    result = selectObject(store.getState());
    assert.deepEqual(result, { mynew: { cool: 'state' }});

    store.dispatch({
      type: MERGE_OBJECT,
      data: { mynew: {cooler: 'stater'}},
    });
    result = selectObject(store.getState());
    assert.deepEqual(result, { mynew: { cool: 'state', cooler: 'stater' }});
  });
  it('should update object on deep changes', () => {
    const store = createStore(reducer);
    const key = 'hello.bea.ut.i.ful';
    const key2 = 'hello.bei.ut';
    store.dispatch({
      type: SET_OBJECT,
      data: ({ to: 'beirut?'}),
      key: key2,
    });
    const beaut = store.getState().object.hello.bei.ut;
    store.dispatch({
      type: SET_OBJECT,
      data: ({ to: 'world'}),
      key,
    });
    const obj = store.getState().object;
    const hello = obj.hello;
    store.dispatch({
      type: SET_OBJECT,
      data: ({ to: 'country'}),
      key,
    });
    const nextObj = store.getState().object;
    const nextHello = nextObj.hello;
    const nextBeaut = store.getState().object.hello.bei.ut;
    assert(obj !== nextObj, 'Objects are equal');
    assert(hello !== nextHello, 'Hellos are equal');
    assert(beaut === nextBeaut, 'untouched objs arent equal');
  });
  it('should update object and not destruct array', () => {
    const store = createStore(reducer);

    store.dispatch({
      type: SET_OBJECT,
      data: 'no thanks',
      key: 'hello.config',
    });

    const key = 'hello.array';
    const data = [1, 2, 3];
    store.dispatch({
      type: SET_OBJECT,
      data,
      key: key,
    });
    const nextState = store.getState().object;
    assert(Array.isArray(get(nextState, key)));
  });
  it('reducer should work', () => {
    createStore(reducer);
  });
});

import omitBy from 'lodash/omitBy';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import get from 'lodash/get';
import merge from 'lodash/merge';
import assign from 'lodash/assign';
import mapValues from 'lodash/mapValues';
import mapKeys from 'lodash/mapKeys';
import copyDepth from './copy';

/**
 * Sets data at key without mutating state through key path
 * @param state
 * @param keyArr
 * @param data
 */
export const setCopy = (state, keyArr, data) => {
  if (keyArr.length) {
    const val = state ? state[keyArr[0]] : state;
    return assign({}, state, {
      [keyArr[0]]: setCopy(val, keyArr.slice(1), data),
    });
  }
  return data;
};

export default (actionTypes, defaultValue = {}) =>
  (state = defaultValue, action) => {
    const key = action.key || [];
    const keyNorm = isArray(key) ? key : key.split('.');

    const getState = keyNorm.length
      ? () => get(state, keyNorm)
      : () => state;

    const getData = () => (
      isFunction(action.data)
        ? action.data(getState(), action, state)
        : action.data
    );

    const getResult = () => {
      const data = getData();
      return keyNorm.length ? setCopy(
        {},
        keyNorm,
        data,
      ) : data;
    };

    switch (action.type) {
      case actionTypes.MERGE:
      case actionTypes.SET: {
        const depth = action.depth || 1;
        const merger = (
          action.type === actionTypes.MERGE || depth < -1
        )
          ? merge
          : copyDepth.bind(null, depth + keyNorm.length);

        const result = getResult();

        if (depth + keyNorm.length === 0) {
          return result;
        }

        return merger(
          {},
          state,
          result,
        );
      }
      case actionTypes.FILTER: {
        const data = isFunction(action.data)
          ? omitBy(getState(), action.data)
          : omit(getState(), action);
        return setCopy(state, keyNorm, data);
      }
      case actionTypes.MAP_VALUES: {
        const data = mapValues(getState(), action.data);
        return setCopy(state, keyNorm, data);
      }
      case actionTypes.MAP_KEYS: {
        const data = mapKeys(getState(), action.data);
        return setCopy(state, keyNorm, data);
      }
      case actionTypes.REPLACE:
        return keyNorm.length ? assign({}, state, getResult()) : getResult();
      case actionTypes.CLEAR:
        return defaultValue;
      default:
        return state;
    }
  };

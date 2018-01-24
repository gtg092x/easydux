import omitBy from 'lodash/omitBy';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import get from 'lodash/get';
import merge from 'lodash/merge';
import assignDepth from './assign';

/**
 * Returns object with only `keyArray` value set to data
 */
function placeDataAtKey(data, keyArray) {
  return keyArray.length ? {
    [keyArray[0]]: placeDataAtKey(data, keyArray.slice(1)),
  } : data;
}

export default (actionTypes, defaultValue = {}) =>
  (state = defaultValue, action) => {
    switch (action.type) {
      case actionTypes.MERGE:
      case actionTypes.SET:
      case actionTypes.MERGE_AT:
      case actionTypes.SET_AT: {
        const depth = action.depth || 1;
        const key = action.key || [];
        const keyNorm = isArray(key) ? key : key.split('.');
        const merger = (
          action.type === actionTypes.MERGE || action.type === actionTypes.MERGE_AT || depth === -1
        )
          ? merge
          : assignDepth.bind(null, depth + keyNorm.length);

        const getState = keyNorm.length
          ? _state => get(_state, keyNorm)
          : _state => _state;

        return merger(
          {},
          state,
          placeDataAtKey(
            isFunction(action.data) ? action.data(getState(state), action, state) : action.data,
            keyNorm,
          ),
        );
      }
      case actionTypes.FILTER:
        return isArray(action.data) ? omitBy(state, action.data) : omit(state, action);
      case actionTypes.REPLACE:
        return isFunction(action.data) ? action.data(state, action) : action.data;
      case actionTypes.CLEAR:
        return defaultValue;
      default:
        return state;
    }
  };


import omitBy from 'lodash/omitBy';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import get from 'lodash/get';
import mergeDepth from './merge';

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
      case actionTypes.SET: {
        const depth = action.depth || 1;
        const key = action.key || [];
        const keyNorm = isArray(key) ? key : key.split('.');

        return mergeDepth(
          depth + keyNorm.length,
          {},
          state,
          placeDataAtKey(
            isFunction(action.data) ? action.data(get(state, keyNorm)) : action.data,
            keyNorm,
          ),
        );
      }
      case actionTypes.FILTER:
        return isArray(action.data) ? omitBy(state, action.data) : omit(state, action);
      case actionTypes.REPLACE:
        return isFunction(action.data) ? action.data(state) : action.data;
      case actionTypes.CLEAR:
        return defaultValue;
      default:
        return state;
    }
  };


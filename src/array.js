import isFunction from 'lodash/isFunction';
import uniq from 'lodash/uniq';
import flow from 'lodash/flow';
import compact from 'lodash/compact';
import sortBy from 'lodash/sortBy';

export default (actionTypes, defaultValue = []) =>
  (state = defaultValue, action) => {
    const processors = [];
    if (action.compact) {
      processors.push(compact);
    }
    if (action.uniq) {
      processors.push(uniq);
    }
    if (action.sort) {
      processors.push(_state => sortBy(_state, action.sort));
    }
    const processor = flow(...processors);
    switch (action.type) {
      case actionTypes.SET_AT:
        return processor([
          ...state.slice(0, action.index),
          isFunction(action.data) ? action.data(state[action.index], action, state) : action.data,
          ...state.slice(action.index + 1),
        ]);
      case actionTypes.INSERT_AT:
        return processor([
          ...state.slice(0, action.index),
          isFunction(action.data) ? action.data(null, state, action) : action.data,
          ...state.slice(action.index),
        ]);
      case actionTypes.REMOVE_AT:
        return [
          ...state.slice(0, action.index),
          ...state.slice(action.index + 1),
        ];
      case actionTypes.SLICE:
        return state.slice(action.start || 0, action.end);
      case actionTypes.PUSH:
        return processor([
          ...state,
          isFunction(action.data) ? action.data(null, state, action) : action.data,
        ]);
      case actionTypes.CONCAT:
        return processor([
          ...state,
          ...isFunction(action.data) ? action.data(null, state, action) : action.data,
        ]);
      case actionTypes.CONCAT_TO:
        return processor([
          ...isFunction(action.data) ? action.data(null, state, action) : action.data,
          ...state,
        ]);
      case actionTypes.UNSHIFT:
        return processor([
          isFunction(action.data) ? action.data(null, state, action) : action.data,
          ...state,
        ]);
      case actionTypes.SHIFT:
        return [
          ...state.slice(1),
        ];
      case actionTypes.POP:
        return [
          ...state.slice(0, -1),
        ];
      case actionTypes.FILTER:
        return state.filter(action.data);
      case actionTypes.MAP:
        return state.map(action.data);
      case actionTypes.SET:
        return processor(isFunction(action.data) ? action.data(state, action) : action.data);
      case actionTypes.CLEAR:
        return defaultValue;
      default:
        return state;
    }
  };

import isFunction from 'lodash/isFunction';

export default (actionTypes, defaultValue = []) =>
  (state = defaultValue, action) => {
    switch (action.type) {
      case actionTypes.SET_AT:
        return [
          ...state.slice(0, action.index),
          action.data,
          ...state.slice(action.index + 1),
        ];
      case actionTypes.INSERT_AT:
        return [
          ...state.slice(0, action.index),
          action.data,
          ...state.slice(action.index),
        ];
      case actionTypes.REMOVE_AT:
        return [
          ...state.slice(0, action.index),
          ...state.slice(action.index + 1),
        ];
      case actionTypes.SLICE:
        return state.slice(action.start, action.end);
      case actionTypes.PUSH:
      case actionTypes.ADD:
        return [
          ...state,
          action.data,
        ];
      case actionTypes.CONCAT:
        return [
          ...state,
          ...action.data,
        ];
      case actionTypes.UNSHIFT:
        return [
          action.data,
          ...state,
        ];
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
      case actionTypes.REPLACE:
      case actionTypes.SET:
        return isFunction(action.data) ? action.data(state) : action.data;
      case actionTypes.CLEAR:
        return defaultValue;
      default:
        return state;
    }
  };

import isFunction from 'lodash/isFunction';

export default (actionTypes, defaultValue = null) =>
  (state = defaultValue, action) => {
    switch (action.type) {
      case actionTypes.SET:
        return isFunction(action.data) ? action.data(state, action) : action.data;
      case actionTypes.CLEAR:
        return defaultValue;
      default:
        return state;
    }
  };

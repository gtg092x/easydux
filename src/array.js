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

    // indy was the dog's name
    const indy = () => (action.index + state.length) % state.length;
    const actionNew = () =>
      (isFunction(action.data) ? action.data(null, action, state) : action.data);
    const actionSet = () => (isFunction(action.data) ? action.data(state, action) : action.data);
    const actionSetOne = () =>
      (isFunction(action.data) ? action.data(state[indy()], action, state) : action.data);

    switch (action.type) {
      case actionTypes.SET_AT:
        return processor([
          ...state.slice(0, indy()),
          actionSetOne(),
          ...state.slice(indy() + 1),
        ]);
      case actionTypes.INSERT_AT:
        return processor([
          ...state.slice(0, indy()),
          actionNew(),
          ...state.slice(indy()),
        ]);
      case actionTypes.REMOVE_AT:
        return [
          ...state.slice(0, indy()),
          ...state.slice(indy() + 1),
        ];
      case actionTypes.SLICE:
        return state.slice(action.start || 0, action.end);
      case actionTypes.PUSH:
        return processor([
          ...state,
          actionNew(),
        ]);
      case actionTypes.CONCAT:
        return processor([
          ...state,
          ...actionNew(),
        ]);
      case actionTypes.CONCAT_TO:
        return processor([
          ...actionNew(),
          ...state,
        ]);
      case actionTypes.UNSHIFT:
        return processor([
          actionNew(),
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
        return processor(actionSet());
      case actionTypes.CLEAR:
        return defaultValue;
      default:
        return state;
    }
  };

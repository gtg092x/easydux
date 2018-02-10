import isArray from 'lodash/isArray';
import { setCopy as setCopyObj } from './object';

export const setCopy = (target, path, value) =>
  setCopyObj(target, isArray(path) ? path : path.split('.'), value);

export value from './value';
export array from './array';
export object from './object';

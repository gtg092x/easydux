import keys from 'lodash/keys';
import assign from 'lodash/assign';
import isObject from 'lodash/isObject';

export default function copyDepth(depth, target, ...sources) {
  if (isObject(target)) {
    sources.forEach((source) => {
      if (isObject(source)) {
        if (depth > 1) {
          keys(source).forEach((key) => {
            if (isObject(source[key])) {
              if (!(key in target)) {
                assign(target, { [key]: source[key] });
              } else {
                // eslint-disable-next-line no-param-reassign
                target[key] = copyDepth(depth - 1, {}, target[key], source[key]);
              }
            } else {
              assign(target, { [key]: source[key] });
            }
          });
        } else if (depth === 1) {
          assign(target, source);
        }
      }
    });
  }
  return target;
}

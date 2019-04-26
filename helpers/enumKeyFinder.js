import enumRate from './enumeration';

let enumKey;
const extract = (value) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const i in enumRate) {
    if (enumRate[i] === value) {
      enumKey = i;
    }
  }
  return enumKey;
};

export default extract;

import { IMaskItemsMap, IMaskItem } from '../interfaces/IMaskItem';
/**
 *
 * @param {String} mask
 * @param format
 * @returns {Array}
 */
export default function defineMaskList(mask: String, format: IMaskItemsMap): Array<IMaskItem> {
  if (!mask) {
    return [];
  }

  const stack: Array<IMaskItem> = [];

  // flag if escape char is used
  let escape = false;

  mask.split('').forEach((maskChar) => {
    let item = format[maskChar];

    // if the previous char was escape char, we should ignore next format rule, and process mask char as a regular char.
    if (escape && item) {
      item = null;
      escape = false;
    }

    if (!item) {
      // escape char
      if (!escape && maskChar === '\\') {
        escape = true;
        return;
      }

      escape = false;
      stack.push({
        char: maskChar,
      });
      return;
    }

    if (item.regexp) {
      stack.push(item);
    }
  });

  return stack;
}

import { CharTypes } from '../constants/CharTypesEnum';
import { ISelectRange } from '../interfaces/ISelectRange';
import { IMaskItem } from '../interfaces/IMaskItem';
import { IInputValue } from '../interfaces/IInput';

export function buildInputStrings(
  data: Array<IInputValue>,
  mask: Array<IMaskItem>,
  input: string,
  maskChar: string,
  maskString: string,
  selection: ISelectRange
): { value: Array<IInputValue>; maskedValue: string; inputValuesApplied: number } {
  let value: Array<IInputValue> = [];
  let valueIndex = 0;
  let pastedIndex = 0;
  let maskedValue = '';
  let inputValuesApplied = 0;

  function processMaskPartAsChar(maskPart: IMaskItem, pastedValuesStack: string, item: IInputValue) {
    // if user inputs value, we check it, but we don't go through whole stack
    if (pastedValuesStack && pastedValuesStack[0] === maskPart.char) {
      pastedIndex++;
    } else {
      if ((item && (item.char === maskPart.char || item.type !== CharTypes.USER)) || input) {
        valueIndex++;
      }
    }

    value.push({
      char: maskPart.char,
      type: CharTypes.CHAR,
    });

    if (pastedValuesStack) {
      inputValuesApplied++;
    }

    maskedValue += maskPart.char;
  }

  function processMaskPartAsRegExp(
    maskPart: IMaskItem,
    maskIndex: number,
    pastedValuesStack: string,
    item: IInputValue
  ) {
    let part = null;

    // If we have the value inputted by user, check it.
    // We have to move through the whole stack, to find suitable
    if (pastedValuesStack) {
      let i = 0;
      while (!maskPart.regexp.test(pastedValuesStack[i]) && pastedValuesStack.length > i) {
        i++;
        pastedIndex++;
      }
      if (pastedValuesStack.length > i) {
        pastedIndex++;
        inputValuesApplied++;

        // Ignore previous value from the input
        valueIndex++;

        part = pastedValuesStack[i];
        value.push({
          char: part,
          type: CharTypes.USER,
        });
        maskedValue += part;
      }
    }

    if (part) {
      return;
    }
    // User input doesn't have data or it's invalid.
    // Try to apply the previous data, or change them to the placeholder

    // if shift happened, pass excess values
    if (item && item.type === CharTypes.CHAR && data.length > valueIndex + 1) {
      valueIndex++;
      processMaskItem(maskPart, maskIndex);
      return;
    }

    if (item && item.type === CharTypes.USER && maskPart.regexp.test(item.char)) {
      value.push({
        char: item.char,
        type: CharTypes.USER,
      });
      maskedValue += item.char;
      valueIndex++;

      return;
    }

    part = maskString ? maskString[maskIndex] : maskChar;

    value.push({
      char: part,
      type: CharTypes.MASK,
    });

    if (data.length > maskIndex) {
      valueIndex++;
    }

    maskedValue += part;
  }

  // we use closures here to mutate variables, so that it increases the performance.
  function processMaskItem(maskPart: IMaskItem, maskIndex: number) {
    let item: IInputValue = data.length > valueIndex ? data[valueIndex] : null;
    let pastedValuesStack: string = null;

    if (selection.start <= maskIndex && pastedIndex < input.length) {
      pastedValuesStack = input.slice(pastedIndex);
    }

    // process hardcoded char to the mask
    if (maskPart.char) {
      return processMaskPartAsChar(maskPart, pastedValuesStack, item);
    }

    // text by regexp
    if (maskPart.regexp) {
      return processMaskPartAsRegExp(maskPart, maskIndex, pastedValuesStack, item);
    }
  }

  mask.forEach((maskPart, maskIndex) => {
    processMaskItem(maskPart, maskIndex);
  });

  return {
    value,
    maskedValue,
    inputValuesApplied,
  };
}

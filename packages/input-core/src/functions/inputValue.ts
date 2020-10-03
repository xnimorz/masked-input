import { CharTypes } from '../constants/CharTypesEnum';
import { IInputValue, IInputState } from '../interfaces/IInput';
import { ISelectRange } from '../interfaces/ISelectRange';
import { IMaskItem } from '../interfaces/IMaskItem';
import { buildInputStrings } from './buildInputStrings';

export default function inputValue(params: {
  data: Array<IInputValue>;
  input?: string;
  selection: ISelectRange;
  mask: Array<IMaskItem>;
  maskChar?: string;
  maskString?: string;
  showStartChars?: boolean;
}): IInputState {
  const { data, input = '', selection, mask, maskChar, maskString, showStartChars } = params;

  const { value, maskedValue, inputValuesApplied } = buildInputStrings(
    data,
    mask,
    input,
    maskChar,
    maskString,
    selection
  );

  const selectionPosition = selection.start + inputValuesApplied;

  // remove all leading maskChar
  let bound = value.length - 1;
  let charsCount = 0;
  while (bound >= 0 && value[bound].type !== CharTypes.USER) {
    if (value[bound].type === CharTypes.MASK) {
      charsCount = 0;
    }
    if (value[bound].type === CharTypes.CHAR) {
      charsCount++;
    }
    bound--;
  }
  if (showStartChars || bound >= 0 || (input && input.trim())) {
    bound += charsCount;
  }

  let visibleValue = '';
  for (let i = 0; i <= bound; i++) {
    visibleValue += value[i].char;
  }

  return {
    value,
    visibleValue,
    maskedValue,
    selection: {
      start: selectionPosition,
      end: selectionPosition,
    },
  };
}

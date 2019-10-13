import { CharTypes } from '../constants/CharTypesEnum';
import { IInputValue } from '../interfaces/IInput';
import { ISelectRange } from '../interfaces/ISelectRange';

const copyMaskChar = (count: number, maskChar: string): Array<IInputValue> => {
  const res: Array<IInputValue> = [];
  for (let i = 0; i < count; i++) {
    res.push({
      char: maskChar,
      type: CharTypes.MASK,
    });
  }
  return res;
};

const pasteMaskSymbols = (maskString: string, maskChar: string, selection: ISelectRange): Array<IInputValue> => {
  if (maskString) {
    const res = [];
    for (let i = selection.start; i < selection.end; i++) {
      res.push({
        char: maskString[i],
        type: CharTypes.MASK,
      });
    }
    return res;
  }

  return copyMaskChar(selection.end - selection.start, maskChar);
};

export default function removeSelectedRange(param: {
  value: Array<IInputValue>;
  selection: ISelectRange;
  maskChar: string;
  maskString: string;
}): Array<IInputValue> {
  const { value, selection, maskChar, maskString } = param;

  if (selection.end < selection.start) {
    const tmp = selection.end;
    selection.end = selection.start;
    selection.start = tmp;
  }

  if (selection.start === selection.end) {
    return value;
  }

  if (value.length > selection.start) {
    return value
      .slice(0, selection.start)
      .concat(pasteMaskSymbols(maskString, maskChar, selection), value.slice(selection.end, value.length));
  }

  return value;
}

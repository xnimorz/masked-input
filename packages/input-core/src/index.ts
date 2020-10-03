import defineMaskList from './functions/defineMaskList';
import inputValue from './functions/inputValue';
import removeSelectedRange from './functions/removeSelectedRange';
import { CharTypes } from './constants/CharTypesEnum';
import { IInputParams, IInputState, IInputValue, IMaskedInput } from './interfaces/IInput';
import { IMaskItem, IMaskItemsMap } from './interfaces/IMaskItem';
import { ISelectRange } from './interfaces/ISelectRange';

export { IInputParams, IInputState, IInputValue, IMaskedInput, IMaskItem, IMaskItemsMap, ISelectRange };
export const defaults: {
  maskFormat: Array<IMaskItem>;
  maskChar: string;
  showMask: boolean;
  removeSelectedRange: Function;
  showStartChars: boolean;
} = {
  maskFormat: [
    {
      str: '0',
      regexp: /[0-9]/,
    },
    {
      str: '*',
      regexp: /./,
    },
    {
      str: 'a',
      regexp: /[a-zA-Z]/,
    },
  ],
  maskChar: '',
  showMask: false,
  removeSelectedRange,
  showStartChars: false,
};

export const createInput = (params: IInputParams): IMaskedInput => {
  let { maskString, reformat, maskFormat = defaults.maskFormat, maskChar = defaults.maskChar } = params;
  if (!reformat && !params.mask) {
    reformat = (params) => {
      const str = (params.value as IInputValue[]).map((item) => item.char).join('');
      return {
        value: params.value,
        visibleValue: str,
        maskedValue: str,
        selection: params.selection,
      };
    };
  } else if (reformat) {
    params.mask = null;
  }

  if (maskString && maskString.length !== params.mask.length) {
    throw new Error('maskString must have same length as mask');
  }

  if (maskChar.length > 1) {
    throw new Error('maskChar must have only 1 char');
  }

  let maskFormatMap: IMaskItemsMap;
  let selection: ISelectRange = { start: 0, end: 0 };
  let value: Array<IInputValue> | string;
  let maskedValue: string;
  let visibleValue: string;
  let mask: Array<IMaskItem>;
  let showStartChars = params.showStartChars;

  let callbacks = [];

  const interfaceMethods = {
    subscribe(callback) {
      callbacks.push(callback);
    },

    unsubscribe(callback) {
      callbacks = callbacks.filter((item) => item !== callback);
    },

    setShowStartChars(show: boolean) {
      showStartChars = show;
    },

    setMaskFormat(maskFormat: Array<IMaskItem>) {
      maskFormatMap = maskFormat.reduce((store, item) => {
        store[item.str] = item;
        return store;
      }, {}) as IMaskItemsMap;
    },

    setValue(data: string | Array<IInputValue>) {
      let result: IInputState;

      if (reformat) {
        result = reformat({
          value: data,
          selection,
        });
      } else {
        let dataList: Array<IInputValue>;
        if (Array.isArray(data)) {
          dataList = data;
        } else {
          dataList = [];
          for (let i = 0; i < data.length; i++) {
            dataList.push({ char: data[i], type: CharTypes.USER });
          }
        }
        result = inputValue({ data: dataList, selection, mask, maskChar, maskString, showStartChars });
      }

      applyChanges(result);
    },

    setSelection(newSelection: ISelectRange) {
      selection = newSelection;
    },

    getSelection() {
      return {
        start: selection.start,
        end: selection.end,
      };
    },

    backspace() {
      interfaceMethods.removePreviosOrSelected();
    },

    removePreviosOrSelected() {
      if (selection.start === selection.end) {
        selection.start = selection.end - 1;
        if (selection.start < 0) {
          selection.start = 0;
        }
      }

      interfaceMethods.input('');
    },

    removeNextOrSelected() {
      if (selection.start === selection.end) {
        selection.end++;
      }

      interfaceMethods.input('');
    },

    getState() {
      return {
        value,
        maskedValue,
        visibleValue,
        selection,
      };
    },

    setMask(newMask: string) {
      mask = defineMaskList(newMask, maskFormatMap);
      interfaceMethods.setValue(value);
    },

    setMaskChar(newMaskChar: string) {
      if (maskChar.length > 1) {
        throw new Error('maskChar must have only 1 char');
      }

      maskChar = newMaskChar;

      interfaceMethods.setValue(value);
    },

    setMaskString(newMaskString: string) {
      if (newMaskString && newMaskString.length !== mask.length) {
        throw new Error('maskString must have the same length as mask');
      }

      maskString = newMaskString;

      interfaceMethods.setValue(value);
    },

    setReformat(
      newReformat: (params: { value: Array<IInputValue>; input?: string; selection: ISelectRange }) => IInputState
    ) {
      reformat = newReformat;
      interfaceMethods.setValue(value);
    },

    paste(value: string) {
      interfaceMethods.input(value);
    },

    input(input: string) {
      let result: IInputState;

      if (reformat) {
        result = reformat({ value, input, selection });
      } else {
        const tmpValue = removeSelectedRange({ value: value as IInputValue[], selection, maskChar, maskString });
        selection.end = selection.start;
        result = inputValue({ data: tmpValue, input, selection, mask, maskChar, maskString, showStartChars });
      }

      applyChanges(result);
    },
  };

  function applyChanges(result: IInputState) {
    const oldMaskedValue = maskedValue;
    const oldVisibleValue = visibleValue;
    const oldSelection = selection;

    value = result.value;
    maskedValue = result.maskedValue;
    visibleValue = result.visibleValue;
    interfaceMethods.setSelection(result.selection);

    if (
      oldMaskedValue !== maskedValue ||
      oldVisibleValue !== visibleValue ||
      oldSelection.start !== selection.start ||
      oldSelection.end !== selection.end
    ) {
      notify();
    }
  }

  function notify() {
    const state = interfaceMethods.getState();
    callbacks.forEach((callback) => {
      callback(state);
    });
  }

  interfaceMethods.setMaskFormat(maskFormat);
  mask = defineMaskList(params.mask, maskFormatMap);
  interfaceMethods.setValue(params.value);

  return interfaceMethods;
};

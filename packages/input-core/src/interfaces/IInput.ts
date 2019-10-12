import { IMaskItem } from './IMaskItem';
import { CharTypes } from '../constants/CharTypesEnum';
import { ISelectRange } from './ISelectRange';

export interface IInputParams {
  value: string;
  mask?: string;
  maskChar?: string;
  maskFormat?: Array<IMaskItem>;
  maskString?: string;
  reformat?: (params: { value: Array<IInputValue> | string; input?: string; selection: ISelectRange }) => IInputState;
}

export interface IInputValue {
  char: string;
  type: CharTypes;
}

export interface IInputState {
  value: Array<IInputValue> | string;
  visibleValue: string;
  maskedValue: string;
  selection: {
    start: number;
    end: number;
  };
}

export interface IMaskedInput {
  setMaskFormat: (maskFormat: Array<IMaskItem>) => void;
  setValue: (data: string | Array<IInputValue>) => void;
  setSelection: (newSelection: ISelectRange) => void;
  getSelection: () => ISelectRange;
  backspace: () => void;
  removePreviosOrSelected: () => void;
  removeNextOrSelected: () => void;
  getState: () => IInputState;
  setMask: (newMask: string) => void;
  setMaskChar: (newMaskChar: string) => void;
  setMaskString: (newMaskString: string) => void;
  subscribe: (callback: (state: IInputState) => any) => void;
  unsubscribe: (callback: (state: IInputState) => any) => void;
  setReformat: (
    newReformat: (params: {
      value: Array<IInputValue> | string;
      input?: string;
      selection: ISelectRange;
    }) => IInputState
  ) => void;
  paste: (value: string) => void;
  input: (input: string) => void;
}

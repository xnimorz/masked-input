import { IMaskItem } from './IMaskItem';
import { CharTypes } from '../constants/CharTypesEnum';
import { ISelectRange } from './ISelectRange';

export interface IInputParams {
  value: string;
  mask?: string;
  maskChar?: string;
  maskFormat?: Array<IMaskItem>;
  maskString?: string;
  reformat?: (params: { value: Array<IInputValue>; input?: string; selection: ISelectRange }) => IInputState;
}

export interface IInputValue {
  char: string;
  type: CharTypes;
}

export interface IInputState {
  value: Array<IInputValue>;
  visibleValue: string;
  maskedValue: string;
  selection: {
    start: number;
    end: number;
  };
}

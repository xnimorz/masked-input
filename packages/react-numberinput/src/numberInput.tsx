import * as React from 'react';
import MaskInput from 'react-maskinput';
import { IInputState, IInputValue } from '../../input-core/src/interfaces/IInput';
import { IMaskItem } from '../../input-core/src/interfaces/IMaskItem';
import { ISelectRange } from '../../input-core/src/interfaces/ISelectRange';

interface IInputProps {
  value?: string;
  mask?: string;
  maskChar?: string;
  maskFormat?: Array<IMaskItem>;
  maskString?: string;
  reformat?: (params: { value: Array<IInputValue>; input?: string; selection: ISelectRange }) => IInputState;
  defaultValue?: string;
  alwaysShowMask?: boolean;
  showMask?: boolean;
  onChange?: (e: React.SyntheticEvent) => void;
  onValueChange?: (params: { maskedValue: string; value: string }) => void;
  getReference?: (el: HTMLInputElement) => void;
  onFocus: (e: React.FocusEvent) => void;
  onBlur: (e: React.FocusEvent) => void;
}

function removeSelectedRange(value: string, selection: { start: number; end: number }) {
  if (selection.start === selection.end) {
    return value;
  }

  if (selection.end < selection.start) {
    const tmp = selection.end;
    selection.end = selection.start;
    selection.start = tmp;
  }

  if (value.length > selection.start) {
    return value.slice(0, selection.start).concat(value.slice(selection.end, value.length));
  }

  return value;
}

/**
 * Component that allow to format only numbers. (5 000, 123 456 789, etc.)
 * This component work on top of react-maskinput and define custom formatting function called `reformat`.
 * Also you can use this component as example to create you own components based on react-maskinput.
 */
class NumberInput extends React.Component<IInputProps> {
  maskInput = null;
  reformat = ({ data, input = '', selection }) => {
    const newSelection = {
      start: selection.start,
      end: selection.end,
    };

    let value = removeSelectedRange(data.replace(/(\D)/g, text => (text === ' ' ? ' ' : '')), newSelection);
    const inputValue = input.replace(/\D/g, '');
    const oldLength = value.length;

    value = value.slice(0, newSelection.start) + inputValue + value.slice(newSelection.start, value.length);
    const spaces = value.match(/\s/g) || [];
    let oldSpacesCount = spaces.length;
    let newSpacesCount = 0;
    value = value.replace(/\s/g, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, text => {
      newSpacesCount++;
      return `${text} `;
    });

    let index = newSelection.start + Math.min(0, newSpacesCount - oldSpacesCount);
    if (inputValue) {
      index = Math.max(0, value.length - oldLength + index);
    }
    newSelection.end = newSelection.start = index;

    return {
      value,
      maskedValue: value,
      visibleValue: value,
      selection: newSelection,
    };
  };

  handleLeadingZeros = e => {
    this.maskInput.applyValue(e.target.value.replace(/^[0 ]+$/, '0'));

    this.props.onBlur && this.props.onBlur(e);
  };

  getMaskInputRef = el => {
    this.maskInput = el;
  };

  render() {
    return (
      <MaskInput {...this.props} reformat={this.reformat} onBlur={this.handleLeadingZeros} ref={this.getMaskInputRef} />
    );
  }
}

export default NumberInput;

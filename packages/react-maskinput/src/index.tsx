import * as React from 'react';

import { createInput, defaults, IInputState, IInputValue, IMaskItem, ISelectRange, IMaskedInput } from 'input-core';

const KEYBOARD = {
  BACKSPACE: 8,
  DELETE: 46,
};

interface IInputProps {
  value?: string;
  mask?: string;
  maskChar?: string;
  maskFormat?: Array<IMaskItem>;
  maskString?: string;
  reformat?: (params: { value: Array<IInputValue> | string; input?: string; selection: ISelectRange }) => IInputState;
  defaultValue?: string;
  alwaysShowMask?: boolean;
  showMask?: boolean;
  onChange?: (e: React.SyntheticEvent) => void;
  onValueChange?: (params: { maskedValue: string; value: string }) => void;
  getReference?: (el: HTMLInputElement) => void;
  onFocus: (e: React.FocusEvent) => void;
  onBlur: (e: React.FocusEvent) => void;
}

/**
 * React-MaskInput component
 * Params:
 * `mask`: String. Format:
 *   0 — any number 0-9
 *   * — any symbol
 *   a — A-Z, a-z
 *   q — "q" letter, 2 — "2" letter etc.
 *   \a — "a" letter
 * default is undefined
 *
 * [function] `reformat`: user function, if you want use custom reformat logic. It's userfull for numeric inputs.
 * If reformat defined mask'll be ignored. Reformat function must receive object with several fields:
 * function reformat({data: data, selection: {start, end}, input}) {
 *     // realisation
 *
 *     return {
 *         [any] value: value that store and calling in input core funcitons (such as reformat). value may have any format,
 *         [String] visibleValue: value that displayed to user in input if showMask is false,
 *         [String] maskedValue: value that  displayed to user in input if showMask is true,
 *         [{[integer] start, [integer] end}] selection: {start, end} — new selection range
 *     }
 * }
 *
 * if `reformat` and `mask` is undefined, input allow to enter any values.
 *
 * You can define custom mask by passing `maskFormat`. This prop must be an array,
 * each object in array have several fields:
 * str: matched char for mask
 * regexp: validation rule as regexp
 * type: special
 *
 * `maskChar`: Character to cover unfilled editable parts of mask. Default value is ''.
 * `maskString`: String to cover unfilled editable parts of mask. Default is undefined. If maskString define maskChar ignored.
 *
 * showMask: show mask in input. It's possible only if mask have not cyclic. Default value = false
 * alwaysShowMask: show mask when input inactive
 *
 * Callbacks:
 *   onValueChange(event). event is:
 *     maskedValue: masked value,
 *     value: value without nessesary mask
 *   getReference: callback to get input ref
 *   onChange(event) where event is a regular React.SyntheticEvent. Using this event you can get access to HTMLElement directly
 * All other props'll passed to input directly
 */
class MaskInput extends React.Component<IInputProps, { showMask: string }> {
  input: IMaskedInput;
  canSetSelection: boolean;
  inputEl: HTMLInputElement;
  constructor(props) {
    super(props);

    this.input = createInput({
      value: props.value || props.defaultValue || '',
      reformat: props.reformat,
      maskString: props.maskString,
      maskChar: props.maskChar || defaults.maskChar,
      mask: props.mask || undefined,
      maskFormat: props.maskFormat || defaults.maskFormat,
    });

    this.state = {
      showMask: props.alwaysShowMask || props.showMask,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.alwaysShowMask !== nextProps.alwaysShowMask || this.props.showMask !== nextProps.showMask) {
      this.setState({
        showMask: nextProps.alwaysShowMask || nextProps.showMask,
      });
    }

    if (nextProps.reformat !== this.props.reformat) {
      this.input.setReformat(nextProps.reformat);
    }

    if (nextProps.maskFormat && nextProps.maskFormat !== this.props.maskFormat) {
      this.input.setMaskFormat(nextProps.maskFormat);
    }

    if (nextProps.mask !== this.props.mask) {
      this.input.setMask(nextProps.mask);
    }

    if (nextProps.maskString !== this.props.maskString) {
      this.input.setMaskString(nextProps.maskString);
    }

    if (nextProps.maskChar !== this.props.maskChar) {
      this.input.setMaskChar(nextProps.maskChar);
    }

    if (nextProps.value !== this.props.value) {
      this.input.setValue(nextProps.value);
    }
  }

  componentDidMount() {
    this.input.subscribe(this.subscriber);
    this.showValue();
    this.props.getReference && this.props.getReference(this.inputEl);
  }

  componentWillUnmount() {
    this.input.unsubscribe(this.subscriber);
  }

  dispatchEvent(e: React.SyntheticEvent) {
    this.props.onChange && this.props.onChange(e);
    const { maskedValue, visibleValue } = this.input.getState();
    this.props.onValueChange && this.props.onValueChange({ maskedValue, value: visibleValue });
  }

  subscriber = () => {
    this.showValue();
    this.setSelection();
  };

  showValue = () => {
    if (this.state.showMask && (this.canSetSelection || this.props.alwaysShowMask)) {
      this.inputEl.value = this.input.getState().maskedValue;
      return;
    }
    this.inputEl.value = this.input.getState().visibleValue;
  };

  setSelection = () => {
    if (!this.canSetSelection) {
      return;
    }
    const selection = this.input.getSelection();
    this.inputEl.setSelectionRange(selection.start, selection.end);
    const raf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      // @ts-ignore
      window.mozRequestAnimationFrame ||
      (fn => setTimeout(fn, 0));
    // For android
    raf(() => this.inputEl.setSelectionRange(selection.start, selection.end));
  };

  getSelection() {
    this.input.setSelection({
      start: this.inputEl.selectionStart,
      end: this.inputEl.selectionEnd,
    });
  }

  onPaste = e => {
    e.preventDefault();
    this.getSelection();

    // getData value needed for IE also works in FF & Chrome
    this.input.paste(e.clipboardData.getData('Text'));

    // Timeout needed for IE
    setTimeout(this.setSelection, 0);

    this.dispatchEvent(e);
  };

  onChange = (e: React.ChangeEvent) => {
    let currentValue;
    if (this.state.showMask && (this.canSetSelection || this.props.alwaysShowMask)) {
      currentValue = this.input.getState().maskedValue;
    } else {
      currentValue = this.input.getState().visibleValue;
    }

    // fix conflict by update value in mask model
    if ((e.target as HTMLInputElement).value !== currentValue) {
      this.getSelection();
      this.input.setValue((e.target as HTMLInputElement).value);

      setTimeout(this.setSelection, 0);
    }
    this.dispatchEvent(e);
  };

  onKeyPress = e => {
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
      return;
    }

    e.preventDefault();
    this.getSelection();
    this.input.input(e.key || e.data || String.fromCharCode(e.which));
    this.setSelection();
    this.dispatchEvent(e);
  };

  onKeyDown = e => {
    if (e.which === KEYBOARD.BACKSPACE) {
      e.preventDefault();
      this.getSelection();
      this.input.removePreviosOrSelected();

      this.setSelection();

      this.dispatchEvent(e);
    }

    if (e.which === KEYBOARD.DELETE) {
      e.preventDefault();
      this.getSelection();
      this.input.removeNextOrSelected();

      this.setSelection();

      this.dispatchEvent(e);
    }
  };

  onFocus = e => {
    this.canSetSelection = true;
    this.props.onFocus && this.props.onFocus(e);
  };

  onBlur = e => {
    this.canSetSelection = false;
    this.props.onBlur && this.props.onBlur(e);
  };

  keyPressPropName() {
    if (typeof navigator !== 'undefined' && navigator.userAgent.match(/Android/i)) {
      return 'onBeforeInput';
    }
    return 'onKeyPress';
  }

  render() {
    const {
      onChange,

      /* ignore unspecific props for input */
      onValueChange,
      mask,
      getReference,
      showMask,
      maskChar,
      alwaysShowMask,
      maskFormat,
      maskString,
      reformat,

      /* ignore values */
      value,
      defaultValue,

      ...inputProps
    } = this.props;

    const keyPressEvent = { [this.keyPressPropName()]: this.onKeyPress };

    return (
      <input
        {...inputProps}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onPaste={this.onPaste}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        {...keyPressEvent}
        ref={el => (this.inputEl = el as HTMLInputElement)}
      />
    );
  }
}

export default MaskInput;

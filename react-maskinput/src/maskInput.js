import React, { Component } from 'react';

import { createInput, defaults } from 'input-core';

const KEYBOARD = {
  BACKSPACE: 8,
  DELETE: 46,
};
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
 *     unformattedValue: unformatted value,
 *     value: visible value
 *   getReference: callback to get input ref
 * All other props'll passed to input directly
 */
class MaskInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.input = createInput({
      value: props.value || props.defaultValue || '',
      reformat: props.reformat,
      maskString: props.maskString,
      maskChar: props.maskChar || defaults.maskChar,
      mask: props.mask || defaults.mask,
      maskFormat: props.maskFormat || defaults.maskFormat,
    });

    this.state = {
      showMask: props.alwaysShowMask || props.showMask,
    };

    this.applyValue = value => {
      this.input.setValue(value);

      if (this.state.showMask && (this.canSetSelection || this.props.alwaysShowMask)) {
        this.refs.input.value = this.input.getMaskedValue();
        return;
      }
      this.refs.input.value = this.input.getVisibleValue();
    };
  }

  componentWillReceiveProps(nextProps) {
    let updated = false;

    if (this.props.alwaysShowMask !== nextProps.alwaysShowMask || this.props.showMask !== nextProps.showMask) {
      this.setState({
        showMask: nextProps.alwaysShowMask || nextProps.showMask,
      });
    }

    if (nextProps.reformat !== this.props.reformat) {
      this.input.setReformat(nextProps.reformat);
      updated = true;
    }

    if (nextProps.maskFormat && nextProps.maskFormat !== this.props.maskFormat) {
      this.input.setMaskFormat(nextProps.maskFormat);
      updated = true;
    }

    if (nextProps.mask !== this.props.mask) {
      this.input.setMask(nextProps.mask);
      updated = true;
    }

    if (nextProps.maskString !== this.props.maskString) {
      this.input.setMaskString(nextProps.maskString);
    }

    if (nextProps.maskChar !== this.props.maskChar) {
      this.input.setMaskChar(nextProps.maskChar);
      updated = true;
    }

    if (nextProps.value !== this.props.value) {
      this.input.setValue(nextProps.value);
      updated = true;
    }

    if (updated) {
      if ((this.canSetSelection && nextProps.showMask) || nextProps.alwaysShowMask) {
        this.refs.input.value = this.input.getMaskedValue();
      } else {
        this.refs.input.value = this.input.getVisibleValue();
      }
      this.setSelection();
    }
  }

  componentDidMount() {
    this.showValue();
    this.props.getReference && this.props.getReference(this.refs.input);
  }

  showValue = () => {
    if (this.state.showMask && (this.canSetSelection || this.props.alwaysShowMask)) {
      this.refs.input.value = this.input.getMaskedValue();
      return;
    }
    this.refs.input.value = this.input.getVisibleValue();
  };

  setSelection = () => {
    if (!this.canSetSelection) {
      return;
    }
    const selection = this.input.getSelection();
    this.refs.input.setSelectionRange(selection.start, selection.end);
    const raf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      (fn => setTimeout(fn, 0));
    // For android
    raf(() => this.refs.input.setSelectionRange(selection.start, selection.end));
  };

  getSelection() {
    this.input.setSelection({
      start: this.refs.input.selectionStart,
      end: this.refs.input.selectionEnd,
    });
  }

  onPaste = e => {
    e.preventDefault();
    this.getSelection();

    // getData value needed for IE also works in FF & Chrome
    this.input.paste(e.clipboardData.getData('Text'));

    this.showValue();

    // Timeout needed for IE
    setTimeout(this.setSelection, 0);

    this.props.onChange && this.props.onChange(e);
  };

  onChange = e => {
    let currentValue;
    if (this.state.showMask && (this.canSetSelection || this.props.alwaysShowMask)) {
      currentValue = this.input.getMaskedValue();
    } else {
      currentValue = this.input.getVisibleValue();
    }

    // fix conflict by update value in mask model
    if (e.target.value !== currentValue) {
      this.getSelection();
      this.input.setValue(e.target.value);

      this.showValue();

      setTimeout(this.setSelection, 0);
    }
    this.props.onChange && this.props.onChange(e);
  };

  onKeyPress = e => {
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
      return;
    }

    e.preventDefault();
    this.getSelection();
    this.input.input(e.key || e.data || String.fromCharCode(e.which));
    this.showValue();
    this.setSelection();
    this.props.onChange && this.props.onChange(e);
  };

  onKeyDown = e => {
    if (e.which === KEYBOARD.BACKSPACE) {
      e.preventDefault();
      this.getSelection();
      this.input.removePreviosOrSelected();

      this.showValue();
      this.setSelection();

      this.props.onChange && this.props.onChange(e);
    }

    if (e.which === KEYBOARD.DELETE) {
      e.preventDefault();
      this.getSelection();
      this.input.removeNextOrSelected();

      this.showValue();
      this.setSelection();

      this.props.onChange && this.props.onChange(e);
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
      direction,
      getReference,
      showMask,
      maskChar,
      alwaysShowMask,
      customMaskFormat,
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
        ref="input"
      />
    );
  }
}

export default MaskInput;

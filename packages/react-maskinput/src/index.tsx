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
function MaskInput(props: IInputProps) {
  const input = React.useMemo<IMaskedInput>(
    () =>
      createInput({
        value: props.value || props.defaultValue || '',
        reformat: props.reformat,
        maskString: props.maskString,
        maskChar: props.maskChar || defaults.maskChar,
        mask: props.mask || undefined,
        maskFormat: props.maskFormat || defaults.maskFormat,
      }),
    []
  );
  const firstRender = React.useRef(false);
  const canSetSelection = React.useRef(false);
  const inputEl = React.useRef<HTMLInputElement>();
  const [showMask, setShowMask] = React.useState(props.alwaysShowMask || props.showMask);

  const getSelection = React.useCallback(() => {
    input.setSelection({
      start: inputEl.current.selectionStart,
      end: inputEl.current.selectionEnd,
    });
  }, [input]);

  const setSelection = React.useCallback(() => {
    if (!canSetSelection.current) {
      return;
    }
    const selection = input.getSelection();
    inputEl.current.setSelectionRange(selection.start, selection.end);

    const raf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      // @ts-ignore
      window.mozRequestAnimationFrame ||
      ((fn) => setTimeout(fn, 0));
    raf(() => inputEl.current.setSelectionRange(selection.start, selection.end));
  }, [input]);

  const showValue = React.useCallback(() => {
    if (showMask && (canSetSelection.current || props.alwaysShowMask)) {
      inputEl.current.value = input.getState().maskedValue;
      return;
    }
    inputEl.current.value = input.getState().visibleValue;
  }, [showMask, props.alwaysShowMask, input]);

  React.useEffect(() => {
    if (!firstRender.current) {
      setShowMask(props.alwaysShowMask || props.showMask);
    }
  }, [props.alwaysShowMask, props.showMask]);

  React.useEffect(() => {
    if (!firstRender.current) {
      input.setReformat(props.reformat);
    }
  }, [props.reformat]);

  React.useEffect(() => {
    if (!firstRender.current) {
      input.setMaskFormat(props.maskFormat);
    }
  }, [props.maskFormat]);

  React.useEffect(() => {
    if (!firstRender.current) {
      input.setMask(props.mask);
    }
  }, [props.mask]);

  React.useEffect(() => {
    if (!firstRender.current) {
      input.setMask(props.mask);
    }
  }, [props.mask]);

  React.useEffect(() => {
    if (!firstRender.current) {
      input.setMaskString(props.maskString);
    }
  }, [props.maskString]);

  React.useEffect(() => {
    if (!firstRender.current) {
      input.setMaskChar(props.maskChar);
    }
  }, [props.maskChar]);

  React.useEffect(() => {
    if (!firstRender.current) {
      input.setValue(props.value);
    }
  }, [props.value]);

  React.useEffect(() => {
    firstRender.current = false;
    showValue();
  }, [firstRender.current, input]);

  React.useEffect(() => {
    const subscriber = () => {
      showValue();
      setSelection();
    };

    input.subscribe(subscriber);

    return () => {
      input.unsubscribe(subscriber);
    };
  }, [input, showValue, setSelection]);

  React.useEffect(() => {
    props.getReference && props.getReference(inputEl.current);
  }, [props.getReference]);

  const keyPressPropName = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent.match(/Android/i)) {
      return 'onBeforeInput';
    }
    return 'onKeyPress';
  }, []);

  const dispatchEvent = (e: React.SyntheticEvent) => {
    props.onChange && props.onChange(e);
    const { maskedValue, visibleValue } = input.getState();
    onValueChange && onValueChange({ maskedValue, value: visibleValue });
  };

  const onPaste = (e) => {
    e.preventDefault();
    getSelection();

    // getData value needed for IE also works in FF & Chrome
    input.paste(e.clipboardData.getData('Text'));

    // Timeout needed for IE
    setTimeout(setSelection, 0);

    dispatchEvent(e);
  };

  const onChange = (e: React.ChangeEvent) => {
    let currentValue;
    if (showMask && (canSetSelection.current || props.alwaysShowMask)) {
      currentValue = input.getState().maskedValue;
    } else {
      currentValue = input.getState().visibleValue;
    }

    // fix conflict by update value in mask model
    if ((e.target as HTMLInputElement).value !== currentValue) {
      getSelection();
      input.setValue((e.target as HTMLInputElement).value);

      setTimeout(setSelection, 0);
    }
    dispatchEvent(e);
  };

  const onKeyPress = (e) => {
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
      return;
    }

    e.preventDefault();
    getSelection();
    input.input(e.key || e.data || String.fromCharCode(e.which));
    setSelection();
    dispatchEvent(e);
  };

  const onKeyDown = (e) => {
    if (e.which === KEYBOARD.BACKSPACE) {
      e.preventDefault();
      getSelection();
      input.removePreviosOrSelected();

      setSelection();

      dispatchEvent(e);
    }

    if (e.which === KEYBOARD.DELETE) {
      e.preventDefault();
      getSelection();
      input.removeNextOrSelected();

      setSelection();

      dispatchEvent(e);
    }
  };

  const onFocus = (e) => {
    canSetSelection.current = true;
    props.onFocus && props.onFocus(e);
  };

  const onBlur = (e) => {
    canSetSelection.current = false;
    props.onBlur && props.onBlur(e);
  };

  const {
    onChange: ignoreOnChange,

    /* ignore unspecific props for input */
    onValueChange,
    mask,
    getReference,
    showMask: ignoreShowMask,
    maskChar,
    alwaysShowMask,
    maskFormat,
    maskString,
    reformat,

    /* ignore values */
    value,
    defaultValue,

    ...inputProps
  } = props;

  const keyPressEvent = { [keyPressPropName()]: onKeyPress };

  return (
    <input
      {...inputProps}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onFocus={onFocus}
      onBlur={onBlur}
      {...keyPressEvent}
      ref={inputEl}
    />
  );
}

export default MaskInput;

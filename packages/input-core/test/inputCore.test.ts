import { createInput } from '../src';

describe('inputCore', () => {
  it('Applies value in constructor', () => {
    const input = createInput({
      value: '1234567',
      mask: '0000-0000',
      maskChar: '_',
    });

    expect(input.getState().maskedValue).toBe('1234-567_');
    expect(input.getState().visibleValue).toBe('1234-567');
  });

  it('Applies custom maskFormat', () => {
    const input = createInput({
      value: '1234567',
      mask: '0000-9999',
      maskFormat: [
        {
          str: '0',
          regexp: /[1,2]/,
        },
        {
          str: '9',
          regexp: /[0-9]/,
        },
      ],
      maskChar: '_',
    });

    expect(input.getState().maskedValue).toBe('12__-567_');
    expect(input.getState().visibleValue).toBe('12__-567');
  });

  it('input.input changes current symbol', () => {
    const input = createInput({
      value: '1234567',
      mask: '0000-0000',
      maskChar: '_',
    });

    input.setSelection({ start: 0, end: 0 });
    input.input('9');
    expect(input.getState().maskedValue).toBe('9234-567_');
    expect(input.getState().visibleValue).toBe('9234-567');
    expect(input.getSelection().start).toBe(1);
    expect(input.getSelection().end).toBe(1);
  });

  it('input.input with selection changes current symbol and removes selected range', () => {
    const input = createInput({
      value: '1234567',
      mask: '0000-0000',
      maskChar: '_',
    });

    input.setSelection({ start: 0, end: 4 });
    input.input('9');
    expect(input.getState().maskedValue).toBe('9___-567_');
    expect(input.getState().visibleValue).toBe('9___-567');
    expect(input.getSelection().start).toBe(1);
    expect(input.getSelection().end).toBe(1);
  });
});

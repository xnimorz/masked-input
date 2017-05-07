import assert from 'assert';

import { createInput, defaults } from '../src/inputCore';

describe('inputCore', () => {
    it('Apply value in constructor', () => {
        const input = createInput({
            value: '1234567',
            mask: '0000-0000',            
            maskChar: '_'
        });

        assert.equal(input.getMaskedValue(), '1234-567_');
        assert.equal(input.getVisibleValue(), '1234-567');
    });

    it ('Apply custom maskFormat', () => {
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
            maskChar: '_'
        });

        assert.equal(input.getMaskedValue(), '12__-567_');
        assert.equal(input.getVisibleValue(), '12__-567');        
    });

    it ('input.input change current symbol', () => {
        const input = createInput({
            value: '1234567',
            mask: '0000-0000',            
            maskChar: '_'
        });

        input.setSelection({start: 0, end: 0});
        input.input('9');
        assert.equal(input.getMaskedValue(), '9234-567_');
        assert.equal(input.getVisibleValue(), '9234-567'); 
        assert.equal(input.getSelection().start, 1);
        assert.equal(input.getSelection().end, 1);
    });

    it ('input.input with selection change current symbol and remove selected range', () => {
        const input = createInput({
            value: '1234567',
            mask: '0000-0000',            
            maskChar: '_'
        });

        input.setSelection({start: 0, end: 4});
        input.input('9');
        assert.equal(input.getMaskedValue(), '9___-567_');
        assert.equal(input.getVisibleValue(), '9___-567'); 
        assert.equal(input.getSelection().start, 1);
        assert.equal(input.getSelection().end, 1);
    });    
});
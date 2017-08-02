import { createInput, defaults } from 'input-core';
import subscribe from 'subscribe-event';

const KEYBOARD = {
    BACKSPACE: 8,
    DELETE: 46,
};
/**
 * Adapter of react-maskInput to vanilaJs
 */
class MaskInput {
    constructor(element, 
    {
        mask = defaults.mask, 
        value = '',
        reformat,
        maskString,
        maskChar = defaults.maskChar,        
        maskFormat = defaults.maskFormat,
        showMask,
        alwaysShowMask,
        onChange,
    }) {
        this.input = this.input = createInput({
            value: value,
            reformat: reformat,
            maskString: maskString,
            maskChar: maskChar,
            mask: mask,            
            maskFormat: maskFormat,
        });   

        this.props = {
            mask,
            value, 
            reformat,
            maskChar,
            maskFormat,
            maskString,
            showMask,
            alwaysShowMask,
            onChange,
        };        

        this.showMask = alwaysShowMask || showMask;

        this.element = element;
        this.showValue();
        this.subscribe();
    }

    setProps({
        mask,
        value,
        reformat,
        maskString,
        maskChar,        
        maskFormat,
        showMask,
        alwaysShowMask,
        onChange,
    }) {
        let updated = false;

        if (this.props.onChange !== onChange) {
            this.props.onChange = onChange;
        } 

        if (this.props.alwaysShowMask !== alwaysShowMask || this.props.showMask !== showMask) {
            this.showMask = alwaysShowMask || showMask;

            this.props.alwaysShowMask = alwaysShowMask;
            this.props.showMask = showMask;

            updated = true;
        }

        if (maskFormat && maskFormat !== this.props.maskFormat) {
            this.input.setMaskFormat(maskFormat);

            this.props.maskFormat = maskFormat;

            updated = true;
        }        

        if (mask !== this.props.mask) {
            this.input.setMask(mask);

            this.props.mask = mask;

            updated = true;
        }

        if (maskString !== this.props.maskString) {
            this.input.setMaskString(maskString);

            this.props.maskString = maskString;

            updated = true;
        }

        if (maskChar !== this.props.maskChar) {
            this.input.setMaskChar(maskChar);

            this.props.maskChar = maskChar;

            updated = true;
        }

        if (reformat !== this.props.reformat) {
            this.input.setReformat(reformat);

            this.props.reformat = reformat;

            updated = true;
        }

        if (value !== this.props.value) {        
            this.input.setValue(value);

            this.props.value = value;

            updated = true;
        }        

        if (updated) {
            this.showValue();
            this.setSelection();    
        }
    }

    showValue = () => {
        if (this.showMask && (this.canSetSelection || this.props.alwaysShowMask)) {            
            this.element.value = this.input.getMaskedValue();
            return;
        }
        this.element.value = this.input.getVisibleValue();        
    }

    setSelection = () => {
        if (!this.canSetSelection) {
            return;
        }
        const selection = this.input.getSelection();
        this.element.setSelectionRange(selection.start, selection.end);

        const raf = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            ((fn) => setTimeout(fn, 0));
        // For android
        raf(() => this.element.setSelectionRange(selection.start, selection.end));
    };

    getSelection() {
        this.input.setSelection({
            start: this.element.selectionStart, 
            end: this.element.selectionEnd,
        });
    }

    subscribe() {
        this.unsubscribe = {
            onPaste: subscribe(this.element, 'paste', this.onPaste),
            onKeyDown: subscribe(this.element, 'keydown', this.onKeyDown),
            onKeyPress: subscribe(this.element, this.keyPressPropName(), this.onKeyPress),
            onChange: subscribe(this.element, 'change', this.onChange),
            onFocus: subscribe(this.element, 'focus', this.onFocus),
            onBlur: subscribe(this.element, 'blur', this.onBlur),
        };
    }

    onPaste = (e) => {    
        e.preventDefault();
        this.getSelection();
        
        // getData value needed for IE also works in FF & Chrome
        this.input.paste(e.clipboardData.getData('Text'));
        
        this.showValue();
            
        // Timeout needed for IE
        setTimeout(this.setSelection, 0);

        this.props.onChange && this.props.onChange(e);        
    };

    onChange = (e) => {
        let currentValue;
        if (this.showMask && (this.canSetSelection || this.props.alwaysShowMask)) {
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
    }

    onKeyPress = (e) => {
        if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') { return; }

        e.preventDefault();
        this.getSelection();
        this.input.input(e.key || e.data || String.fromCharCode(e.which));
        this.showValue();
        this.setSelection();
        this.props.onChange && this.props.onChange(e);
    };

    onKeyDown = (e) => {
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

    onFocus = () => {
        this.canSetSelection = true;
    };

    onBlur = () => {
        this.canSetSelection = false;
    };

    keyPressPropName() {
        if (typeof navigator !== 'undefined' && navigator.userAgent.match(/Android/i)) {            
            return 'beforeinput';                        
        }
        return 'keypress'
    }

    destroy() {
        this.unsubscribe.onPaste();
        this.unsubscribe.onKeyDown();
        this.unsubscribe.onKeyPress();
        this.unsubscribe.onChange();
        this.unsubscribe.onFocus();
        this.unsubscribe.onBlur();
    }
}

export default MaskInput;
import defineMaskList from './functions/defineMaskList';
import inputValue from './functions/inputValue';
import removeSelectedRange from './functions/removeSelectedRange';
import charTypes from './constants/charTypesEnum';

class InputCore {
    constructor({value, mask, reformat, maskFormat, maskChar, maskString}) {
        if (maskString && maskString.length !== mask.length) {
            throw new Error('maskString must have same length as mask');
        }        
        if (maskChar.length > 1) {
            throw new Error('maskChar must have only 1 char');
        }
        this._maskString = maskString;
        this._maskChar = maskChar;
        this._reformat = reformat;
        this.selection = {start: 0, end: 0};

        this.setMaskFormat(maskFormat);
        this._mask = defineMaskList(mask, this._maskFormat);        

        this.setValue(value);
    }

    /**
     * Заполняет _maskFormat, который является объектом byId объектов
     * @param {Array} maskFormat     
     */
    setMaskFormat(maskFormat) {
        this._maskFormat = maskFormat.reduce((store, item) => {
            store[item.str] = item;
            return store;
        }, {});
    }
    
    input(input) {
        let _value = this._value;

        let result;

        if (this._reformat) {
            result = this._reformat({
                data: _value,
                input,
                selection: this.selection,
            });
        } else {
            
            _value = removeSelectedRange({
                value: _value, 
                selection: this.selection,                 
                mask: this._mask, 
                maskChar: this._maskChar, 
                maskString: this._maskString,
            })
            this.selection.end = this.selection.start;

            result = inputValue({
                data: _value,
                input,
                selection: this.selection, 
                mask: this._mask,
                maskChar: this._maskChar,
                maskString: this._maskString,
            }); 
        }        

        this._value = result.value;
        this._maskedValue = result.maskedValue;
        this._visibleValue = result.visibleValue;
        this.setSelection(result.selection);
    }

    setSelection({start, end}) {
        this.selection = {
            start,
            end,
        };
    }

    getSelection() {
        return {
            start: this.selection.start,
            end: this.selection.end,
        };
    }    

    backspace() {
        this.removePreviosOrSelected();
    }

    paste(value) {        
        this.input(value);
    }

    /**
     * Определяет циклический список, в котором учтены циклы маски, по которой будет проходить итерации.
     * @param {String} mask
     * @returns {{head: {}, hasCycle: boolean}}
     */
    setMask(mask) {               

        this._mask =  defineMaskList(mask, this._maskFormat);
        
        this.setValue(this._value);
    }

    getState() {
        return {
            value: this.getValue(),
            maskedValue: this.getMaskedValue(),
            visibleValue: this.getVisibleValue(),
            selection: this.getSelection(),
        };
    }

    getValue() {
        return this._value;
    }

    setReformat(reformat) {
        this._reformat = reformat;
        this.setValue(this._value);
    }

    getMaskedValue() {
        return this._maskedValue
    }

    getVisibleValue() {
        return this._visibleValue;
    }

    setMaskChar(maskChar) {        
        if (maskChar.length > 1) {
            throw new Error('maskChar must have only 1 char');
        }

        this._maskChar = maskChar;

        this.setValue(this._value);
    }

    setMaskString(maskString) {
        if (maskString && maskString.length !== this._mask.length) {
            throw new Error('maskString must have same length as mask');
        }        

        this._maskString = maskString;

        this.setValue(this._value);
    }    

    removePreviosOrSelected() {
        if (this.selection.start === this.selection.end) {
            this.selection.start = this.selection.end - 1;
            if (this.selection.start < 0) {
                this.selection.start = 0;
            }
        }

        this.input('');
    }

    removeNextOrSelected() {
        if (this.selection.start === this.selection.end) {
            this.selection.end++;            
        }

        this.input('');
    }

    setValue(data) {        
        let result;

        if (this._reformat) {
            result = this._reformat({
                data: data,
                selection: this.selection,                
            });
        } else {
            let dataList = data;
            if (!Array.isArray(dataList)) {
                dataList = [];
                for (let i = 0; i < data.length; i++) {
                    dataList.push({
                        char: data[i],
                        type: charTypes.USER,
                    });
                }
            }
            result = inputValue({
                data: dataList,        
                selection: this.selection,
                mask: this._mask,
                maskChar: this._maskChar,
                maskString: this._maskString,            
            });
        }                    
    
        this._value = result.value;
        this._maskedValue = result.maskedValue;
        this._visibleValue = result.visibleValue;
        this.setSelection(result.selection);
    }
}

export const defaults = {
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
};

export const createInput = ({
    value, 
    maskString, 
    mask,
    reformat,
    maskFormat = defaults.maskFormat, 
    maskChar = defaults.maskChar,     
}) => {    
    let _reformat = reformat;
    let _mask = mask;
    if (!_reformat && !_mask) {
        _reformat = (value) => value;
    } else if (_reformat) {
        _mask = null;
    }

    return new InputCore({value, mask: _mask, reformat: _reformat, maskFormat, maskChar, maskString});
};

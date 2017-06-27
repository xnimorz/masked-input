import React, { Component } from 'react';
import MaskInput from 'react-maskinput';

function removeSelectedRange(value, selection) {        
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

class NumberInput extends Component {
    reformat = ({data, input = '', selection}) => {
        const newSelection = {
            start: selection.start,
            end: selection.end,
        };

        let value = removeSelectedRange(data.replace(/(\D)/g, (text) => text === ' ' ? ' ' : ''), newSelection);
        const inputValue = input.replace(/\D/g, '');
        const oldLength = value.length;

        value = value.slice(0, newSelection.start) + inputValue + value.slice(newSelection.start, value.length);                
        value = value.replace(/\s/g, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, (text) => `${text} `);

        let index = newSelection.start;
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
    }    

    handleLeadingZeros = (e) => {
        const { onBlur } = this.props;         
        
        this.maskInput.applyValue(e.target.value.replace(/^[0 ]+$/, '0'));

        this.props.onBlur && this.props.onBlur(e);
    }

    getMaskInputRef = (el) => {
        this.maskInput = el;
    }

    render() {        
        return (
            <MaskInput {...this.props} reformat={this.reformat} onBlur={this.handleLeadingZeros} ref={this.getMaskInputRef} />
        );
    }
}

export default NumberInput;

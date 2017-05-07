import charTypes from '../constants/charTypesEnum';

export default function removeSelectedRange({value, selection, reformat, mask, maskChar, maskString}) {    
    const copyMaskChar = (count) => {
        let res = [];
        for (let i = 0; i < count; i++) {
            res.push({
                char: maskChar,
                type: charTypes.MASK, 
            });
        }
        return res;
    }

    const pasteMaskSymbols = () => {
        if (reformat) {
            return '';
        }
        
        if (maskString) {
            return maskString.slice(selection.start, selection.end);
        }

        return copyMaskChar(selection.end - selection.start);
    }

    if (selection.end < selection.start) {
        const tmp = selection.end;
        selection.end = selection.start;
        selection.start = tmp;
    }

    if (selection.start === selection.end) {
        return value;
    }
    
    if (value.length > selection.start) {
        return value.slice(0, selection.start).concat(pasteMaskSymbols(), value.slice(selection.end, value.length));
    }
    
    return value;
}
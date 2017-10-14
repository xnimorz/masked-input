import charTypes from '../constants/charTypesEnum';

export default function removeSelectedRange({value, selection, reformat, mask, maskChar, maskString}) {    
    const copyMaskChar = (count) => {
        const res = [];
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
            const res = [];
            for (let i = selection.start; i < selection.end; i++) {
                res.push({
                    char: maskString[i],
                    type: charTypes.MASK,
                })
            }
            return res;            
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
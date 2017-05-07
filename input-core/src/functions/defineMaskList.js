/**
 *
 * @param {String} mask
 * @param format
 * @returns {Array}
 */
export default function defineMaskList(mask, format) {    
    if (!mask) {
        return [];
    }
    
    let stack = [];        
    let escape = false;

    for (let i = 0; i < mask.length; i++) {        
        let item = format[mask[i]];
        if (escape && item) {
            item = null;
            escape = false;
        }
        if (!item) {
            if (!escape && mask[i] === '\\') {
                escape = true;
                continue;
            }
            escape = false;
            stack.push({
                char: mask[i],
                next: null,
            });
        } else if (item.regexp) {
            stack.push(item);
        }        
    }    

    return stack;
}
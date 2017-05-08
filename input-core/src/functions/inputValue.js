import charTypes from '../constants/charTypesEnum.js';

export default function inputValue({data, input = '', selection, mask, maskChar, maskString}) {
    let value = [];
    let maskedValue = '';

    let maskIndex = 0;
    let valueIndex = 0;
    let pastedIndex = 0;

    let inputValuesApplied = 0;

    while (mask[maskIndex]) {
        let item = data.length > valueIndex ? data[valueIndex] : null;
        let maskPart = mask[maskIndex];

        let pastedValuesStack = null;
        if (selection.start <= maskIndex && pastedIndex < input.length) {
            pastedValuesStack = input.slice(pastedIndex);            
        }

        // Обработка захардкоженных в маску символов. 
        if (maskPart.char) {
            // Если есть вводимые пользователем значение, в первую очередь проверяем его.
            // Но не проверяем по всему стеку.
            if (pastedValuesStack && pastedValuesStack[0] === maskPart.char) {
                pastedIndex++;
            } else {
                if (item && (item.char === maskPart.char || item.type !== charTypes.USER) || input) {
                    valueIndex++;
                }
            }
            
            value.push({
                char: maskPart.char,
                type: charTypes.CHAR,
            });            

            if (pastedValuesStack) {
                inputValuesApplied++;
            }

            maskedValue += maskPart.char;
        }

        // Кастомный текст
        if (maskPart.regexp) {
            let part = null; 

            // Если есть вводимое пользователем значение, то проверям его. 
            // Причем пробегаемся по стеку вводимых значений, пока не найдем нужное
            if (pastedValuesStack) {
                let i = 0;
                while (!maskPart.regexp.test(pastedValuesStack[i]) && pastedValuesStack.length > i) {
                    i++;
                    pastedIndex++;
                }
                if (pastedValuesStack.length > i) {
                    pastedIndex++;
                    inputValuesApplied++;

                    // Игнорируем предыдущее значение в инпуте
                    valueIndex++;

                    part = pastedValuesStack[i];
                    value.push({
                        char: part,
                        type: charTypes.USER,
                    });
                    maskedValue += part;
                }
            } 

            // В пользовательском вводе нет или невалидные данные. Пытаемся аплаить те данные, что были раньше или заменяем на плейсхолдер
            if (!part) {
                // Если произошел сдвиг, пропускаем лишнее значение
                if (item && item.type === charTypes.CHAR && data.length > valueIndex + 1) {
                    valueIndex++;
                    continue;
                }
                if (item && item.type === charTypes.USER && maskPart.regexp.test(item.char)) {                    
                    value.push({
                        char: item.char,
                        type: charTypes.USER,
                    });
                    maskedValue += item.char;
                    valueIndex++;
                } else {                    
                    part = maskString ? maskString[maskIndex] : maskChar;

                    value.push({
                        char: part,
                        type: charTypes.MASK,
                    });

                    if (data.length > maskIndex) {                        
                        valueIndex++;
                    }                    

                    maskedValue += part;
                }
            }

        }

        maskIndex++;
    }

    const selectionPosition = selection.start + inputValuesApplied;

    // Удаляем все ведующие maskChar
    let bound = value.length - 1;
    let charsCount = 0;
    while (bound >= 0 && value[bound].type !== charTypes.USER) {
        if (value[bound].type === charTypes.MASK) {            
            charsCount = 0;
        }
        if (value[bound].type === charTypes.CHAR) {
            charsCount++;
        }
        bound--;
    }    
    bound += charsCount;

    let visibleValue = '';
    for (let i = 0; i <= bound; i++) {
        visibleValue += value[i].char;
    }

    return {
        value,
        visibleValue,
        maskedValue,
        selection: {
            start: selectionPosition,
            end: selectionPosition,
        },
    };
}

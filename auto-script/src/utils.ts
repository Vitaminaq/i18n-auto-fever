import prettier from 'prettier';

export const flattenObject = (obj: Record<string, any>) => {
    const format = {};
    const flat = (target, key = '') => {
        Object.keys(target).forEach(k => {
            key = `${key}${key && '.'}${k}`;
            if (typeof target[k] !== 'object' || !target[k]) {
                format[key] = target[k];
                key = '';
                return;
            }
            flat(target[k], key);
        });
    }
    flat(obj);
    return format;
}

export const flattenToObject = (obj: Record<string, any>) => {
    const format = {};

    let current = format;

    Object.keys(obj).forEach(k => {
        const keys = k.split('.');
        const len = keys.length;
        if (len < 2) {
            current[k] = obj[k];
            return;
        }

        let i = 0;
        while(i < len) {
            current = current[keys[i]] = i === len - 1 ? obj[k] : {};
            i++;
        }
    });

    return format;
}

export const formatCode = (code: string, parser: 'json' | 'typescript' = 'typescript') => {
    return prettier.format(code, { semi: true, tabWidth: 4, parser });
}
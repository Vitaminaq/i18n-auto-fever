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
import JSON5 from 'json5';

export default {
    parse(value) {
        if (typeof value === 'string') {
            return JSON5.parse(value);
        } else if (typeof value === 'object' && Array.isArray(value)) {
            return value;
        }

        return null;
    },
    stringify: JSON.stringify
};

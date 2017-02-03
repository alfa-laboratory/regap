export default {
    parse(value) {
        if (typeof value === 'function') {
            return value;
        }

        // eslint-disable-next-line
        return new Function('', value);
    },

    stringify(value) {
        value.toString();
    }
};

export default {
    parse(value, name) {
        if (typeof value === 'boolean') {
            return value;
        }

        return (value === 'true' || value === '' || value === name);
    },

    stringify: JSON.stringify
};

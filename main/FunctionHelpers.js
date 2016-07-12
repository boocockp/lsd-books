module.exports = {
    sum: function sum(acc, val) {
        return (acc === undefined ? 0 : acc) + val;
    },

    prop: function prop(propertyName) {
        return it => it[propertyName];
    }
};
/**
 * Accepts an input value and formats it based on the tracker's `numberFormat` property
 * @param value
 * @param numberFormat
 * @returns {*|string}
 */
function formatValue(value, numberFormat) {
    switch (numberFormat) {
        case 'number':
            return new Intl.NumberFormat().format(value);
        case 'usd':
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: Math.floor(value) === value ? 0 : 2,
            }).format(value);
        case 'percentage':
            return new Intl.NumberFormat('en-US', {
                style: 'percent',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }).format(value / 100);
        default:
            return value;
    }
}

export {
    formatValue
}

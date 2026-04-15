const BARCELONA_2025_PRICES = {
    electricity: 0.25, // price per kWh
    gas: 0.50, // price per m3
    water: 3.00 // price per m3
};

const MONTHLY_CONSUMPTION_FACTORS = {
    electricity: 350, // average kWh per month
    gas: 150, // average m3 per month
    water: 30 // average m3 per month
};

module.exports = { BARCELONA_2025_PRICES, MONTHLY_CONSUMPTION_FACTORS };
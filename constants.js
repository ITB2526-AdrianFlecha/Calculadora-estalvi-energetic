const BARCELONA_2025_PRICING = {
    energy: {
        unitCost: 0.20, // Example cost per kWh
        averageMonthlyConsumption: 300 // Example average consumption
    },
    water: {
        unitCost: 1.50, // Example cost per cubic meter
        averageMonthlyConsumption: 10 // Example average consumption
    },
    consumables: {
        averageMonthlyCost: 150 // Example cost for consumables
    },
    cleaning: {
        averageMonthlyCost: 100 // Example cost for cleaning
    }
};

const SPECIAL_PERIODS = {
    summer: {
        vacationReductionFactor: 0.5 // Example reduction factor
    },
    easter: {
        vacationReductionFactor: 0.75 // Example reduction factor
    },
    christmas: {
        vacationReductionFactor: 0.25 // Example reduction factor
    }
};

const SCHOOL_YEAR_DATES = {
    start: '2025-09-01',
    end: '2026-06-30'
};

const INFLATION_RATE = 0.03; // 3%

const AVERAGE_MONTHLY_COSTS = {
    total: 600 // Example total monthly costs
};

export {
    BARCELONA_2025_PRICING,
    SPECIAL_PERIODS,
    SCHOOL_YEAR_DATES,
    INFLATION_RATE,
    AVERAGE_MONTHLY_COSTS
};

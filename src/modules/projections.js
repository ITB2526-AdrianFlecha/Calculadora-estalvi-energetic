import { INFLATION_RATE, MONTHLY_FACTORS } from '../utils/constants.js';

export function projectConsumption(currentValue, type, years = 1) {
    let projectedValue = currentValue;

    for (let i = 0; i < years; i++) {
        projectedValue *= (1 + INFLATION_RATE);
    }

    return projectedValue;
}

export function projectWithGrowthFactor(currentValue, growthFactor = 0, years = 1) {
    let projectedValue = currentValue;

    for (let i = 0; i < years; i++) {
        // Aplicar factor de crecimiento + inflación
        const adjustedRate = (growthFactor / 100) + INFLATION_RATE;
        projectedValue *= (1 + adjustedRate);
    }

    return projectedValue;
}

export function getMonthlyProjection(monthlyAverage, type, months = 12) {
    let totalProjection = 0;

    for (let month = 1; month <= months; month++) {
        const monthFactor = MONTHLY_FACTORS[month - 1] || 1.0;
        const monthValue = monthlyAverage * monthFactor;

        // Aplicar inflación acumulativa
        const inflationFactor = Math.pow(1 + INFLATION_RATE, (month - 1) / 12);
        totalProjection += monthValue * inflationFactor;
    }

    return totalProjection;
}

export function getSeasonalProjection(data, type, year) {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const seasonalData = {};

    months.forEach(month => {
        const factor = MONTHLY_FACTORS[month - 1];
        seasonalData[month] = {
            factor: factor,
            label: getMonthName(month)
        };
    });

    return seasonalData;
}

function getMonthName(month) {
    const names = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                   'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
    return names[month - 1] || 'Desconegut';
}

export function getSpecialPeriodsProjection(monthlyAverage) {
    const periods = {
        easter: {
            name: 'Setmana Santa (13-20 Abril)',
            factor: 0.7,
            days: 8
        },
        summer: {
            name: 'Estiu (1 Juliol - 31 Agost)',
            factor: 0.075, // Promig de 0.1 i 0.05
            days: 62
        },
        christmas: {
            name: 'Nadal (20 Desembre - 6 Gener)',
            factor: 0.7,
            days: 18
        }
    };

    const projections = {};
    Object.keys(periods).forEach(period => {
        const p = periods[period];
        const dailyAverage = monthlyAverage / 30; // Aproximar a diario
        projections[period] = {
            ...p,
            projection: (dailyAverage * p.days) * p.factor
        };
    });

    return projections;
}
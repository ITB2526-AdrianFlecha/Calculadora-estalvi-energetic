// Factor de inflación fijo del 3%
export const INFLATION_RATE = 0.03;

// Factores de consumo mensuales (aproximación)
// Basados en patrones estacionales típicos
export const MONTHLY_FACTORS = [
    1.0,  // Enero
    0.95, // Febrero
    0.9,  // Marzo
    0.8,  // Abril
    0.8,  // Mayo
    0.9,  // Junio
    0.1,  // Julio (verano, bajo consumo)
    0.05, // Agosto (verano, consumo mínimo)
    0.9,  // Septiembre
    1.0,  // Octubre
    1.0,  // Noviembre
    0.7   // Diciembre (vacaciones)
];

// Tarifas y constantes para Barcelona
export const BARCELONA_RATES = {
    // Energía: Precio medio por kWh en Barcelona (€/kWh)
    energia: {
        precio_kwh: 0.25,
        factor_co2_kg: 0.294 // kg CO2 por kWh
    },

    // Agua: Precio medio por m³ en Barcelona (€/m³)
    agua: {
        precio_m3: 2.50,
        consumo_persona_dia_litros: 150
    },

    // Consumibles: Promedio mensual (€)
    consumibles: {
        promedio_mensual: 250,
        factores_mes: [1.0, 0.9, 0.85, 0.95, 1.0, 1.2, 0.5, 0.3, 1.1, 1.0, 1.0, 1.3]
    },

    // Limpieza y mantenimiento: Promedio mensual (€)
    limpieza: {
        promedio_mensual: 600,
        factores_mes: [1.0, 0.95, 0.9, 0.85, 0.9, 1.0, 0.8, 0.75, 1.1, 1.0, 0.95, 1.1]
    }
};

// Períodos especiales
export const SPECIAL_PERIODS = {
    easter: {
        name: 'Setmana Santa',
        startMonth: 3,
        startDay: 13, // Aproximado (Domingo de Ramos)
        endMonth: 4,
        endDay: 20, // Aproximado (Lunes de Pascua)
        consumptionFactor: 0.7
    },
    summer: {
        name: 'Estiu',
        startMonth: 7,
        startDay: 1,
        endMonth: 8,
        endDay: 31,
        consumptionFactor: 0.075 // Promedio
    },
    christmas: {
        name: 'Nadal',
        startMonth: 12,
        startDay: 20,
        endMonth: 1,
        endDay: 6,
        consumptionFactor: 0.7
    }
};

// Período escolar
export const SCHOOL_YEAR = {
    startMonth: 9,  // Septiembre
    startDay: 1,
    endMonth: 6,    // Junio
    endDay: 30
};
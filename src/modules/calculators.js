import { INFLATION_RATE, MONTHLY_FACTORS } from '../utils/constants.js';
import { isSchoolYear } from '../utils/dateUtils.js';
import { getAllData } from './dataManager.js';

export function calculateAllMetrics(allData) {
    return {
        energia: calculateEnergyMetrics(allData),
        agua: calculateWaterMetrics(allData),
        consumibles: calculateConsumablesMetrics(allData),
        limpieza: calculateCleaningMetrics(allData)
    };
}

export function calculateEnergyMetrics(allData) {
    const energyData = allData.filter(d => d.tipo === 'energia' || d.source === 'original-energia');

    let total = 0;
    let schoolYearTotal = 0;
    let dayCount = 0;
    let schoolDayCount = 0;

    energyData.forEach(item => {
        const value = item.consumo_total_kWh || item.valor || 0;
        total += value;
        dayCount++;

        if (isSchoolYear(new Date(item.fecha))) {
            schoolYearTotal += value;
            schoolDayCount++;
        }
    });

    const promedio = dayCount > 0 ? total / dayCount : 0;

    return {
        total,
        totalEscolar: schoolYearTotal,
        promedio,
        dataPoints: dayCount
    };
}

export function calculateWaterMetrics(allData) {
    const waterData = allData.filter(d => d.tipo === 'agua' || d.source === 'original-agua');

    let total = 0;
    let schoolYearTotal = 0;
    let dayCount = 0;
    let schoolDayCount = 0;

    waterData.forEach(item => {
        let value = 0;
        if (item.consumo_litros) {
            value = item.consumo_litros / 1000; // Convertir a m³
        } else {
            value = item.valor || 0;
        }

        total += value;
        dayCount++;

        if (isSchoolYear(new Date(item.fecha))) {
            schoolYearTotal += value;
            schoolDayCount++;
        }
    });

    const promedio = dayCount > 0 ? total / dayCount : 0;

    return {
        total,
        totalEscolar: schoolYearTotal,
        promedio,
        dataPoints: dayCount
    };
}

export function calculateConsumablesMetrics(allData) {
    const consumablesData = allData.filter(d => d.tipo === 'consumibles' || d.source === 'original-consumibles');

    let total = 0;
    let schoolYearTotal = 0;
    let monthCount = 0;
    let schoolMonthCount = 0;

    const byMonth = {};
    const schoolByMonth = {};

    consumablesData.forEach(item => {
        const value = item.coste_total_euros || item.valor || 0;
        const fecha = item.fecha || item.descripcion || new Date().toISOString().split('T')[0];
        const month = fecha.substring(0, 7); // YYYY-MM

        if (!byMonth[month]) byMonth[month] = 0;
        byMonth[month] += value;

        if (isSchoolYear(new Date(fecha))) {
            if (!schoolByMonth[month]) schoolByMonth[month] = 0;
            schoolByMonth[month] += value;
        }
    });

    Object.values(byMonth).forEach(v => {
        total += v;
        monthCount++;
    });

    Object.values(schoolByMonth).forEach(v => {
        schoolYearTotal += v;
        schoolMonthCount++;
    });

    const promedio = monthCount > 0 ? total / monthCount : 0;

    return {
        total,
        totalEscolar: schoolYearTotal,
        promedio,
        dataPoints: monthCount
    };
}

export function calculateCleaningMetrics(allData) {
    const cleaningData = allData.filter(d => d.tipo === 'limpieza' || d.source === 'original-limpieza');

    let total = 0;
    let schoolYearTotal = 0;
    let monthCount = 0;
    let schoolMonthCount = 0;

    const byMonth = {};
    const schoolByMonth = {};

    cleaningData.forEach(item => {
        const value = item.coste_total_euros || item.valor || 0;
        const fecha = item.fecha || item.descripcion || new Date().toISOString().split('T')[0];
        const month = fecha.substring(0, 7);

        if (!byMonth[month]) byMonth[month] = 0;
        byMonth[month] += value;

        if (isSchoolYear(new Date(fecha))) {
            if (!schoolByMonth[month]) schoolByMonth[month] = 0;
            schoolByMonth[month] += value;
        }
    });

    Object.values(byMonth).forEach(v => {
        total += v;
        monthCount++;
    });

    Object.values(schoolByMonth).forEach(v => {
        schoolYearTotal += v;
        schoolMonthCount++;
    });

    const promedio = monthCount > 0 ? total / monthCount : 0;

    return {
        total,
        totalEscolar: schoolYearTotal,
        promedio,
        dataPoints: monthCount
    };
}

export function getProjections(metrics) {
    return {
        energia: getEnergyProjections(metrics.energia),
        agua: getWaterProjections(metrics.agua),
        consumibles: getConsumablesProjections(metrics.consumibles),
        limpieza: getCleaningProjections(metrics.limpieza)
    };
}

function getEnergyProjections(metrics) {
    const dailyAvg = metrics.promedio;
    const yearProjection = dailyAvg * 365;
    const year2Projection = yearProjection * (1 + INFLATION_RATE);
    const year3Projection = year2Projection * (1 + INFLATION_RATE);

    return { yearProjection, year2Projection, year3Projection };
}

function getWaterProjections(metrics) {
    const dailyAvg = metrics.promedio;
    const yearProjection = dailyAvg * 365;
    const year2Projection = yearProjection * (1 + INFLATION_RATE);
    const year3Projection = year2Projection * (1 + INFLATION_RATE);

    return { yearProjection, year2Projection, year3Projection };
}

function getConsumablesProjections(metrics) {
    const monthlyAvg = metrics.promedio;
    const yearProjection = monthlyAvg * 12;
    const year2Projection = yearProjection * (1 + INFLATION_RATE);
    const year3Projection = year2Projection * (1 + INFLATION_RATE);

    return { yearProjection, year2Projection, year3Projection };
}

function getCleaningProjections(metrics) {
    const monthlyAvg = metrics.promedio;
    const yearProjection = monthlyAvg * 12;
    const year2Projection = yearProjection * (1 + INFLATION_RATE);
    const year3Projection = year2Projection * (1 + INFLATION_RATE);

    return { yearProjection, year2Projection, year3Projection };
}

export function calculateSpecialPeriodsMetrics(allData) {
    const energyData = allData.filter(d => d.tipo === 'energia' || d.source === 'original-energia');
    const waterData = allData.filter(d => d.tipo === 'agua' || d.source === 'original-agua');

    let easterEnergy = 0, easterWater = 0;
    let summerEnergy = 0, summerWater = 0;
    let christmasEnergy = 0, christmasWater = 0;

    energyData.forEach(item => {
        const date = new Date(item.fecha);
        const month = date.getMonth();
        const day = date.getDate();
        const value = item.consumo_total_kWh || item.valor || 0;

        // Setmana Santa (March-April aproximado)
        if (month === 2 || month === 3) {
            easterEnergy += value * 0.7; // Factor de 0.7
        }
        // Estiu (July-August)
        else if (month === 6) {
            summerEnergy += value * 0.1;
        } else if (month === 7) {
            summerEnergy += value * 0.05;
        }
        // Nadal (Dec 20 - Jan 6)
        else if (month === 11 && day >= 20) {
            christmasEnergy += value * 0.7;
        } else if (month === 0 && day <= 6) {
            christmasEnergy += value * 0.7;
        }
    });

    waterData.forEach(item => {
        const date = new Date(item.fecha);
        const month = date.getMonth();
        const day = date.getDate();
        const value = (item.consumo_litros || item.valor || 0) / 1000;

        if (month === 2 || month === 3) {
            easterWater += value * 0.7;
        } else if (month === 6) {
            summerWater += value * 0.1;
        } else if (month === 7) {
            summerWater += value * 0.05;
        } else if (month === 11 && day >= 20) {
            christmasWater += value * 0.7;
        } else if (month === 0 && day <= 6) {
            christmasWater += value * 0.7;
        }
    });

    return {
        easterEnergy, easterWater,
        summerEnergy, summerWater,
        christmasEnergy, christmasWater
    };
}

export function getMonthlyAverage(allData, type) {
    const data = allData.filter(d => d.tipo === type || d.source === `original-${type}`);
    let total = 0;

    data.forEach(item => {
        if (type === 'energia') {
            total += item.consumo_total_kWh || item.valor || 0;
        } else if (type === 'agua') {
            total += (item.consumo_litros || item.valor || 0) / 1000;
        }
    });

    return data.length > 0 ? total / data.length : 0;
}

export function getSavingSuggestions(allData) {
    const suggestions = [];
    const metrics = calculateAllMetrics(allData);

    // Sugerencia energía
    if (metrics.energia.promedio > 150) {
        suggestions.push({
            icon: '⚡',
            title: 'Optimizar consum energètic',
            description: 'El teu consum mitjà és superior a 150 kWh/dia. Considera instal·lar panells solars addicionals o optimitzar els horaris d\'ús.',
            saving: 'Estalvi potencial: 15-20%'
        });
    }

    // Sugerencia agua
    if (metrics.agua.promedio > 2) {
        suggestions.push({
            icon: '💧',
            title: 'Reduir consum d\'aigua',
            description: 'El teu consum d\'aigua és superior a 2 m³/dia. Instal·la sistemes de xarxa o revisa les fugues potencials.',
            saving: 'Estalvi potencial: 10-15%'
        });
    }

    // Sugerencia consumibles
    if (metrics.consumibles.promedio > 300) {
        suggestions.push({
            icon: '📄',
            title: 'Reduir consumibles d\'oficina',
            description: 'El cost mensual de consumibles supera 300€. Considera la digitalització de documentos i l\'estandardització de compres.',
            saving: 'Estalvi potencial: 20-25%'
        });
    }

    // Sugerencia limpieza
    if (metrics.limpieza.promedio > 500) {
        suggestions.push({
            icon: '🧹',
            title: 'Optimizar despeses de neteja',
            description: 'El cost mensual de neteja supera 500€. Revisa els contractes i considera mètodes més eficients.',
            saving: 'Estalvi potencial: 15-20%'
        });
    }

    // Sugerencia teletrabajo
    suggestions.push({
        icon: '👨‍💼',
        title: 'Implementar més teletrabajo',
        description: 'Augmentant els dies de teletrabajo podríes reduir el consum de recursos d\'oficina entre un 10-30%.',
        saving: 'Estalvi potencial: €500-1000/mes'
    });

    // Sugerencia sostenibilidad
    suggestions.push({
        icon: '🌱',
        title: 'Programa de sostenibilitat',
        description: 'Implementa recycles de residus, reducció de plàstics i compra de productes eco-friendly.',
        saving: 'Estalvi potencial: 5-10%'
    });

    return suggestions.slice(0, 5); // Retornar máximo 5 sugerencias
}

export function getMonthlyComparison() {
    const allData = getAllData();
    const data = allData;
    const monthly = {};

    data.forEach(item => {
        const month = new Date(item.fecha).toISOString().split('T')[0].substring(0, 7);
        if (!monthly[month]) {
            monthly[month] = {
                energia: 0,
                agua: 0,
                consumibles: 0,
                limpieza: 0
            };
        }

        if (item.tipo === 'energia' || item.source === 'original-energia') {
            monthly[month].energia += item.consumo_total_kWh || item.valor || 0;
        } else if (item.tipo === 'agua' || item.source === 'original-agua') {
            monthly[month].agua += (item.consumo_litros || item.valor || 0) / 1000;
        } else if (item.tipo === 'consumibles' || item.source === 'original-consumibles') {
            monthly[month].consumibles += item.coste_total_euros || item.valor || 0;
        } else if (item.tipo === 'limpieza' || item.source === 'original-limpieza') {
            monthly[month].limpieza += item.coste_total_euros || item.valor || 0;
        }
    });

    return monthly;
}

export function getSchoolYearData() {
    return getAllData().filter(d => isSchoolYear(new Date(d.fecha)));
}

export function getFullYearData() {
    return getAllData();
}
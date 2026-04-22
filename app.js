// ===== CONSTANTES Y CONFIGURACIÓN =====
const INFLATION_RATE = 0.03;
const CLOUD_DAILY_CONSUMPTION = 150; // kWh diarios de consumo de nube
const CLOUD_WATER_DAILY_CONSUMPTION = 800; // Litros diarios para refrigeración de nube
const ELECTRICITY_PRICE = 0.25; // €/kWh en Barcelona
const WATER_PRICE = 2.50; // €/m³ en Barcelona
const CO2_FACTOR = 0.294; // kg CO2/kWh
const CONSUMABLES_MONTHLY_AVG = 180; // € promedio mensual (excluyendo vacaciones)
const CLEANING_MONTHLY_AVG = 1200; // € promedio mensual (sueldo + material)
const SCHOOL_YEAR_START = { month: 9, day: 1 };
const SCHOOL_YEAR_END = { month: 6, day: 30 };

// Meses de vacaciones para consumibles (no hay gasto)
const VACATION_MONTHS = [6, 7]; // Juliol, Agost (verano principal)
const EASTER_MONTH = 3; // Abril (Setmana Santa aprox)
const CHRISTMAS_MONTH = 11; // Desembre (Nadal)

// Factores mensuales de consumo (variabilidad según estació)
const MONTHLY_CONSUMPTION_FACTORS = {
    enero: 1.15,
    febrero: 1.10,
    marzo: 0.95,
    abril: 0.80,
    mayo: 0.75,
    junio: 0.70,
    julio: 0.60,
    agosto: 0.65,
    septiembre: 0.85,
    octubre: 0.95,
    noviembre: 1.05,
    diciembre: 1.15
};

// Factores solars per mes
const MONTHLY_SOLAR_FACTORS = {
    enero: 0.35,
    febrero: 0.45,
    marzo: 0.60,
    abril: 0.75,
    mayo: 0.85,
    junio: 0.90,
    julio: 0.88,
    agosto: 0.80,
    septiembre: 0.70,
    octubre: 0.50,
    noviembre: 0.35,
    diciembre: 0.30
};

// Colores para gráfics
const COLORS = {
    energia: '#3498db',
    agua: '#2ecc71',
    consumibles: '#f39c12',
    limpieza: '#e74c3c',
    co2: '#27ae60',
    solar: '#f1c40f',
    red: '#e67e22',
    energiaOscuro: '#2c3e50',
    energiaClaro: '#85c1e9',
    aguaOscuro: '#229954',
    aguaClaro: '#58d68d'
};

// Estratègies de reducció
const REDUCTION_STRATEGIES = {
    energia: {
        name: 'Energía Elèctrica',
        icon: '⚡',
        unit: '€',
        reduction: 0.30,
        actions: [
            {
                id: 'energia_1',
                title: 'Instal·lació de LED eficients',
                description: 'Canviar tota la il·luminació a LED redueix 40% del consum d\'il·luminació',
                impact: 0.08,
                timeline: 'Mes 1-3',
                cost: 'Alt',
                measurable: 'kWh reduïts per mes',
                enabled: false
            },
            {
                id: 'energia_2',
                title: 'Ús de bateries en hores punta',
                description: 'Emmagatzemament d\'energia per usar en hores punta redueix consum de xarxa',
                impact: 0.10,
                timeline: 'Mes 4-6',
                cost: 'Alt',
                measurable: 'kWh estalviats en hores punta',
                enabled: false
            },
            {
                id: 'energia_3',
                title: 'Optimització d\'equips HVAC',
                description: 'Manteniment preventiu i programació intel·ligent',
                impact: 0.10,
                timeline: 'Mes 7-12',
                cost: 'Mitjà',
                measurable: 'Temperatura controlada automàticament',
                enabled: false
            },
            {
                id: 'energia_4',
                title: 'Auditoria energètica i formació',
                description: 'Identificar consumos anòmals i conscienciar al personal',
                impact: 0.05,
                timeline: 'Mes 1',
                cost: 'Baix',
                measurable: 'Comportaments de consum millorats',
                enabled: false
            }
        ]
    },
    agua: {
        name: 'Aigua',
        icon: '💧',
        unit: '€',
        reduction: 0.30,
        actions: [
            {
                id: 'agua_1',
                title: 'Instal·lació de grifos de baix flux',
                description: 'Grifos i dutxes amb aireadors que redueixen 30-50% del consum',
                impact: 0.12,
                timeline: 'Mes 1-3',
                cost: 'Baix',
                measurable: 'Litres/dia reduïts',
                enabled: false
            },
            {
                id: 'agua_2',
                title: 'Reparació de fuites',
                description: 'Una fuga petita pot perder 200L/dia. Revisió trimestral',
                impact: 0.08,
                timeline: 'Mes 1',
                cost: 'Baix',
                measurable: 'Fuites reparades',
                enabled: false
            },
            {
                id: 'agua_3',
                title: 'Sistema de reg intel·ligent',
                description: 'Sensor d\'humitat i reg automàtic segons necessitat',
                impact: 0.07,
                timeline: 'Mes 4-6',
                cost: 'Mitjà',
                measurable: 'Aigua de reg optimitzada',
                enabled: false
            },
            {
                id: 'agua_4',
                title: 'Reutilització d\'aigües grises',
                description: 'Sistemes per reutilitzar aigua de pluja i aires acondicionats',
                impact: 0.03,
                timeline: 'Mes 13-24',
                cost: 'Alt',
                measurable: 'Litres reutilitzats/mes',
                enabled: false
            }
        ]
    },
    consumibles: {
        name: 'Consumibles d\'Oficina',
        icon: '📄',
        unit: '€',
        reduction: 0.30,
        actions: [
            {
                id: 'consumibles_1',
                title: 'Digitalització de processos',
                description: 'Transitar a documents digitals redueix paper en 80%',
                impact: 0.15,
                timeline: 'Mes 1-6',
                cost: 'Mitjà',
                measurable: 'Fulls de paper/mes',
                enabled: false
            },
            {
                id: 'consumibles_2',
                title: 'Compra de paper reciclat',
                description: 'Ús exclusiu de paper amb certificació ambiental',
                impact: 0.08,
                timeline: 'Mes 1',
                cost: 'Baix',
                measurable: 'Paper reciclat %',
                enabled: false
            },
            {
                id: 'consumibles_3',
                title: 'Optimització d\'inventaris',
                description: 'Sistema de control d\'existències per evitar compres excessives',
                impact: 0.05,
                timeline: 'Mes 2-4',
                cost: 'Baix',
                measurable: 'Compres reduïdes %',
                enabled: false
            },
            {
                id: 'consumibles_4',
                title: 'Programes de reutilització',
                description: 'Recuperar i reutilitzar cartutxos, carpetes, sobres',
                impact: 0.02,
                timeline: 'Mes 1',
                cost: 'Baix',
                measurable: 'Items reutilitzats',
                enabled: false
            }
        ]
    },
    limpieza: {
        name: 'Productes de Neteja',
        icon: '🧹',
        unit: '€',
        reduction: 0.30,
        actions: [
            {
                id: 'limpieza_1',
                title: 'Productes de neteja ecològics',
                description: 'Substituir per productes biodegradables i concentrats',
                impact: 0.10,
                timeline: 'Mes 1-3',
                cost: 'Baix',
                measurable: 'Productes tòxics eliminats',
                enabled: false
            },
            {
                id: 'limpieza_2',
                title: 'Microfiber i tècniques de neteja en sec',
                description: 'Trapos de microfiber redueixen ús d\'aigua i químics',
                impact: 0.08,
                timeline: 'Mes 2-4',
                cost: 'Baix',
                measurable: 'Aigua de neteja reduïda',
                enabled: false
            },
            {
                id: 'limpieza_3',
                title: 'Formació de personal de neteja',
                description: 'Tècniques eficients i dosificació correcta de productes',
                impact: 0.07,
                timeline: 'Mes 1',
                cost: 'Baix',
                measurable: 'Eficiència millorada',
                enabled: false
            },
            {
                id: 'limpieza_4',
                title: 'Compra a granel i dosificadors',
                description: 'Reduir envàs i usar sistemes de dosificació automàtica',
                impact: 0.05,
                timeline: 'Mes 3-6',
                cost: 'Mitjà',
                measurable: 'Envàs reduït %',
                enabled: false
            }
        ]
    }
};

// ===== EMMAGATZEMAMENT GLOBAL =====
let globalData = {
    original: [],
    custom: []
};

let allCharts = {};
let baselineMetrics = null;
let calculatedMetrics = null;
let selectedActions = {
    energia: [],
    agua: [],
    consumibles: [],
    limpieza: []
};
let currentCalculationType = 'energia';

// ===== INICIALITZACIÓ =====
document.addEventListener('DOMContentLoaded', async () => {
    await initializeData();
    setupNavigation();
    renderPage('dashboard');
});

// ===== CARGAR DADES =====
async function initializeData() {
    try {
        const response = await fetch('./dataclean.json');
        const data = await response.json();
        parseOriginalData(data);
        baselineMetrics = calculateAllMetrics(getAllData());
        calculatedMetrics = baselineMetrics;
        loadSelectedActionsFromStorage();
    } catch (error) {
        console.error('Error al cargar dades:', error);
    }
}

function parseOriginalData(data) {
    if (data.Consumo_Energetico_TIC) {
        data.Consumo_Energetico_TIC.forEach(item => {
            globalData.original.push({
                ...item,
                tipo: 'energia',
                source: 'original-energia'
            });
        });
    }

    if (data.Emisiones_CO2_Evitadas) {
        data.Emisiones_CO2_Evitadas.forEach(item => {
            globalData.original.push({
                ...item,
                source: 'original-co2'
            });
        });
    }

    if (data.Impacto_Indirecto_Instalaciones?.agua) {
        data.Impacto_Indirecto_Instalaciones.agua.forEach(item => {
            globalData.original.push({
                ...item,
                tipo: 'agua',
                source: 'original-agua'
            });
        });
    }

    if (data.Consumibles_Impresion) {
        data.Consumibles_Impresion.forEach(item => {
            globalData.original.push({
                ...item,
                tipo: 'consumibles',
                source: 'original-consumibles'
            });
        });
    }

    if (data.Impacto_Indirecto_Instalaciones?.limpieza_y_mantenimiento) {
        data.Impacto_Indirecto_Instalaciones.limpieza_y_mantenimiento.forEach(item => {
            globalData.original.push({
                ...item,
                tipo: 'limpieza',
                source: 'original-limpieza'
            });
        });
    }
}

function loadSelectedActionsFromStorage() {
    const stored = localStorage.getItem('calculadora_selected_actions');
    if (stored) {
        try {
            selectedActions = JSON.parse(stored);
        } catch (error) {
            console.error('Error al cargar accions seleccionades:', error);
        }
    }
}

function saveSelectedActionsToStorage() {
    localStorage.setItem('calculadora_selected_actions', JSON.stringify(selectedActions));
}

// ===== FUNCIONS UTILITÀRIES =====
function getAllData() {
    return [...globalData.original];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ca-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatNumber(value) {
    if (typeof value !== 'number') return '0.00';
    return new Intl.NumberFormat('ca-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function isSchoolYear(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (month >= SCHOOL_YEAR_START.month || month <= SCHOOL_YEAR_END.month) {
        if (month === SCHOOL_YEAR_START.month && day < SCHOOL_YEAR_START.day) return false;
        if (month === SCHOOL_YEAR_END.month && day > SCHOOL_YEAR_END.day) return false;
        return true;
    }
    return false;
}

function getMonthName(monthIndex) {
    const months = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                   'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
    return months[monthIndex];
}

// ===== EXTRAPOLACIÓ I CÀLCULS REALISTES =====
function getMonthlyConsumption() {
    const allData = getAllData();
    const energyData = allData.filter(d => d.tipo === 'energia' || d.source === 'original-energia');

    const monthlyData = {};
    for (let i = 0; i < 12; i++) {
        monthlyData[i] = { total: 0, days: 0, solar: 0 };
    }

    energyData.forEach(item => {
        const date = new Date(item.fecha);
        const month = date.getMonth();
        monthlyData[month].total += item.consumo_total_kWh || 0;
        monthlyData[month].solar += item.produccion_solar_kWh || 0;
        monthlyData[month].days++;
    });

    const monthlyConsumption = {};
    const monthNames = Object.keys(MONTHLY_CONSUMPTION_FACTORS);

    Object.keys(monthlyData).forEach(month => {
        const monthIndex = parseInt(month);
        const monthName = monthNames[monthIndex];
        const factor = MONTHLY_CONSUMPTION_FACTORS[monthName];
        const solarFactor = MONTHLY_SOLAR_FACTORS[monthName];

        let monthAvg = 0;
        if (monthlyData[monthIndex].days > 0) {
            monthAvg = monthlyData[monthIndex].total / monthlyData[monthIndex].days;
        } else {
            const avgDay = energyData.reduce((sum, item) => sum + (item.consumo_total_kWh || 0), 0) / energyData.length;
            monthAvg = avgDay;
        }

        const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate();
        const cloudConsumption = CLOUD_DAILY_CONSUMPTION * daysInMonth;
        const adjustedConsumption = (monthAvg * daysInMonth * factor) + cloudConsumption;
        const solarProduction = adjustedConsumption * solarFactor * 0.30;
        const netConsumption = Math.max(0, adjustedConsumption - solarProduction);

        monthlyConsumption[monthIndex] = {
            total: adjustedConsumption,
            solar: solarProduction,
            net: netConsumption,
            daysInMonth: daysInMonth
        };
    });

    return monthlyConsumption;
}

function getMonthlyWaterConsumption() {
    const allData = getAllData();
    const waterData = allData.filter(d => d.tipo === 'agua' || d.source === 'original-agua');

    const monthlyData = {};
    for (let i = 0; i < 12; i++) {
        monthlyData[i] = { total: 0, days: 0 };
    }

    waterData.forEach(item => {
        const date = new Date(item.fecha);
        const month = date.getMonth();
        const value = (item.consumo_litros || 0) / 1000;
        monthlyData[month].total += value;
        monthlyData[month].days++;
    });

    const monthlyConsumption = {};
    const monthNames = Object.keys(MONTHLY_CONSUMPTION_FACTORS);

    Object.keys(monthlyData).forEach(month => {
        const monthIndex = parseInt(month);
        const monthName = monthNames[monthIndex];
        const factor = MONTHLY_CONSUMPTION_FACTORS[monthName];

        let monthAvg = 0;
        if (monthlyData[monthIndex].days > 0) {
            monthAvg = monthlyData[monthIndex].total / monthlyData[monthIndex].days;
        } else {
            const avgDay = waterData.reduce((sum, item) => sum + ((item.consumo_litros || 0) / 1000), 0) / waterData.length;
            monthAvg = avgDay;
        }

        const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate();
        // Afegir consumo de refrigeració de nuvola
        const cloudWaterConsumption = (CLOUD_WATER_DAILY_CONSUMPTION * daysInMonth) / 1000; // Convertir a m³
        const adjustedConsumption = (monthAvg * daysInMonth * factor) + cloudWaterConsumption;

        monthlyConsumption[monthIndex] = {
            total: adjustedConsumption,
            daysInMonth: daysInMonth
        };
    });

    return monthlyConsumption;
}

function getMonthlyConsumablesConsumption() {
    const monthlyConsumption = {};

    // Calcular promedio excluint mesos de vacacions (Setmana Santa, Estiu, Nadal)
    const workingMonths = 12 - 4; // 12 mesos - aproximadament 4 mesos de vacacions parcials
    const annualBudget = CONSUMABLES_MONTHLY_AVG * workingMonths;

    for (let i = 0; i < 12; i++) {
        // Setmana Santa (Abril - mes 3): 50% de gasto
        if (i === EASTER_MONTH) {
            monthlyConsumption[i] = CONSUMABLES_MONTHLY_AVG * 0.5;
        }
        // Estiu (Juny, Juliol, Agost - mesos 5, 6, 7): 0% de gasto
        else if (i === 5 || i === 6 || i === 7) {
            monthlyConsumption[i] = 0;
        }
        // Nadal (Desembre - mes 11): 50% de gasto
        else if (i === CHRISTMAS_MONTH) {
            monthlyConsumption[i] = CONSUMABLES_MONTHLY_AVG * 0.5;
        }
        // Resta de mesos: gasto normal
        else {
            monthlyConsumption[i] = CONSUMABLES_MONTHLY_AVG;
        }
    }

    return monthlyConsumption;
}

function getMonthlyCleaning() {
    const monthlyConsumption = {};

    // Limpieza es constant tot l'any (sueldo de treballadors + material)
    for (let i = 0; i < 12; i++) {
        monthlyConsumption[i] = CLEANING_MONTHLY_AVG;
    }

    return monthlyConsumption;
}

// ===== CÀLCULS PRINCIPALS =====
function calculateAllMetrics(allData) {
    return {
        energia: calculateEnergyMetrics(allData),
        agua: calculateWaterMetrics(allData),
        consumibles: calculateConsumablesMetrics(allData),
        limpieza: calculateCleaningMetrics(allData)
    };
}

function calculateEnergyMetrics(allData) {
    const monthlyConsumption = getMonthlyConsumption();

    let totalYear = 0;
    let totalSchoolYear = 0;
    let schoolMonthCount = 0;

    Object.keys(monthlyConsumption).forEach(month => {
        const monthIndex = parseInt(month);
        totalYear += monthlyConsumption[monthIndex].net;

        if (monthIndex >= 8 || monthIndex <= 5) {
            totalSchoolYear += monthlyConsumption[monthIndex].net;
            schoolMonthCount++;
        }
    });

    const costPerKwh = ELECTRICITY_PRICE;
    const totalYearCost = totalYear * costPerKwh;
    const totalSchoolYearCost = totalSchoolYear * costPerKwh;

    return {
        total: totalYear,
        totalCost: totalYearCost,
        totalEscolar: totalSchoolYear,
        totalEscolarCost: totalSchoolYearCost,
        promedio: totalYear / 12,
        promedioCost: totalYearCost / 12,
        promedioEscolar: schoolMonthCount > 0 ? totalSchoolYear / schoolMonthCount : 0,
        promedioEscolarCost: schoolMonthCount > 0 ? totalSchoolYearCost / schoolMonthCount : 0,
        unit: '€'
    };
}

function calculateWaterMetrics(allData) {
    const monthlyConsumption = getMonthlyWaterConsumption();

    let totalYear = 0;
    let totalSchoolYear = 0;
    let schoolMonthCount = 0;

    Object.keys(monthlyConsumption).forEach(month => {
        const monthIndex = parseInt(month);
        totalYear += monthlyConsumption[monthIndex].total;

        if (monthIndex >= 8 || monthIndex <= 5) {
            totalSchoolYear += monthlyConsumption[monthIndex].total;
            schoolMonthCount++;
        }
    });

    const costPerM3 = WATER_PRICE;
    const totalYearCost = totalYear * costPerM3;
    const totalSchoolYearCost = totalSchoolYear * costPerM3;

    return {
        total: totalYear,
        totalCost: totalYearCost,
        totalEscolar: totalSchoolYear,
        totalEscolarCost: totalSchoolYearCost,
        promedio: totalYear / 12,
        promedioCost: totalYearCost / 12,
        promedioEscolar: schoolMonthCount > 0 ? totalSchoolYear / schoolMonthCount : 0,
        promedioEscolarCost: schoolMonthCount > 0 ? totalSchoolYearCost / schoolMonthCount : 0,
        unit: '€'
    };
}

function calculateConsumablesMetrics(allData) {
    const monthlyConsumption = getMonthlyConsumablesConsumption();

    let totalYear = 0;
    let totalSchoolYear = 0;
    let schoolMonthCount = 0;

    Object.keys(monthlyConsumption).forEach(month => {
        const monthIndex = parseInt(month);
        totalYear += monthlyConsumption[monthIndex];

        if (monthIndex >= 8 || monthIndex <= 5) {
            totalSchoolYear += monthlyConsumption[monthIndex];
            schoolMonthCount++;
        }
    });

    return {
        total: totalYear,
        totalEscolar: totalSchoolYear,
        promedio: totalYear / 12,
        promedioEscolar: schoolMonthCount > 0 ? totalSchoolYear / schoolMonthCount : 0,
        unit: '€'
    };
}

function calculateCleaningMetrics(allData) {
    const monthlyConsumption = getMonthlyCleaning();

    let totalYear = 0;
    let totalSchoolYear = 0;
    let schoolMonthCount = 0;

    Object.keys(monthlyConsumption).forEach(month => {
        const monthIndex = parseInt(month);
        totalYear += monthlyConsumption[monthIndex];

        if (monthIndex >= 8 || monthIndex <= 5) {
            totalSchoolYear += monthlyConsumption[monthIndex];
            schoolMonthCount++;
        }
    });

    return {
        total: totalYear,
        totalEscolar: totalSchoolYear,
        promedio: totalYear / 12,
        promedioEscolar: schoolMonthCount > 0 ? totalSchoolYear / schoolMonthCount : 0,
        unit: '€'
    };
}

function calculateSpecialPeriods() {
    const monthlyEnergy = getMonthlyConsumption();
    const monthlyWater = getMonthlyWaterConsumption();

    // Setmana Santa (1 setmana en abril, ~7 dies)
    const easterDays = 7;
    const easterEnergyPerDay = monthlyEnergy[3].net / monthlyEnergy[3].daysInMonth;
    const easterEnergy = (easterEnergyPerDay * easterDays * 0.7) * ELECTRICITY_PRICE;

    const easterWaterPerDay = monthlyWater[3].total / monthlyWater[3].daysInMonth;
    const easterWater = (easterWaterPerDay * easterDays * 0.7) * WATER_PRICE;

    // Estiu (Juny, Juliol, Agost - 3 mesos)
    const summerEnergyTotal = monthlyEnergy[5].net + monthlyEnergy[6].net + monthlyEnergy[7].net;
    const summerEnergy = (summerEnergyTotal / 3) * ELECTRICITY_PRICE;

    const summerWaterTotal = monthlyWater[5].total + monthlyWater[6].total + monthlyWater[7].total;
    const summerWater = (summerWaterTotal / 3) * WATER_PRICE;

    // Nadal (1 setmana en desembre, ~7 dies)
    const christmasDays = 7;
    const christmasEnergyPerDay = monthlyEnergy[11].net / monthlyEnergy[11].daysInMonth;
    const christmasEnergy = (christmasEnergyPerDay * christmasDays * 0.7) * ELECTRICITY_PRICE;

    const christmasWaterPerDay = monthlyWater[11].total / monthlyWater[11].daysInMonth;
    const christmasWater = (christmasWaterPerDay * christmasDays * 0.7) * WATER_PRICE;

    // Promedio anual
    let totalEnergy = 0, totalWater = 0;
    Object.keys(monthlyEnergy).forEach(month => {
        totalEnergy += monthlyEnergy[month].net;
        totalWater += monthlyWater[month].total;
    });
    const avgEnergy = (totalEnergy / 12) * ELECTRICITY_PRICE;
    const avgWater = (totalWater / 12) * WATER_PRICE;

    return {
        easterEnergy, easterWater,
        summerEnergy, summerWater,
        christmasEnergy, christmasWater,
        avgEnergy, avgWater
    };
}

function calculateTotalAnnualCost() {
    const metrics = calculatedMetrics || baselineMetrics;
    return {
        energia: metrics.energia.totalCost,
        agua: metrics.agua.totalCost,
        consumibles: metrics.consumibles.total,
        limpieza: metrics.limpieza.total,
        total: metrics.energia.totalCost + metrics.agua.totalCost + metrics.consumibles.total + metrics.limpieza.total
    };
}

function calculateReductionMetrics(metricType) {
    const metrics = baselineMetrics;
    const strategy = REDUCTION_STRATEGIES[metricType];
    const enabledActions = selectedActions[metricType] || [];

    let totalImpact = 0;
    strategy.actions.forEach(action => {
        if (enabledActions.includes(action.id)) {
            totalImpact += action.impact;
        }
    });

    const baseline = metricType === 'energia'
        ? metrics.energia.totalCost
        : metricType === 'agua'
        ? metrics.agua.totalCost
        : metricType === 'consumibles'
        ? metrics.consumibles.total
        : metrics.limpieza.total;

    const reductionPerYear = Math.min(totalImpact, 0.30) / 3;

    return {
        baseline: baseline,
        baselineYear2: baseline * (1 + INFLATION_RATE),
        baselineYear3: baseline * Math.pow(1 + INFLATION_RATE, 2),
        baselineYear4: baseline * Math.pow(1 + INFLATION_RATE, 3),
        year1: baseline * (1 - reductionPerYear) * (1 + INFLATION_RATE),
        year2: baseline * (1 - reductionPerYear * 2) * Math.pow(1 + INFLATION_RATE, 2),
        year3: baseline * (1 - reductionPerYear * 3) * Math.pow(1 + INFLATION_RATE, 3),
        reductionPercentage: Math.min(totalImpact, 0.30),
        totalImpact: totalImpact
    };
}

// ===== NAVEGACIÓ =====
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            renderPage(e.target.dataset.page);
        });
    });
}

function renderPage(pageName) {
    Object.values(allCharts).forEach(chart => {
        if (chart) chart.destroy();
    });
    allCharts = {};

    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageName}-page`).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    if (pageName === 'dashboard') {
        renderDashboard();
    } else if (pageName === 'analisis') {
        renderAnalisis();
    } else if (pageName === 'reduction') {
        renderReductionCalculator();
    }
}

// ===== DASHBOARD =====
function renderDashboard() {
    const container = document.getElementById('dashboard-content');
    const annualCost = calculateTotalAnnualCost();
    const metrics = baselineMetrics;

    container.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h2>📊 Dashboard Principal</h2>
                <p>Anàlisi de consumos i costos anuals</p>
            </div>

            <div class="kpi-container">
                <div class="kpi-cards">
                    <div class="kpi-card energy">
                        <div class="kpi-icon">⚡</div>
                        <div class="kpi-content">
                            <h3>Energía</h3>
                            <p class="kpi-value">${formatNumber(annualCost.energia)}</p>
                            <p class="kpi-unit">€/any</p>
                            <p class="kpi-secondary">Promig: ${formatNumber(metrics.energia.promedioCost)}/mes</p>
                        </div>
                    </div>

                    <div class="kpi-card water">
                        <div class="kpi-icon">💧</div>
                        <div class="kpi-content">
                            <h3>Aigua</h3>
                            <p class="kpi-value">${formatNumber(annualCost.agua)}</p>
                            <p class="kpi-unit">€/any</p>
                            <p class="kpi-secondary">Promig: ${formatNumber(metrics.agua.promedioCost)}/mes</p>
                        </div>
                    </div>

                    <div class="kpi-card consumables">
                        <div class="kpi-icon">📄</div>
                        <div class="kpi-content">
                            <h3>Consumibles</h3>
                            <p class="kpi-value">${formatNumber(annualCost.consumibles)}</p>
                            <p class="kpi-unit">€/any</p>
                            <p class="kpi-secondary">Promig: ${formatNumber(metrics.consumibles.promedio)}/mes</p>
                        </div>
                    </div>

                    <div class="kpi-card cleaning">
                        <div class="kpi-icon">🧹</div>
                        <div class="kpi-content">
                            <h3>Neteja</h3>
                            <p class="kpi-value">${formatNumber(annualCost.limpieza)}</p>
                            <p class="kpi-unit">€/any</p>
                            <p class="kpi-secondary">Promig: ${formatNumber(metrics.limpieza.promedio)}/mes</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-total">
                <h3>💰 Gast Total Anual</h3>
                <p class="total-cost">${formatNumber(annualCost.total)} €</p>
            </div>

            <div class="charts-grid">
                <div class="chart-section full-width">
                    <h3>⚡ Consum Energètic per Mesos (€)</h3>
                    <div class="chart-wrapper">
                        <canvas id="energyMonthlyChart"></canvas>
                    </div>
                </div>

                <div class="chart-section full-width">
                    <h3>💧 Consum d'Aigua per Mesos (€)</h3>
                    <div class="chart-wrapper">
                        <canvas id="waterMonthlyChart"></canvas>
                    </div>
                </div>

                <div class="chart-section full-width">
                    <h3>💰 Distribució de Costos Anuals Totals</h3>
                    <div class="chart-wrapper">
                        <canvas id="costDistributionChart"></canvas>
                    </div>
                </div>

                <div class="special-periods-container">
                    <div class="chart-section half-width">
                        <h3>📅 Períodes Especials - Energía</h3>
                        <p class="periods-info">Setmana Santa (1 setmana Abril) | Estiu (Juny - Agost) | Nadal (1 setmana Desembre)</p>
                        <div class="chart-wrapper">
                            <canvas id="specialPeriodsEnergyChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-section half-width">
                        <h3>📅 Períodes Especials - Aigua</h3>
                        <p class="periods-info">Setmana Santa (1 setmana Abril) | Estiu (Juny - Agost) | Nadal (1 setmana Desembre)</p>
                        <div class="chart-wrapper">
                            <canvas id="specialPeriodsWaterChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderEnergyMonthlyChart();
    renderWaterMonthlyChart();
    renderCostDistributionChart();
    renderSpecialPeriodsEnergyChart();
    renderSpecialPeriodsWaterChart();
}

// ===== GRÀFICS DASHBOARD =====
function renderEnergyMonthlyChart() {
    const monthlyData = getMonthlyConsumption();
    const costPerKwh = ELECTRICITY_PRICE;

    const labels = [];
    const data = [];

    for (let i = 0; i < 12; i++) {
        labels.push(getMonthName(i));
        data.push(monthlyData[i].net * costPerKwh);
    }

    const ctx = document.getElementById('energyMonthlyChart').getContext('2d');
    allCharts.energyMonthly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cost Energía (€)',
                data: data,
                backgroundColor: COLORS.energia,
                borderColor: COLORS.energiaOscuro,
                borderWidth: 2,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderWaterMonthlyChart() {
    const monthlyData = getMonthlyWaterConsumption();
    const costPerM3 = WATER_PRICE;

    const labels = [];
    const data = [];

    for (let i = 0; i < 12; i++) {
        labels.push(getMonthName(i));
        data.push(monthlyData[i].total * costPerM3);
    }

    const ctx = document.getElementById('waterMonthlyChart').getContext('2d');
    allCharts.waterMonthly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cost Aigua (€)',
                data: data,
                backgroundColor: COLORS.agua,
                borderColor: COLORS.aguaOscuro,
                borderWidth: 2,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderCostDistributionChart() {
    const annualCost = calculateTotalAnnualCost();

    const ctx = document.getElementById('costDistributionChart').getContext('2d');
    allCharts.costDistribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Energía', 'Aigua', 'Consumibles', 'Neteja'],
            datasets: [{
                data: [annualCost.energia, annualCost.agua, annualCost.consumibles, annualCost.limpieza],
                backgroundColor: [COLORS.energia, COLORS.agua, COLORS.consumibles, COLORS.limpieza],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function renderSpecialPeriodsEnergyChart() {
    const periods = calculateSpecialPeriods();

    const ctx = document.getElementById('specialPeriodsEnergyChart').getContext('2d');
    allCharts.specialPeriodsEnergy = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Setmana Santa', 'Estiu', 'Nadal', 'Promig'],
            datasets: [
                {
                    label: 'Energía (€)',
                    data: [periods.easterEnergy, periods.summerEnergy, periods.christmasEnergy, periods.avgEnergy],
                    backgroundColor: COLORS.energia,
                    borderColor: COLORS.energiaOscuro,
                    borderWidth: 2,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderSpecialPeriodsWaterChart() {
    const periods = calculateSpecialPeriods();

    const ctx = document.getElementById('specialPeriodsWaterChart').getContext('2d');
    allCharts.specialPeriodsWater = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Setmana Santa', 'Estiu', 'Nadal', 'Promig'],
            datasets: [
                {
                    label: 'Aigua (€)',
                    data: [periods.easterWater, periods.summerWater, periods.christmasWater, periods.avgWater],
                    backgroundColor: COLORS.agua,
                    borderColor: COLORS.aguaOscuro,
                    borderWidth: 2,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ===== ANÀLISI DETALLAT =====
function renderAnalisis() {
    const container = document.getElementById('analisis-content');
    const metrics = baselineMetrics;
    const annualCost = calculateTotalAnnualCost();

    let html = `
        <div class="analysis-container">
            <div class="analysis-header">
                <h2>📈 Anàlisi Detallat</h2>
                <p>Desglossament de consumos i costos per període</p>
            </div>

            <div class="analysis-spacer"></div>

            <div class="metrics-detailed">
                <div class="metric-card-detailed">
                    <h4>⚡ Energía - Año Complet</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Consum Anual</span>
                            <span class="value">${formatNumber(metrics.energia.total)} kWh</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Cost Anual</span>
                            <span class="value highlight">${formatNumber(annualCost.energia)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promig Mensual</span>
                            <span class="value">${formatNumber(metrics.energia.promedioCost)} €</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>⚡ Energía - Període Escolar (Sept-Jun)</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Consum Període</span>
                            <span class="value">${formatNumber(metrics.energia.totalEscolar)} kWh</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Cost Període</span>
                            <span class="value highlight">${formatNumber(metrics.energia.totalEscolarCost)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">% vs Año Complet</span>
                            <span class="value highlight">${((metrics.energia.totalEscolarCost / annualCost.energia) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>💧 Aigua - Año Complet</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Consum Anual</span>
                            <span class="value">${formatNumber(metrics.agua.total)} m³</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Cost Anual</span>
                            <span class="value highlight">${formatNumber(annualCost.agua)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promig Mensual</span>
                            <span class="value">${formatNumber(metrics.agua.promedioCost)} €</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>💧 Aigua - Període Escolar (Sept-Jun)</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Consum Període</span>
                            <span class="value">${formatNumber(metrics.agua.totalEscolar)} m³</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Cost Període</span>
                            <span class="value highlight">${formatNumber(metrics.agua.totalEscolarCost)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">% vs Año Complet</span>
                            <span class="value highlight">${((metrics.agua.totalEscolarCost / annualCost.agua) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>📄 Consumibles - Año Complet</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Gast Anual</span>
                            <span class="value highlight">${formatNumber(annualCost.consumibles)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promig Mensual</span>
                            <span class="value">${formatNumber(metrics.consumibles.promedio)} €</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>📄 Consumibles - Període Escolar (Sept-Jun)</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Gast Període</span>
                            <span class="value">${formatNumber(metrics.consumibles.totalEscolar)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">% vs Año Complet</span>
                            <span class="value highlight">${((metrics.consumibles.totalEscolar / annualCost.consumibles) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>🧹 Neteja - Año Complet</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Gast Anual</span>
                            <span class="value highlight">${formatNumber(annualCost.limpieza)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promig Mensual</span>
                            <span class="value">${formatNumber(metrics.limpieza.promedio)} €</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>🧹 Neteja - Període Escolar (Sept-Jun)</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Gast Període</span>
                            <span class="value">${formatNumber(metrics.limpieza.totalEscolar)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">% vs Año Complet</span>
                            <span class="value highlight">${((metrics.limpieza.totalEscolar / annualCost.limpieza) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="comparison-table-section">
                <h3>Comparativa Año Escolar vs Año Complet</h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Tipus de Consum</th>
                            <th>Año Escolar (Sept-Jun)</th>
                            <th>Año Complet</th>
                            <th>Diferència</th>
                            <th>% Variació</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>⚡ Energía (€)</td>
                            <td>${formatNumber(metrics.energia.totalEscolarCost)} €</td>
                            <td>${formatNumber(annualCost.energia)} €</td>
                            <td>${formatNumber(annualCost.energia - metrics.energia.totalEscolarCost)} €</td>
                            <td>${((annualCost.energia - metrics.energia.totalEscolarCost) / metrics.energia.totalEscolarCost * 100).toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td>💧 Aigua (€)</td>
                            <td>${formatNumber(metrics.agua.totalEscolarCost)} €</td>
                            <td>${formatNumber(annualCost.agua)} €</td>
                            <td>${formatNumber(annualCost.agua - metrics.agua.totalEscolarCost)} €</td>
                            <td>${((annualCost.agua - metrics.agua.totalEscolarCost) / metrics.agua.totalEscolarCost * 100).toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td>📄 Consumibles (€)</td>
                            <td>${formatNumber(metrics.consumibles.totalEscolar)} €</td>
                            <td>${formatNumber(annualCost.consumibles)} €</td>
                            <td>${formatNumber(annualCost.consumibles - metrics.consumibles.totalEscolar)} €</td>
                            <td>${((annualCost.consumibles - metrics.consumibles.totalEscolar) / metrics.consumibles.totalEscolar * 100).toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td>🧹 Neteja (€)</td>
                            <td>${formatNumber(metrics.limpieza.totalEscolar)} €</td>
                            <td>${formatNumber(annualCost.limpieza)} €</td>
                            <td>${formatNumber(annualCost.limpieza - metrics.limpieza.totalEscolar)} €</td>
                            <td>${((annualCost.limpieza - metrics.limpieza.totalEscolar) / metrics.limpieza.totalEscolar * 100).toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ===== CALCULADORA DE REDUCCIÓ =====
function renderReductionCalculator() {
    const container = document.getElementById('reduction-content');

    let html = `
        <div class="reduction-container">
            <div class="reduction-header">
                <h2>🌱 Calculadora</h2>
                <p>Selecciona que vols calcular i les accions que vols implementar</p>
            </div>

            <div class="reduction-menu">
                <button class="menu-btn ${currentCalculationType === 'energia' ? 'active' : ''}" onclick="changeCalculationType('energia')">⚡ Energía</button>
                <button class="menu-btn ${currentCalculationType === 'agua' ? 'active' : ''}" onclick="changeCalculationType('agua')">💧 Aigua</button>
                <button class="menu-btn ${currentCalculationType === 'consumibles' ? 'active' : ''}" onclick="changeCalculationType('consumibles')">📄 Consumibles</button>
                <button class="menu-btn ${currentCalculationType === 'limpieza' ? 'active' : ''}" onclick="changeCalculationType('limpieza')">🧹 Neteja</button>
            </div>

            <div class="reduction-content">
    `;

    const strategy = REDUCTION_STRATEGIES[currentCalculationType];
    const metrics = calculateReductionMetrics(currentCalculationType);
    const enabledActions = selectedActions[currentCalculationType] || [];

    html += `
                <div class="reduction-left">
                    <h3>${strategy.icon} ${strategy.name}</h3>

                    <div class="chart-wrapper">
                        <canvas id="reductionComparisonChart"></canvas>
                    </div>

                    <div class="reduction-values">
                        <div class="value-card baseline">
                            <span class="label">Baseline 2026</span>
                            <span class="value">${formatNumber(metrics.baseline)} €</span>
                        </div>
                        <div class="value-card">
                            <span class="label">Año 1 (2027)</span>
                            <span class="value">${formatNumber(metrics.year1)} €</span>
                        </div>
                        <div class="value-card">
                            <span class="label">Año 2 (2028)</span>
                            <span class="value">${formatNumber(metrics.year2)} €</span>
                        </div>
                        <div class="value-card">
                            <span class="label">Año 3 (2029)</span>
                            <span class="value">${formatNumber(metrics.year3)} €</span>
                        </div>
                    </div>
                </div>

                <div class="reduction-right">
                    <h3>🎯 Accions Disponibles</h3>
                    <div class="actions-list">
    `;

    strategy.actions.forEach((action, idx) => {
        const isEnabled = enabledActions.includes(action.id);
        html += `
            <div class="action-item ${isEnabled ? 'enabled' : ''}">
                <input type="checkbox"
                    id="${action.id}"
                    ${isEnabled ? 'checked' : ''}
                    onchange="toggleAction('${currentCalculationType}', '${action.id}')">
                <label for="${action.id}">
                    <div class="action-details-box">
                        <strong>${action.title}</strong>
                        <p>${action.description}</p>
                        <div class="action-meta">
                            <span class="meta-item">Impacte: ${(action.impact * 100).toFixed(1)}%</span>
                            <span class="meta-item">Timeline: ${action.timeline}</span>
                            <span class="meta-item cost-${action.cost.toLowerCase()}">Cost: ${action.cost}</span>
                        </div>
                    </div>
                </label>
            </div>
        `;
    });

    html += `
                    </div>

                    <div class="economy-circular">
                        <h4>🔄 Principis d'Economia Circular</h4>
                        <ul>
                            <li>Reduir: Minimitzar recursos des de l'origen</li>
                            <li>Reutilitzar: Donar segona vida als productes</li>
                            <li>Reciclar: Processar materials</li>
                            <li>Recuperar: Obtenir energia de residus</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    renderReductionComparisonChart();
}

function changeCalculationType(type) {
    currentCalculationType = type;
    renderReductionCalculator();
}

function toggleAction(metricType, actionId) {
    if (!selectedActions[metricType]) {
        selectedActions[metricType] = [];
    }

    const index = selectedActions[metricType].indexOf(actionId);
    if (index > -1) {
        selectedActions[metricType].splice(index, 1);
    } else {
        selectedActions[metricType].push(actionId);
    }

    saveSelectedActionsToStorage();
    renderReductionCalculator();
}

function renderReductionComparisonChart() {
    const metrics = calculateReductionMetrics(currentCalculationType);

    const ctx = document.getElementById('reductionComparisonChart').getContext('2d');
    allCharts.reductionComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Baseline 2026', 'Año 1 (2027)', 'Año 2 (2028)', 'Año 3 (2029)'],
            datasets: [
                {
                    label: 'Baseline (Sense Accions)',
                    data: [metrics.baseline, metrics.baselineYear2, metrics.baselineYear3, metrics.baselineYear4],
                    backgroundColor: COLORS.energiaOscuro,
                    borderColor: '#000',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Amb Accions',
                    data: [metrics.baseline, metrics.year1, metrics.year2, metrics.year3],
                    backgroundColor: COLORS.energiaClaro,
                    borderColor: COLORS.energia,
                    borderWidth: 2,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: {
                y: { beginAtZero: true },
                x: { stacked: false }
            }
        }
    });
}
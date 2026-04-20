// ===== CONSTANTES Y CONFIGURACIÓN =====
const INFLATION_RATE = 0.03;
const MONTHLY_FACTORS = [1.0, 0.95, 0.9, 0.8, 0.8, 0.9, 0.1, 0.05, 0.9, 1.0, 1.0, 0.7];
const SCHOOL_YEAR_START = { month: 9, day: 1 };
const SCHOOL_YEAR_END = { month: 6, day: 30 };

// Estrategias de reducción de consumo (30% en 3 años)
const REDUCTION_STRATEGIES = {
    energia: {
        name: 'Energía Eléctrica',
        icon: '⚡',
        reduction: 0.30,
        actions: [
            {
                title: 'Instalación de LED eficientes',
                description: 'Cambiar toda la iluminación a LED reduce 40% del consumo de iluminación',
                impact: 0.08,
                timeline: 'Mes 1-3',
                cost: 'Alto',
                measurable: 'kWh reducidos por mes'
            },
            {
                title: 'Sistema de control automático de luz',
                description: 'Sensores de presencia y luz natural reducen consumo innecesario',
                impact: 0.07,
                timeline: 'Mes 4-6',
                cost: 'Medio',
                measurable: 'Horas de luz reducidas'
            },
            {
                title: 'Optimización de equipos HVAC',
                description: 'Mantenimiento preventivo y programación inteligente',
                impact: 0.10,
                timeline: 'Mes 7-12',
                cost: 'Medio',
                measurable: 'Temperatura controlada automáticamente'
            },
            {
                title: 'Auditoría energética y formación',
                description: 'Identificar consumos anómalos y concienciar al personal',
                impact: 0.05,
                timeline: 'Mes 1',
                cost: 'Bajo',
                measurable: 'Comportamientos de consumo mejorados'
            }
        ]
    },
    agua: {
        name: 'Agua',
        icon: '💧',
        reduction: 0.30,
        actions: [
            {
                title: 'Instalación de grifos de bajo flujo',
                description: 'Grifos y duchas con aireadores que reducen 30-50% del consumo',
                impact: 0.12,
                timeline: 'Mes 1-3',
                cost: 'Bajo',
                measurable: 'Litros/día reducidos'
            },
            {
                title: 'Reparación de fugas',
                description: 'Una fuga pequeña puede perder 200L/día. Revisión trimestral',
                impact: 0.08,
                timeline: 'Mes 1',
                cost: 'Bajo',
                measurable: 'Fugas reparadas'
            },
            {
                title: 'Sistema de riego inteligente',
                description: 'Sensor de humedad y riego automático según necesidad',
                impact: 0.07,
                timeline: 'Mes 4-6',
                cost: 'Medio',
                measurable: 'Agua de riego optimizada'
            },
            {
                title: 'Reutilización de aguas grises',
                description: 'Sistemas para reutilizar agua de lluvia y aires acondicionados',
                impact: 0.03,
                timeline: 'Mes 13-24',
                cost: 'Alto',
                measurable: 'Litros reutilizados/mes'
            }
        ]
    },
    consumibles: {
        name: 'Consumibles de Oficina',
        icon: '📄',
        reduction: 0.30,
        actions: [
            {
                title: 'Digitalización de procesos',
                description: 'Transitar a documentos digitales reduce papel en 80%',
                impact: 0.15,
                timeline: 'Mes 1-6',
                cost: 'Medio',
                measurable: 'Hojas de papel/mes'
            },
            {
                title: 'Compra de papel reciclado',
                description: 'Uso exclusivo de papel con certificación ambiental',
                impact: 0.08,
                timeline: 'Mes 1',
                cost: 'Bajo',
                measurable: 'Papel reciclado %'
            },
            {
                title: 'Optimización de inventarios',
                description: 'Sistema de control de existencias para evitar compras excesivas',
                impact: 0.05,
                timeline: 'Mes 2-4',
                cost: 'Bajo',
                measurable: 'Compras reducidas %'
            },
            {
                title: 'Programas de reutilización',
                description: 'Recuperar y reutilizar cartuchos, carpetas, sobres',
                impact: 0.02,
                timeline: 'Mes 1',
                cost: 'Bajo',
                measurable: 'Items reutilizados'
            }
        ]
    },
    limpieza: {
        name: 'Productos de Limpieza',
        icon: '🧹',
        reduction: 0.30,
        actions: [
            {
                title: 'Productos de limpieza ecológicos',
                description: 'Sustituir por productos biodegradables y concentrados',
                impact: 0.10,
                timeline: 'Mes 1-3',
                cost: 'Bajo',
                measurable: 'Productos tóxicos eliminados'
            },
            {
                title: 'Microfiber y técnicas de limpieza en seco',
                description: 'Trapos de microfibra reducen uso de agua y químicos',
                impact: 0.08,
                timeline: 'Mes 2-4',
                cost: 'Bajo',
                measurable: 'Agua de limpieza reducida'
            },
            {
                title: 'Formación de personal de limpieza',
                description: 'Técnicas eficientes y dosificación correcta de productos',
                impact: 0.07,
                timeline: 'Mes 1',
                cost: 'Bajo',
                measurable: 'Eficiencia mejorada'
            },
            {
                title: 'Compra a granel y dosificadores',
                description: 'Reducir envases y usar sistemas de dosificación automática',
                impact: 0.05,
                timeline: 'Mes 3-6',
                cost: 'Medio',
                measurable: 'Envases reducidos %'
            }
        ]
    }
};

// ===== ALMACENAMIENTO GLOBAL =====
let globalData = {
    original: [],
    custom: []
};

let allCharts = {};
let editingId = null;
let baselineMetrics = null;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', async () => {
    await initializeData();
    setupNavigation();
    renderPage('dashboard');
});

// ===== CARGAR DATOS =====
async function initializeData() {
    try {
        const response = await fetch('./dataclean.json');
        const data = await response.json();
        parseOriginalData(data);
        loadCustomDataFromStorage();
        baselineMetrics = calculateAllMetrics(getAllData());
    } catch (error) {
        console.error('Error al cargar datos:', error);
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

function loadCustomDataFromStorage() {
    const stored = localStorage.getItem('calculadora_custom_data');
    if (stored) {
        try {
            globalData.custom = JSON.parse(stored);
        } catch (error) {
            console.error('Error al cargar datos del localStorage:', error);
        }
    }
}

function saveCustomDataToStorage() {
    localStorage.setItem('calculadora_custom_data', JSON.stringify(globalData.custom));
}

// ===== FUNCIONES UTILITARIAS =====
function getAllData() {
    return [...globalData.original, ...globalData.custom];
}

function getCustomData() {
    return globalData.custom;
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

// ===== CÁLCULOS PRINCIPALES =====
function calculateAllMetrics(allData) {
    return {
        energia: calculateEnergyMetrics(allData),
        agua: calculateWaterMetrics(allData),
        consumibles: calculateConsumablesMetrics(allData),
        limpieza: calculateCleaningMetrics(allData)
    };
}

function calculateEnergyMetrics(allData) {
    const energyData = allData.filter(d => d.tipo === 'energia' || d.source === 'original-energia');
    let total = 0, schoolYearTotal = 0, dayCount = 0, schoolDayCount = 0;

    energyData.forEach(item => {
        const value = item.consumo_total_kWh || item.valor || 0;
        total += value;
        dayCount++;
        if (isSchoolYear(new Date(item.fecha))) {
            schoolYearTotal += value;
            schoolDayCount++;
        }
    });

    return {
        total,
        totalEscolar: schoolYearTotal,
        promedio: dayCount > 0 ? total / dayCount : 0,
        promedioEscolar: schoolDayCount > 0 ? schoolYearTotal / schoolDayCount : 0,
        dataPoints: dayCount,
        unit: 'kWh'
    };
}

function calculateWaterMetrics(allData) {
    const waterData = allData.filter(d => d.tipo === 'agua' || d.source === 'original-agua');
    let total = 0, schoolYearTotal = 0, dayCount = 0, schoolDayCount = 0;

    waterData.forEach(item => {
        let value = 0;
        if (item.consumo_litros) value = item.consumo_litros / 1000;
        else value = item.valor || 0;

        total += value;
        dayCount++;
        if (isSchoolYear(new Date(item.fecha))) {
            schoolYearTotal += value;
            schoolDayCount++;
        }
    });

    return {
        total,
        totalEscolar: schoolYearTotal,
        promedio: dayCount > 0 ? total / dayCount : 0,
        promedioEscolar: schoolDayCount > 0 ? schoolYearTotal / schoolDayCount : 0,
        dataPoints: dayCount,
        unit: 'm³'
    };
}

function calculateConsumablesMetrics(allData) {
    const consumablesData = allData.filter(d => d.tipo === 'consumibles' || d.source === 'original-consumibles');
    let total = 0, schoolYearTotal = 0, monthCount = 0, schoolMonthCount = 0;

    const byMonth = {};
    const schoolByMonth = {};

    consumablesData.forEach(item => {
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

    Object.values(byMonth).forEach(v => { total += v; monthCount++; });
    Object.values(schoolByMonth).forEach(v => { schoolYearTotal += v; schoolMonthCount++; });

    return {
        total,
        totalEscolar: schoolYearTotal,
        promedio: monthCount > 0 ? total / monthCount : 0,
        promedioEscolar: schoolMonthCount > 0 ? schoolYearTotal / schoolMonthCount : 0,
        dataPoints: monthCount,
        unit: '€'
    };
}

function calculateCleaningMetrics(allData) {
    const cleaningData = allData.filter(d => d.tipo === 'limpieza' || d.source === 'original-limpieza');
    let total = 0, schoolYearTotal = 0, monthCount = 0, schoolMonthCount = 0;

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

    Object.values(byMonth).forEach(v => { total += v; monthCount++; });
    Object.values(schoolByMonth).forEach(v => { schoolYearTotal += v; schoolMonthCount++; });

    return {
        total,
        totalEscolar: schoolYearTotal,
        promedio: monthCount > 0 ? total / monthCount : 0,
        promedioEscolar: schoolMonthCount > 0 ? schoolYearTotal / schoolMonthCount : 0,
        dataPoints: monthCount,
        unit: '€'
    };
}

function getProjections(metrics) {
    return {
        energia: getProjectionValues(metrics.energia.promedio * 365),
        agua: getProjectionValues(metrics.agua.promedio * 365),
        consumibles: getProjectionValues(metrics.consumibles.promedio * 12),
        limpieza: getProjectionValues(metrics.limpieza.promedio * 12)
    };
}

function getProjectionValues(yearValue) {
    const year2 = yearValue * (1 + INFLATION_RATE);
    const year3 = year2 * (1 + INFLATION_RATE);
    return {
        yearProjection: yearValue,
        year2Projection: year2,
        year3Projection: year3
    };
}

function calculateSpecialPeriodsMetrics(allData) {
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

        if (month === 2 || month === 3) easterEnergy += value * 0.7;
        else if (month === 6) summerEnergy += value * 0.1;
        else if (month === 7) summerEnergy += value * 0.05;
        else if ((month === 11 && day >= 20) || (month === 0 && day <= 6)) christmasEnergy += value * 0.7;
    });

    waterData.forEach(item => {
        const date = new Date(item.fecha);
        const month = date.getMonth();
        const day = date.getDate();
        const value = (item.consumo_litros || item.valor || 0) / 1000;

        if (month === 2 || month === 3) easterWater += value * 0.7;
        else if (month === 6) summerWater += value * 0.1;
        else if (month === 7) summerWater += value * 0.05;
        else if ((month === 11 && day >= 20) || (month === 0 && day <= 6)) christmasWater += value * 0.7;
    });

    return {
        easterEnergy, easterWater,
        summerEnergy, summerWater,
        christmasEnergy, christmasWater
    };
}

function getMonthlyAverage(allData, type) {
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

function getSavingSuggestions(allData) {
    const suggestions = [];
    const metrics = calculateAllMetrics(allData);

    if (metrics.energia.promedio > 150) {
        suggestions.push({
            icon: '⚡',
            title: 'Optimizar consum energètic',
            description: 'El teu consum mitjà és superior a 150 kWh/dia. Considera instal·lar panells solars addicionals.',
            saving: 'Estalvi potencial: 15-20%'
        });
    }

    if (metrics.agua.promedio > 2) {
        suggestions.push({
            icon: '💧',
            title: 'Reduir consum d\'aigua',
            description: 'El teu consum d\'aigua és superior a 2 m³/dia. Instal·la sistemes de xarxa o revisa les fugues.',
            saving: 'Estalvi potencial: 10-15%'
        });
    }

    if (metrics.consumibles.promedio > 300) {
        suggestions.push({
            icon: '📄',
            title: 'Reduir consumibles d\'oficina',
            description: 'El cost mensual supera 300€. Considera la digitalització de documentos.',
            saving: 'Estalvi potencial: 20-25%'
        });
    }

    if (metrics.limpieza.promedio > 500) {
        suggestions.push({
            icon: '🧹',
            title: 'Optimizar despeses de neteja',
            description: 'El cost mensual supera 500€. Revisa els contractes.',
            saving: 'Estalvi potencial: 15-20%'
        });
    }

    suggestions.push({
        icon: '👨‍💼',
        title: 'Implementar més teletrabajo',
        description: 'Augmentant els dies de teletrabajo podríes reduir el consum entre un 10-30%.',
        saving: 'Estalvi potencial: €500-1000/mes'
    });

    suggestions.push({
        icon: '🌱',
        title: 'Programa de sostenibilitat',
        description: 'Implementa recycles, reducció de plàstics i compra eco-friendly.',
        saving: 'Estalvi potencial: 5-10%'
    });

    return suggestions.slice(0, 5);
}

function calculateReductionImpact(metricType, year = 1) {
    if (!baselineMetrics) return {};

    const strategy = REDUCTION_STRATEGIES[metricType];
    if (!strategy) return {};

    const baseline = baselineMetrics[metricType];
    const reductionPerYear = strategy.reduction / 3;
    const currentReduction = reductionPerYear * year;

    const projectedValue = baseline.promedio * 365 * (1 - currentReduction) * Math.pow(1 + INFLATION_RATE, year);

    return {
        baseline: baseline.promedio * 365,
        year1: baseline.promedio * 365 * (1 - reductionPerYear) * (1 + INFLATION_RATE),
        year2: baseline.promedio * 365 * (1 - reductionPerYear * 2) * Math.pow(1 + INFLATION_RATE, 2),
        year3: baseline.promedio * 365 * (1 - reductionPerYear * 3) * Math.pow(1 + INFLATION_RATE, 3),
        totalSavings: (baseline.promedio * 365 * currentReduction),
        percentReduction: (currentReduction * 100).toFixed(2)
    };
}

// ===== NAVEGACIÓN =====
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
    } else if (pageName === 'dataform') {
        renderDataForm();
    } else if (pageName === 'analisis') {
        renderAnalisis();
    } else if (pageName === 'reduction') {
        renderReductionStrategies();
    }
}

// ===== DASHBOARD =====
function renderDashboard() {
    const container = document.getElementById('dashboard-content');
    const allData = getAllData();
    const metrics = calculateAllMetrics(allData);

    container.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h2>📊 Dashboard Principal</h2>
                <p>Anàlisis de consumos i projeccions</p>
            </div>

            <div class="kpi-container">
                <div class="kpi-cards">
                    <div class="kpi-card energy">
                        <div class="kpi-icon">⚡</div>
                        <div class="kpi-content">
                            <h3>Consum Energètic</h3>
                            <p class="kpi-value">${formatNumber(metrics.energia.total)}</p>
                            <p class="kpi-unit">kWh</p>
                            <p class="kpi-secondary">Promig: ${formatNumber(metrics.energia.promedio)} kWh/dia</p>
                        </div>
                    </div>

                    <div class="kpi-card water">
                        <div class="kpi-icon">💧</div>
                        <div class="kpi-content">
                            <h3>Consum d'Aigua</h3>
                            <p class="kpi-value">${formatNumber(metrics.agua.total)}</p>
                            <p class="kpi-unit">m³</p>
                            <p class="kpi-secondary">Promig: ${formatNumber(metrics.agua.promedio)} m³/dia</p>
                        </div>
                    </div>

                    <div class="kpi-card consumables">
                        <div class="kpi-icon">📄</div>
                        <div class="kpi-content">
                            <h3>Consumibles</h3>
                            <p class="kpi-value">${formatNumber(metrics.consumibles.total)}</p>
                            <p class="kpi-unit">€</p>
                            <p class="kpi-secondary">Promig: ${formatNumber(metrics.consumibles.promedio)}/mes</p>
                        </div>
                    </div>

                    <div class="kpi-card cleaning">
                        <div class="kpi-icon">🧹</div>
                        <div class="kpi-content">
                            <h3>Neteja</h3>
                            <p class="kpi-value">${formatNumber(metrics.limpieza.total)}</p>
                            <p class="kpi-unit">€</p>
                            <p class="kpi-secondary">Promig: ${formatNumber(metrics.limpieza.promedio)}/mes</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-section">
                    <h3>Consum Energètic (kWh)</h3>
                    <div class="chart-wrapper">
                        <canvas id="energyChart"></canvas>
                    </div>
                </div>

                <div class="chart-section">
                    <h3>Consum d'Aigua (m³)</h3>
                    <div class="chart-wrapper">
                        <canvas id="waterChart"></canvas>
                    </div>
                </div>

                <div class="chart-section">
                    <h3>Consumibles d'Oficina (€)</h3>
                    <div class="chart-wrapper">
                        <canvas id="consumablesChart"></canvas>
                    </div>
                </div>

                <div class="chart-section">
                    <h3>Productes de Neteja (€)</h3>
                    <div class="chart-wrapper">
                        <canvas id="cleaningChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="chart-section full-width">
                <h3>🌍 CO₂ Evitat (Tones)</h3>
                <div class="chart-wrapper">
                    <canvas id="co2Chart"></canvas>
                </div>
            </div>

            <div class="chart-section full-width">
                <h3>📅 Comparativa Períodes Especials vs Promig</h3>
                <div class="chart-wrapper">
                    <canvas id="specialPeriodsChart"></canvas>
                </div>
            </div>

            <div class="suggestions-section full-width">
                <h3>💡 Sugerències d'Estalvi</h3>
                <div class="suggestions-list" id="suggestions-list"></div>
            </div>

            <div class="export-section full-width">
                <button class="btn btn-primary" onclick="exportToHTML()">📥 Exportar a HTML</button>
            </div>
        </div>
    `;

    renderEnergyChart();
    renderWaterChart();
    renderConsumablesChart();
    renderCleaningChart();
    renderCO2Chart();
    renderSpecialPeriodsChart();

    const suggestionsList = document.getElementById('suggestions-list');
    const suggestions = getSavingSuggestions(allData);
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <div class="suggestion-icon">${suggestion.icon}</div>
            <div class="suggestion-content">
                <h4>${suggestion.title}</h4>
                <p>${suggestion.description}</p>
                <span class="suggestion-saving">${suggestion.saving}</span>
            </div>
        `;
        suggestionsList.appendChild(item);
    });
}

// ===== GRÁFICOS =====
function renderEnergyChart() {
    const allData = getAllData();
    const energyData = allData.filter(d => d.tipo === 'energia' || d.source === 'original-energia');

    const byDate = {};
    energyData.forEach(item => {
        const fecha = item.fecha;
        if (!byDate[fecha]) {
            byDate[fecha] = { consumoTotal: 0, produccionSolar: 0, importadoRed: 0 };
        }
        if (item.consumo_total_kWh) byDate[fecha].consumoTotal = item.consumo_total_kWh;
        if (item.produccion_solar_kWh) byDate[fecha].produccionSolar = item.produccion_solar_kWh;
        if (item.importado_red_kWh) byDate[fecha].importadoRed = item.importado_red_kWh;
    });

    const labels = [];
    const consumoTotal = [];
    const produccionSolar = [];
    const importadoRed = [];

    Object.keys(byDate).sort().forEach(fecha => {
        labels.push(new Date(fecha).toLocaleDateString('ca-ES', { month: 'short', day: 'numeric' }));
        consumoTotal.push(byDate[fecha].consumoTotal);
        produccionSolar.push(byDate[fecha].produccionSolar);
        importadoRed.push(byDate[fecha].importadoRed);
    });

    const ctx = document.getElementById('energyChart').getContext('2d');
    allCharts.energy = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Consum Total (kWh)',
                    data: consumoTotal,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                },
                {
                    label: 'Producció Solar (kWh)',
                    data: produccionSolar,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                },
                {
                    label: 'Importat de Xarxa (kWh)',
                    data: importadoRed,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderWaterChart() {
    const allData = getAllData();
    const waterData = allData.filter(d => d.tipo === 'agua' || d.source === 'original-agua');

    const byDate = {};
    waterData.forEach(item => {
        const fecha = item.fecha;
        if (!byDate[fecha]) byDate[fecha] = 0;
        if (item.consumo_litros) byDate[fecha] += item.consumo_litros / 1000;
        else if (item.valor && item.tipo === 'agua') byDate[fecha] += item.valor;
    });

    const labels = [];
    const consumoAgua = [];

    Object.keys(byDate).sort().forEach(fecha => {
        labels.push(new Date(fecha).toLocaleDateString('ca-ES', { month: 'short', day: 'numeric' }));
        consumoAgua.push(byDate[fecha].toFixed(2));
    });

    const ctx = document.getElementById('waterChart').getContext('2d');
    allCharts.water = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Consum d\'Aigua (m³)',
                data: consumoAgua,
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1
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

function renderConsumablesChart() {
    const allData = getAllData();
    const consumablesData = allData.filter(d => d.tipo === 'consumibles' || d.source === 'original-consumibles');

    const byMonth = {};
    consumablesData.forEach(item => {
        const fecha = item.fecha || item.descripcion || 'Otro';
        if (!byMonth[fecha]) byMonth[fecha] = 0;
        if (item.coste_total_euros) byMonth[fecha] += item.coste_total_euros;
        else if (item.valor) byMonth[fecha] += item.valor;
    });

    const labels = [];
    const values = [];
    Object.keys(byMonth).slice(0, 6).forEach(fecha => {
        labels.push(fecha.substring(0, 15));
        values.push(byMonth[fecha]);
    });

    const ctx = document.getElementById('consumablesChart').getContext('2d');
    allCharts.consumables = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length > 0 ? labels : ['Sense dades'],
            datasets: [{
                data: values.length > 0 ? values : [0],
                backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'],
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

function renderCleaningChart() {
    const allData = getAllData();
    const cleaningData = allData.filter(d => d.tipo === 'limpieza' || d.source === 'original-limpieza');

    const byMonth = {};
    cleaningData.forEach(item => {
        const fecha = item.fecha || item.descripcion || 'Otro';
        if (!byMonth[fecha]) byMonth[fecha] = 0;
        if (item.coste_total_euros) byMonth[fecha] += item.coste_total_euros;
        else if (item.valor) byMonth[fecha] += item.valor;
    });

    const labels = [];
    const values = [];
    Object.keys(byMonth).forEach(fecha => {
        labels.push(fecha.substring(0, 15));
        values.push(byMonth[fecha]);
    });

    const ctx = document.getElementById('cleaningChart').getContext('2d');
    allCharts.cleaning = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length > 0 ? labels : ['Sense dades'],
            datasets: [{
                label: 'Cost Mensual (€)',
                data: values.length > 0 ? values : [0],
                backgroundColor: '#27ae60',
                borderColor: '#229954',
                borderWidth: 1
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

function renderCO2Chart() {
    const allData = getAllData();
    const co2Data = allData.filter(d => d.source === 'original-co2');

    const labels = [];
    const co2Evitat = [];
    co2Data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).forEach(item => {
        labels.push(new Date(item.fecha).toLocaleDateString('ca-ES', { month: 'short', day: 'numeric' }));
        co2Evitat.push(item.co2_evitado_t || 0);
    });

    const ctx = document.getElementById('co2Chart').getContext('2d');
    allCharts.co2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length > 0 ? labels : ['Sense dades'],
            datasets: [{
                label: 'CO₂ Evitat (Tones)',
                data: co2Evitat,
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2
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

function renderSpecialPeriodsChart() {
    const allData = getAllData();
    const metrics = calculateSpecialPeriodsMetrics(allData);
    const avgEnergy = getMonthlyAverage(allData, 'energia');
    const avgWater = getMonthlyAverage(allData, 'agua');

    const ctx = document.getElementById('specialPeriodsChart').getContext('2d');
    allCharts.specialPeriods = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Setmana Santa', 'Estiu', 'Nadal', 'Promig'],
            datasets: [
                {
                    label: 'Consum Energía (kWh)',
                    data: [
                        metrics.easterEnergy,
                        metrics.summerEnergy,
                        metrics.christmasEnergy,
                        avgEnergy
                    ],
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1
                },
                {
                    label: 'Consum Aigua (m³)',
                    data: [
                        metrics.easterWater,
                        metrics.summerWater,
                        metrics.christmasWater,
                        avgWater
                    ],
                    backgroundColor: '#2ecc71',
                    borderColor: '#27ae60',
                    borderWidth: 1
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

// ===== FORMULARIO DE ENTRADA =====
function renderDataForm() {
    const container = document.getElementById('dataform-content');

    container.innerHTML = `
        <div class="data-form-container">
            <section class="form-section">
                <h2>📝 Entrada de Dades Manual</h2>
                <form id="data-entry-form" class="form-grid">
                    <div class="form-group">
                        <label for="entrada-fecha">Data:</label>
                        <input type="date" id="entrada-fecha" required>
                    </div>

                    <div class="form-group">
                        <label for="entrada-tipo">Tipus de Consum:</label>
                        <select id="entrada-tipo" required>
                            <option value="">Seleccionar...</option>
                            <option value="energia">Energía (kWh)</option>
                            <option value="agua">Agua (Litros)</option>
                            <option value="consumibles">Consumibles (€)</option>
                            <option value="limpieza">Limpieza (€)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="entrada-valor">Valor:</label>
                        <input type="number" id="entrada-valor" step="0.01" min="0" required>
                    </div>

                    <div class="form-group">
                        <label for="entrada-descripcion">Descripció (opcional):</label>
                        <input type="text" id="entrada-descripcion" placeholder="Afegir notes...">
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="form-submit-btn">➕ Afegir Dada</button>
                        <button type="button" class="btn btn-secondary" id="form-cancel-btn" style="display:none;">❌ Cancelar</button>
                    </div>
                </form>
            </section>

            <section class="table-section">
                <h3>📋 Datos Registrados</h3>
                <div id="custom-data-table"></div>
            </section>
        </div>
    `;

    const form = document.getElementById('data-entry-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fecha = document.getElementById('entrada-fecha').value;
        const tipo = document.getElementById('entrada-tipo').value;
        const valor = parseFloat(document.getElementById('entrada-valor').value);
        const descripcion = document.getElementById('entrada-descripcion').value;

        if (!fecha || !tipo || !valor) {
            alert('Si us plau, completa els camps requerits');
            return;
        }

        const data = {
            fecha,
            tipo,
            valor,
            descripcion,
            timestamp: new Date().toISOString()
        };

        if (editingId) {
            const index = globalData.custom.findIndex(d => d.id === editingId);
            if (index !== -1) {
                globalData.custom[index] = { ...globalData.custom[index], ...data };
                editingId = null;
                document.getElementById('form-cancel-btn').style.display = 'none';
                document.getElementById('form-submit-btn').textContent = '➕ Afegir Dada';
            }
        } else {
            globalData.custom.push({
                ...data,
                id: `custom_${Date.now()}_${Math.random()}`
            });
        }

        saveCustomDataToStorage();
        form.reset();
        renderDataTable();
    });

    document.getElementById('form-cancel-btn').addEventListener('click', () => {
        editingId = null;
        form.reset();
        document.getElementById('form-cancel-btn').style.display = 'none';
        document.getElementById('form-submit-btn').textContent = '➕ Afegir Dada';
    });

    renderDataTable();
}

function renderDataTable() {
    const customData = getCustomData();
    const tableContainer = document.getElementById('custom-data-table');

    if (customData.length === 0) {
        tableContainer.innerHTML = '<p class="no-data">No hi ha dades registrades. Comença a afegir-ne!</p>';
        return;
    }

    const consumptionTypes = {
        energia: 'Energía (kWh)',
        agua: 'Agua (Litros)',
        consumibles: 'Consumibles (€)',
        limpieza: 'Limpieza (€)'
    };

    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tipus</th>
                    <th>Valor</th>
                    <th>Descripció</th>
                    <th>Accions</th>
                </tr>
            </thead>
            <tbody>
    `;

    customData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(item => {
        const typeLabel = consumptionTypes[item.tipo] || item.tipo;
        html += `
            <tr>
                <td>${formatDate(item.fecha)}</td>
                <td>${typeLabel}</td>
                <td>${item.valor.toFixed(2)}</td>
                <td>${item.descripcion || '-'}</td>
                <td>
                    <button class="btn-icon" onclick="editData('${item.id}')" title="Editar">✏️</button>
                    <button class="btn-icon" onclick="deleteData('${item.id}')" title="Eliminar">🗑️</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = html;
}

function editData(id) {
    const item = globalData.custom.find(d => d.id === id);
    if (!item) return;

    document.getElementById('entrada-fecha').value = item.fecha;
    document.getElementById('entrada-tipo').value = item.tipo;
    document.getElementById('entrada-valor').value = item.valor;
    document.getElementById('entrada-descripcion').value = item.descripcion || '';

    editingId = id;
    document.getElementById('form-cancel-btn').style.display = 'inline-block';
    document.getElementById('form-submit-btn').textContent = '💾 Guardar Canvis';

    document.getElementById('data-entry-form').scrollIntoView({ behavior: 'smooth' });
}

function deleteData(id) {
    if (confirm('Estàs segur que vols eliminar aquesta dada?')) {
        globalData.custom = globalData.custom.filter(d => d.id !== id);
        saveCustomDataToStorage();
        renderDataTable();
    }
}

// ===== ANÁLISIS DETALLADO =====
function renderAnalisis() {
    const container = document.getElementById('analisis-content');
    const allData = getAllData();
    const metrics = calculateAllMetrics(allData);
    const projections = getProjections(metrics);

    let html = `
        <div class="analysis-container">
            <div class="analysis-header">
                <h2>📈 Anàlisis Detallat dels 8 Càlculs</h2>
                <p>Desglossament complet dels consumos i projeccions per període</p>
            </div>

            <div class="metrics-detailed">
                <div class="metric-card-detailed">
                    <h4>⚡ Energía - Año Completo</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Consumo Anual</span>
                            <span class="value">${formatNumber(metrics.energia.total)} kWh</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promedio Diario</span>
                            <span class="value">${formatNumber(metrics.energia.promedio)} kWh</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Proyección 2026</span>
                            <span class="value highlight">${formatNumber(projections.energia.yearProjection)} kWh</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>⚡ Energía - Período Escolar (Sept-Jun)</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Consumo Período</span>
                            <span class="value">${formatNumber(metrics.energia.totalEscolar)} kWh</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promedio Diario</span>
                            <span class="value">${formatNumber(metrics.energia.promedioEscolar)} kWh</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">% vs Año Completo</span>
                            <span class="value highlight">${metrics.energia.total > 0 ? ((metrics.energia.totalEscolar / metrics.energia.total) * 100).toFixed(1) : 0}%</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>💧 Agua - Año Completo</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Consumo Anual</span>
                            <span class="value">${formatNumber(metrics.agua.total)} m³</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promedio Diario</span>
                            <span class="value">${formatNumber(metrics.agua.promedio)} m³</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Proyección 2026</span>
                            <span class="value highlight">${formatNumber(projections.agua.yearProjection)} m³</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>💧 Agua - Período Escolar (Sept-Jun)</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Consumo Período</span>
                            <span class="value">${formatNumber(metrics.agua.totalEscolar)} m³</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promedio Diario</span>
                            <span class="value">${formatNumber(metrics.agua.promedioEscolar)} m³</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">% vs Año Completo</span>
                            <span class="value highlight">${metrics.agua.total > 0 ? ((metrics.agua.totalEscolar / metrics.agua.total) * 100).toFixed(1) : 0}%</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>📄 Consumibles - Año Completo</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Gasto Anual</span>
                            <span class="value">${formatNumber(projections.consumibles.yearProjection)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promedio Mensual</span>
                            <span class="value">${formatNumber(projections.consumibles.yearProjection / 12)} €</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>📄 Consumibles - Período Escolar (Sept-Jun)</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Gasto Período</span>
                            <span class="value">${formatNumber(metrics.consumibles.totalEscolar)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promedio Mensual</span>
                            <span class="value">${formatNumber(metrics.consumibles.promedioEscolar)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">% vs Año Completo</span>
                            <span class="value highlight">${metrics.consumibles.total > 0 ? ((metrics.consumibles.totalEscolar / metrics.consumibles.total) * 100).toFixed(1) : 0}%</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>🧹 Limpieza - Año Completo</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Gasto Anual</span>
                            <span class="value">${formatNumber(projections.limpieza.yearProjection)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promedio Mensual</span>
                            <span class="value">${formatNumber(projections.limpieza.yearProjection / 12)} €</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card-detailed">
                    <h4>🧹 Limpieza - Período Escolar (Sept-Jun)</h4>
                    <div class="metric-values">
                        <div class="metric-value">
                            <span class="label">Gasto Período</span>
                            <span class="value">${formatNumber(metrics.limpieza.totalEscolar)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">Promedio Mensual</span>
                            <span class="value">${formatNumber(metrics.limpieza.promedioEscolar)} €</span>
                        </div>
                        <div class="metric-value">
                            <span class="label">% vs Año Completo</span>
                            <span class="value highlight">${metrics.limpieza.total > 0 ? ((metrics.limpieza.totalEscolar / metrics.limpieza.total) * 100).toFixed(1) : 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="comparison-table-section">
                <h3>Comparativa Año Escolar vs Año Completo</h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Tipo Consumo</th>
                            <th>Año Escolar (Sept-Jun)</th>
                            <th>Año Completo</th>
                            <th>Diferencia</th>
                            <th>% Variación</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>⚡ Energía (kWh)</td>
                            <td>${formatNumber(metrics.energia.totalEscolar)} kWh</td>
                            <td>${formatNumber(metrics.energia.total)} kWh</td>
                            <td>${formatNumber(metrics.energia.total - metrics.energia.totalEscolar)} kWh</td>
                            <td>${metrics.energia.totalEscolar !== 0 ? (((metrics.energia.total - metrics.energia.totalEscolar) / metrics.energia.totalEscolar) * 100).toFixed(2) : 0}%</td>
                        </tr>
                        <tr>
                            <td>💧 Agua (m³)</td>
                            <td>${formatNumber(metrics.agua.totalEscolar)} m³</td>
                            <td>${formatNumber(metrics.agua.total)} m³</td>
                            <td>${formatNumber(metrics.agua.total - metrics.agua.totalEscolar)} m³</td>
                            <td>${metrics.agua.totalEscolar !== 0 ? (((metrics.agua.total - metrics.agua.totalEscolar) / metrics.agua.totalEscolar) * 100).toFixed(2) : 0}%</td>
                        </tr>
                        <tr>
                            <td>📄 Consumibles (€)</td>
                            <td>${formatNumber(metrics.consumibles.totalEscolar)} €</td>
                            <td>${formatNumber(metrics.consumibles.total)} €</td>
                            <td>${formatNumber(metrics.consumibles.total - metrics.consumibles.totalEscolar)} €</td>
                            <td>${metrics.consumibles.totalEscolar !== 0 ? (((metrics.consumibles.total - metrics.consumibles.totalEscolar) / metrics.consumibles.totalEscolar) * 100).toFixed(2) : 0}%</td>
                        </tr>
                        <tr>
                            <td>🧹 Limpieza (€)</td>
                            <td>${formatNumber(metrics.limpieza.totalEscolar)} €</td>
                            <td>${formatNumber(metrics.limpieza.total)} €</td>
                            <td>${formatNumber(metrics.limpieza.total - metrics.limpieza.totalEscolar)} €</td>
                            <td>${metrics.limpieza.totalEscolar !== 0 ? (((metrics.limpieza.total - metrics.limpieza.totalEscolar) / metrics.limpieza.totalEscolar) * 100).toFixed(2) : 0}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="projections-section">
                <h3>🔮 Proyecciones a Futuro (con inflación del 3%)</h3>
                <p class="note">Basadas en datos históricos y factor de inflación acumulativo</p>
                <table class="projection-table">
                    <thead>
                        <tr>
                            <th>Año</th>
                            <th>Energía (kWh)</th>
                            <th>Agua (m³)</th>
                            <th>Consumibles (€)</th>
                            <th>Limpieza (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2026 (Actual)</td>
                            <td>${formatNumber(projections.energia.yearProjection)}</td>
                            <td>${formatNumber(projections.agua.yearProjection)}</td>
                            <td>${formatNumber(projections.consumibles.yearProjection)}</td>
                            <td>${formatNumber(projections.limpieza.yearProjection)}</td>
                        </tr>
                        <tr>
                            <td>2027 (+3%)</td>
                            <td>${formatNumber(projections.energia.year2Projection)}</td>
                            <td>${formatNumber(projections.agua.year2Projection)}</td>
                            <td>${formatNumber(projections.consumibles.year2Projection)}</td>
                            <td>${formatNumber(projections.limpieza.year2Projection)}</td>
                        </tr>
                        <tr>
                            <td>2028 (+3% de 2027)</td>
                            <td>${formatNumber(projections.energia.year3Projection)}</td>
                            <td>${formatNumber(projections.agua.year3Projection)}</td>
                            <td>${formatNumber(projections.consumibles.year3Projection)}</td>
                            <td>${formatNumber(projections.limpieza.year3Projection)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ===== ESTRATEGIAS DE REDUCCIÓN =====
function renderReductionStrategies() {
    const container = document.getElementById('reduction-content');

    let html = `
        <div class="reduction-container">
            <div class="reduction-header">
                <h2>🌱 Estratègies de Reducció de Consum (30% en 3 anys)</h2>
                <p>Accions concretes per aconseguir un estalvi del 30% en les emissions i costos</p>
            </div>
    `;

    Object.keys(REDUCTION_STRATEGIES).forEach(metricType => {
        const strategy = REDUCTION_STRATEGIES[metricType];
        const impact = calculateReductionImpact(metricType, 3);

        html += `
            <div class="strategy-section">
                <div class="strategy-header">
                    <h3>${strategy.icon} ${strategy.name}</h3>
                    <div class="strategy-goal">
                        <span class="goal-badge">Objectiu: Reducció del 30% en 3 anys</span>
                    </div>
                </div>

                <div class="strategy-metrics">
                    <div class="metric-box">
                        <div class="metric-label">Baseline (2026)</div>
                        <div class="metric-value-large">${formatNumber(impact.baseline)}</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">Any 1 (2027)</div>
                        <div class="metric-value-large">${formatNumber(impact.year1)}</div>
                        <div class="metric-subtitle">-${((impact.baseline - impact.year1) / impact.baseline * 100).toFixed(1)}%</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">Any 2 (2028)</div>
                        <div class="metric-value-large">${formatNumber(impact.year2)}</div>
                        <div class="metric-subtitle">-${((impact.baseline - impact.year2) / impact.baseline * 100).toFixed(1)}%</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">Any 3 (2029)</div>
                        <div class="metric-value-large">${formatNumber(impact.year3)}</div>
                        <div class="metric-subtitle">-${((impact.baseline - impact.year3) / impact.baseline * 100).toFixed(1)}%</div>
                    </div>
                </div>

                <div class="actions-grid">
        `;

        strategy.actions.forEach((action, idx) => {
            html += `
                <div class="action-card">
                    <div class="action-number">Acció ${idx + 1}</div>
                    <h4>${action.title}</h4>
                    <p class="action-description">${action.description}</p>

                    <div class="action-details">
                        <div class="detail-row">
                            <span class="detail-label">Impacte estimat:</span>
                            <span class="detail-value">${(action.impact * 100).toFixed(1)}%</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Cronograma:</span>
                            <span class="detail-value">${action.timeline}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Cost:</span>
                            <span class="detail-value cost-${action.cost.toLowerCase()}">${action.cost}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Indicador:</span>
                            <span class="detail-value">${action.measurable}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>

                <div class="circular-economy-section">
                    <h4>🔄 Princips d'Economia Circular</h4>
                    <ul class="circular-list">
                        <li><strong>Reduir:</strong> Minimitzar la quantitat de recursos consumits</li>
                        <li><strong>Reutilitzar:</strong> Donar una segona vida als productes</li>
                        <li><strong>Reciclar:</strong> Processar materials per crear nous productes</li>
                        <li><strong>Recuperar:</strong> Obtenir energia o materials de residus</li>
                    </ul>
                </div>

                <div class="results-summary">
                    <h4>📊 Resultats Esperats</h4>
                    <div class="summary-box">
                        <div class="summary-row">
                            <span>Estalvi total en 3 anys:</span>
                            <span class="summary-value">${formatNumber(impact.totalSavings * 3)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Reducció percentual acumulada:</span>
                            <span class="summary-value highlight">${impact.percentReduction}%</span>
                        </div>
                        <div class="summary-row">
                            <span>Impacte ambiental:</span>
                            <span class="summary-value">Reducció significativa de CO₂</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
            <div class="timeline-section">
                <h3>📅 Cronograma d'Implementació (3 anys)</h3>
                <div class="timeline">
                    <div class="timeline-phase">
                        <h4>Fase 1: Mesos 1-3 (Q1 2027)</h4>
                        <p><strong>Accions ràpides i de baix cost:</strong></p>
                        <ul>
                            <li>Auditoría de recursos i consumos</li>
                            <li>Capacitació de personal</li>
                            <li>Instal·lació de dispositius de baixa inversió</li>
                            <li>Inici de digitalització</li>
                        </ul>
                    </div>

                    <div class="timeline-phase">
                        <h4>Fase 2: Mesos 4-12 (Q2-Q4 2027)</h4>
                        <p><strong>Implementació de mitjana complexitat:</strong></p>
                        <ul>
                            <li>Instal·lació de sistemes automàtics</li>
                            <li>Actualització de equipament</li>
                            <li>Establiment de controls mensuals</li>
                            <li>Campanyes de sensibilització</li>
                        </ul>
                    </div>

                    <div class="timeline-phase">
                        <h4>Fase 3: Anys 2-3 (2028-2029)</h4>
                        <p><strong>Optimització i manteniment:</strong></p>
                        <ul>
                            <li>Millores contínues baseades en dades</li>
                            <li>Certificacions de sostenibilitat</li>
                            <li>Ampliació de les millores provades</li>
                            <li>Evaluació d'impacte final</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="export-section full-width" style="margin-top: 40px;">
                <button class="btn btn-primary" onclick="exportReductionPlan()">📥 Exportar Pla de Reducció</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function exportReductionPlan() {
    const allData = getAllData();
    const metrics = calculateAllMetrics(allData);

    const html = `
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pla de Reducció de Consum</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        h1 { color: #2c3e50; margin-bottom: 10px; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; margin-bottom: 20px; }
        h3 { color: #7f8c8d; margin-top: 20px; margin-bottom: 15px; }
        .section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3498db; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; text-align: left; border: 1px solid #bdc3c7; }
        th { background-color: #3498db; color: white; }
        tr:nth-child(even) { background-color: #ecf0f1; }
        .objective { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 15px; border-radius: 4px; }
        .action-item { background: white; padding: 15px; border-left: 4px solid #f39c12; margin-bottom: 10px; border-radius: 4px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
        .metric-item { background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-label { font-size: 12px; color: #7f8c8d; text-transform: uppercase; margin-bottom: 5px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .footer { margin-top: 50px; text-align: center; color: #95a5a6; font-size: 12px; border-top: 1px solid #bdc3c7; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌱 Pla de Reducció de Consum - 30% en 3 Anos</h1>
        <p>Data de generació: ${new Date().toLocaleDateString('ca-ES')}</p>

        <h2>📊 Situació Basal (2026)</h2>

        <h3>⚡ Energía</h3>
        <div class="section">
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-label">Consum Anual</div>
                    <div class="metric-value">${formatNumber(metrics.energia.promedio * 365)} kWh</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Cost Estimat</div>
                    <div class="metric-value">€${formatNumber(metrics.energia.promedio * 365 * 0.25)}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">CO₂ Emissions</div>
                    <div class="metric-value">${formatNumber(metrics.energia.promedio * 365 * 0.294 / 1000)} T</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Objectiu 3 Anys</div>
                    <div class="metric-value">-30%</div>
                </div>
            </div>
        </div>

        <h3>💧 Agua</h3>
        <div class="section">
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-label">Consum Anual</div>
                    <div class="metric-value">${formatNumber(metrics.agua.promedio * 365)} m³</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Cost Estimat</div>
                    <div class="metric-value">€${formatNumber(metrics.agua.promedio * 365 * 2.50)}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Litres/Dia</div>
                    <div class="metric-value">${formatNumber(metrics.agua.promedio * 1000)} L</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Objectiu 3 Anys</div>
                    <div class="metric-value">-30%</div>
                </div>
            </div>
        </div>

        <h2>🎯 Estratègies de Reducció</h2>

        <h3>⚡ Energía Elèctrica</h3>
        <div class="objective">
            <strong>Objectiu Mesurable:</strong> Reduir el consum de kWh un 30% en 3 anys mitjançant eficiència energètica
        </div>
        <div class="section">
            <p><strong>Accions Concretes:</strong></p>
            <div class="action-item">
                <strong>1. Instal·lació de LED eficients (Mes 1-3)</strong>
                <p>Canviar tota la iluminació a LED. Impacte: 8% de reducció.</p>
                <p>Cost: Alt | Indicador: kWh/mes</p>
            </div>
            <div class="action-item">
                <strong>2. Sistema de control automàtic (Mes 4-6)</strong>
                <p>Sensorsde presència i luz natural. Impacte: 7% de reducció.</p>
                <p>Cost: Mitjà | Indicador: Hores de luz</p>
            </div>
            <div class="action-item">
                <strong>3. Optimització HVAC (Mes 7-12)</strong>
                <p>Manteniment preventiu i programació inteligent. Impacte: 10% de reducció.</p>
                <p>Cost: Mitjà | Indicador: Temperatura controlada</p>
            </div>
            <div class="action-item">
                <strong>4. Auditoría i Formació (Mes 1)</strong>
                <p>Identificar consumos anòmals i concienciar. Impacte: 5% de reducció.</p>
                <p>Cost: Baix | Indicador: Comportaments mejorats</p>
            </div>
        </div>

        <h3>💧 Agua</h3>
        <div class="objective">
            <strong>Objectiu Mesurable:</strong> Reduir el consum d'água un 30% en 3 anys
        </div>
        <div class="section">
            <p><strong>Accions Concretes:</strong></p>
            <div class="action-item">
                <strong>1. Grifos de bajo flujo (Mes 1-3)</strong>
                <p>Aireadores que reducen 30-50% del consum. Impacte: 12%.</p>
                <p>Cost: Baix | Indicador: Litres/dia</p>
            </div>
            <div class="action-item">
                <strong>2. Reparació de fugues (Mes 1)</strong>
                <p>Revision trimestral i reparació. Impacte: 8%.</p>
                <p>Cost: Baix | Indicador: Fugues reparades</p>
            </div>
            <div class="action-item">
                <strong>3. Riego inteligent (Mes 4-6)</strong>
                <p>Sensor de humedad i riego automàtic. Impacte: 7%.</p>
                <p>Cost: Mitjà | Indicador: Agua optimitzada</p>
            </div>
            <div class="action-item">
                <strong>4. Reutilització d'aigues grises (Mes 13-24)</strong>
                <p>Sistemes de reutilització. Impacte: 3%.</p>
                <p>Cost: Alt | Indicador: Litres reutilitzats</p>
            </div>
        </div>

        <h3>📄 Consumibles d'Oficina</h3>
        <div class="objective">
            <strong>Objectiu Mesurable:</strong> Reduir el cost i impacte dels consumibles un 30% en 3 anys
        </div>
        <div class="section">
            <p><strong>Accions Concretes:</strong></p>
            <div class="action-item">
                <strong>1. Digitalització de processos (Mes 1-6)</strong>
                <p>Transit a documents digitals. Impacte: 15%.</p>
            </div>
            <div class="action-item">
                <strong>2. Paper reciclat (Mes 1)</strong>
                <p>Uso exclusivo de papel certificat. Impacte: 8%.</p>
            </div>
            <div class="action-item">
                <strong>3. Optimització d'inventaris (Mes 2-4)</strong>
                <p>Control de existencies. Impacte: 5%.</p>
            </div>
            <div class="action-item">
                <strong>4. Programes de reutilització (Mes 1)</strong>
                <p>Recuperació de material. Impacte: 2%.</p>
            </div>
        </div>

        <h3>🧹 Productes de Limpieza</h3>
        <div class="objective">
            <strong>Objectiu Mesurable:</strong> Reduir cost i impacte ambiental dels productes de neteja un 30% en 3 anys
        </div>
        <div class="section">
            <p><strong>Acciones Concretes:</strong></p>
            <div class="action-item">
                <strong>1. Productes ecològics (Mes 1-3)</strong>
                <p>Substitución per biodegradables. Impacte: 10%.</p>
            </div>
            <div class="action-item">
                <strong>2. Microfiber i tècniques en sec (Mes 2-4)</strong>
                <p>Reducció d'agua i químics. Impacte: 8%.</p>
            </div>
            <div class="action-item">
                <strong>3. Formació de personal (Mes 1)</strong>
                <p>Tècniques eficients. Impacte: 7%.</p>
            </div>
            <div class="action-item">
                <strong>4. Compra a granel (Mes 3-6)</strong>
                <p>Reducció d'envases. Impacte: 5%.</p>
            </div>
        </div>

        <h2>🔄 Principis d'Economia Circular</h2>
        <div class="section">
            <ul style="margin-left: 20px;">
                <li><strong>Reduir:</strong> Minimitzar recursos consumits des de l'origen</li>
                <li><strong>Reutilitzar:</strong> Donar segona vida als productes</li>
                <li><strong>Reciclar:</strong> Processar materials per crear nous productes</li>
                <li><strong>Recuperar:</strong> Obtenir energia o materials de residus</li>
            </ul>
        </div>

        <h2>📅 Cronograma</h2>
        <table>
            <thead>
                <tr>
                    <th>Periode</th>
                    <th>Accions Principals</th>
                    <th>Resultat Esperat</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Fase 1 (Q1 2027)</strong></td>
                    <td>Auditoría, Capacitació, Dispositius de baix cost</td>
                    <td>10% de reducció inicial</td>
                </tr>
                <tr>
                    <td><strong>Fase 2 (Q2-Q4 2027)</strong></td>
                    <td>Sistemes automàtics, Equipament, Controls</td>
                    <td>20% de reducció acumulada</td>
                </tr>
                <tr>
                    <td><strong>Fase 3 (2028-2029)</strong></td>
                    <td>Millores contínues, Certificacions, Avaluació</td>
                    <td>30% de reducció acumulada</td>
                </tr>
            </tbody>
        </table>

        <h2>💰 Estimació d'Estalvis</h2>
        <div class="section">
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-label">Estalvi Anual (Any 3)</div>
                    <div class="metric-value">30% reducció</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Inversion Inicial</div>
                    <div class="metric-value">Mitjana-Alta</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">ROI Estimat</div>
                    <div class="metric-value">2-3 anys</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Impacte CO₂</div>
                    <div class="metric-value">Reducció 30%</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>&copy; 2026 Calculadora d'Estalvi Energètic - Pla Sostenibilitat</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pla-reducció-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    alert('Pla de reducció exportat correctament!');
}

// ===== EXPORTAR A HTML (ORIGINAL) =====
function exportToHTML() {
    const allData = getAllData();
    const metrics = calculateAllMetrics(allData);
    const projections = getProjections(metrics);

    const html = `
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe Calculadora d'Estalvi Energètic</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        h1 { color: #2c3e50; margin-bottom: 10px; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; margin-bottom: 20px; }
        h3 { color: #7f8c8d; margin-top: 20px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; text-align: left; border: 1px solid #bdc3c7; }
        th { background-color: #3498db; color: white; }
        tr:nth-child(even) { background-color: #ecf0f1; }
        .metric-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3498db; }
        .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
        .metric-item { background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-label { font-size: 12px; color: #7f8c8d; text-transform: uppercase; margin-bottom: 5px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .footer { margin-top: 50px; text-align: center; color: #95a5a6; font-size: 12px; border-top: 1px solid #bdc3c7; padding-top: 20px; }
        .projection-warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚡ Informe Calculadora d'Estalvi Energètic</h1>
        <p>Data de generació: ${new Date().toLocaleDateString('ca-ES')}</p>

        <h2>📊 Resum Executiu</h2>

        <h3>Energía</h3>
        <div class="metric-section">
            <div class="metric-grid">
                <div class="metric-item">
                    <div class="metric-label">Total Consumit</div>
                    <div class="metric-value">${formatNumber(metrics.energia.total)} kWh</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Promedio Diari</div>
                    <div class="metric-value">${formatNumber(metrics.energia.promedio)} kWh</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Proyección 2026</div>
                    <div class="metric-value">${formatNumber(projections.energia.yearProjection)} kWh</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Año Escolar</div>
                    <div class="metric-value">${formatNumber(metrics.energia.totalEscolar)} kWh</div>
                </div>
            </div>
        </div>

        <h3>Agua</h3>
        <div class="metric-section">
            <div class="metric-grid">
                <div class="metric-item">
                    <div class="metric-label">Total Consumit</div>
                    <div class="metric-value">${formatNumber(metrics.agua.total)} m³</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Promedio Diari</div>
                    <div class="metric-value">${formatNumber(metrics.agua.promedio)} m³</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Proyección 2026</div>
                    <div class="metric-value">${formatNumber(projections.agua.yearProjection)} m³</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Año Escolar</div>
                    <div class="metric-value">${formatNumber(metrics.agua.totalEscolar)} m³</div>
                </div>
            </div>
        </div>

        <h3>Consumibles d'Oficina</h3>
        <div class="metric-section">
            <div class="metric-grid">
                <div class="metric-item">
                    <div class="metric-label">Total Gastat</div>
                    <div class="metric-value">${formatNumber(projections.consumibles.yearProjection)} €</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Promedio Mensual</div>
                    <div class="metric-value">${formatNumber(projections.consumibles.yearProjection / 12)} €</div>
                </div>
            </div>
        </div>

        <h3>Productes de Neteja</h3>
        <div class="metric-section">
            <div class="metric-grid">
                <div class="metric-item">
                    <div class="metric-label">Total Gastat</div>
                    <div class="metric-value">${formatNumber(projections.limpieza.yearProjection)} €</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Promedio Mensual</div>
                    <div class="metric-value">${formatNumber(projections.limpieza.yearProjection / 12)} €</div>
                </div>
            </div>
        </div>

        <h2>🔮 Proyecciones Futuras (con Inflación del 3%)</h2>
        <div class="projection-warning">
            <strong>Nota:</strong> Las proyecciones se basan en datos históricos con un factor de inflación acumulativo del 3% anual.
        </div>
        <table>
            <thead>
                <tr>
                    <th>Año</th>
                    <th>Energía (kWh)</th>
                    <th>Agua (m³)</th>
                    <th>Consumibles (€)</th>
                    <th>Limpieza (€)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2026 (Actual)</td>
                    <td>${formatNumber(projections.energia.yearProjection)}</td>
                    <td>${formatNumber(projections.agua.yearProjection)}</td>
                    <td>${formatNumber(projections.consumibles.yearProjection)}</td>
                    <td>${formatNumber(projections.limpieza.yearProjection)}</td>
                </tr>
                <tr>
                    <td>2027 (+3%)</td>
                    <td>${formatNumber(projections.energia.year2Projection)}</td>
                    <td>${formatNumber(projections.agua.year2Projection)}</td>
                    <td>${formatNumber(projections.consumibles.year2Projection)}</td>
                    <td>${formatNumber(projections.limpieza.year2Projection)}</td>
                </tr>
                <tr>
                    <td>2028 (+3% de 2027)</td>
                    <td>${formatNumber(projections.energia.year3Projection)}</td>
                    <td>${formatNumber(projections.agua.year3Projection)}</td>
                    <td>${formatNumber(projections.consumibles.year3Projection)}</td>
                    <td>${formatNumber(projections.limpieza.year3Projection)}</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            <p>&copy; 2026 Calculadora d'Estalvi Energètic</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculadora-estalvi-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    alert('Informe exportat correctament!');
}
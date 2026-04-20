// ===== CONSTANTES Y CONFIGURACIÓN =====
const INFLATION_RATE = 0.03;
const MONTHLY_FACTORS = [1.0, 0.95, 0.9, 0.8, 0.8, 0.9, 0.1, 0.05, 0.9, 1.0, 1.0, 0.7];
const SCHOOL_YEAR_START = { month: 9, day: 1 };
const SCHOOL_YEAR_END = { month: 6, day: 30 };

// Colores para gráficos
const COLORS = {
    energia: '#3498db',
    agua: '#2ecc71',
    consumibles: '#f39c12',
    limpieza: '#e74c3c',
    co2: '#27ae60',
    solar: '#f1c40f',
    red: '#e67e22'
};

// Estrategias de reducción de consumo (30% en 3 años)
const REDUCTION_STRATEGIES = {
    energia: {
        name: 'Energía Eléctrica',
        icon: '⚡',
        unit: 'kWh',
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
        unit: 'm³',
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
        unit: '€',
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
        unit: '€',
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

// ===== FUNCIONES UTILITARIAS =====
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

function calculateReductionProjections(metrics) {
    const reductionPerYear = 0.30 / 3; // 10% por año

    return {
        energia: {
            baseline: metrics.energia.promedio * 365,
            year1: (metrics.energia.promedio * 365) * (1 - reductionPerYear) * (1 + INFLATION_RATE),
            year2: (metrics.energia.promedio * 365) * (1 - reductionPerYear * 2) * Math.pow(1 + INFLATION_RATE, 2),
            year3: (metrics.energia.promedio * 365) * (1 - reductionPerYear * 3) * Math.pow(1 + INFLATION_RATE, 3),
            unit: 'kWh'
        },
        agua: {
            baseline: metrics.agua.promedio * 365,
            year1: (metrics.agua.promedio * 365) * (1 - reductionPerYear) * (1 + INFLATION_RATE),
            year2: (metrics.agua.promedio * 365) * (1 - reductionPerYear * 2) * Math.pow(1 + INFLATION_RATE, 2),
            year3: (metrics.agua.promedio * 365) * (1 - reductionPerYear * 3) * Math.pow(1 + INFLATION_RATE, 3),
            unit: 'm³'
        },
        consumibles: {
            baseline: metrics.consumibles.promedio * 12,
            year1: (metrics.consumibles.promedio * 12) * (1 - reductionPerYear) * (1 + INFLATION_RATE),
            year2: (metrics.consumibles.promedio * 12) * (1 - reductionPerYear * 2) * Math.pow(1 + INFLATION_RATE, 2),
            year3: (metrics.consumibles.promedio * 12) * (1 - reductionPerYear * 3) * Math.pow(1 + INFLATION_RATE, 3),
            unit: '€'
        },
        limpieza: {
            baseline: metrics.limpieza.promedio * 12,
            year1: (metrics.limpieza.promedio * 12) * (1 - reductionPerYear) * (1 + INFLATION_RATE),
            year2: (metrics.limpieza.promedio * 12) * (1 - reductionPerYear * 2) * Math.pow(1 + INFLATION_RATE, 2),
            year3: (metrics.limpieza.promedio * 12) * (1 - reductionPerYear * 3) * Math.pow(1 + INFLATION_RATE, 3),
            unit: '€'
        }
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
        icon: '🌱',
        title: 'Aplicar estratègies de reducció',
        description: 'Aplica les accions proposades per aconseguir una reducció del 30% en 3 anys.',
        saving: 'Estalvi potencial: €€€'
    });

    return suggestions.slice(0, 5);
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
    } else if (pageName === 'analisis') {
        renderAnalisis();
    } else if (pageName === 'reduction') {
        renderReductionCalculator();
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
                    <h3>⚡ Consum Energètic (kWh)</h3>
                    <div class="chart-wrapper">
                        <canvas id="energyChart"></canvas>
                    </div>
                </div>

                <div class="chart-section">
                    <h3>💧 Consum d'Aigua (m³)</h3>
                    <div class="chart-wrapper">
                        <canvas id="waterChart"></canvas>
                    </div>
                </div>

                <div class="chart-section">
                    <h3>📄 Consumibles d'Oficina (€)</h3>
                    <div class="chart-wrapper">
                        <canvas id="consumablesChart"></canvas>
                    </div>
                </div>

                <div class="chart-section">
                    <h3>🧹 Productes de Neteja (€)</h3>
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
                <h3>📅 Comparativa Períodes Especials vs Promig - Energía</h3>
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
                    borderColor: COLORS.energia,
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: COLORS.energia,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Producció Solar (kWh)',
                    data: produccionSolar,
                    borderColor: COLORS.solar,
                    backgroundColor: 'rgba(241, 196, 15, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: COLORS.solar,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Importat de Xarxa (kWh)',
                    data: importadoRed,
                    borderColor: COLORS.red,
                    backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: COLORS.red,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true, font: { size: 12, weight: '600' } } },
                filler: { propagate: true }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'kWh' } }
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
                backgroundColor: COLORS.agua,
                borderColor: '#27ae60',
                borderWidth: 2,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 12, weight: '600' } } } },
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
                backgroundColor: [COLORS.energia, COLORS.agua, COLORS.consumibles, COLORS.limpieza, COLORS.co2, '#95a5a6'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 12, weight: '600' } } } }
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
                backgroundColor: COLORS.limpieza,
                borderColor: '#c0392b',
                borderWidth: 2,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 12, weight: '600' } } } },
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
                borderColor: COLORS.co2,
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointBackgroundColor: COLORS.co2,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 12, weight: '600' } } } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderSpecialPeriodsChart() {
    const allData = getAllData();
    const metrics = calculateSpecialPeriodsMetrics(allData);
    const avgEnergy = getMonthlyAverage(allData, 'energia');

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
                    backgroundColor: COLORS.energia,
                    borderColor: '#2980b9',
                    borderWidth: 2,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 12, weight: '600' } } } },
            scales: { y: { beginAtZero: true } }
        }
    });
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

// ===== CALCULADORA DE REDUCCIÓN =====
function renderReductionCalculator() {
    const container = document.getElementById('reduction-content');
    const metrics = baselineMetrics;
    const reductionProjections = calculateReductionProjections(metrics);

    let html = `
        <div class="reduction-container">
            <div class="reduction-header">
                <h2>🌱 Calculadora de Reducció del 30% en 3 Anys</h2>
                <p>Visualitza com es reduirien els gastos aplicant les estratègies proposades</p>
            </div>

            <div class="reduction-content">
    `;

    Object.keys(REDUCTION_STRATEGIES).forEach(metricType => {
        const strategy = REDUCTION_STRATEGIES[metricType];
        const projection = reductionProjections[metricType];

        html += `
            <div class="strategy-card">
                <div class="strategy-card-header">
                    <h3>${strategy.icon} ${strategy.name}</h3>
                    <span class="reduction-badge">30% Reducció en 3 anys</span>
                </div>

                <div class="projection-metrics">
                    <div class="metric-projection">
                        <div class="metric-label">Baseline 2026</div>
                        <div class="metric-value">${formatNumber(projection.baseline)} ${projection.unit}</div>
                        <div class="metric-bar baseline"></div>
                    </div>

                    <div class="metric-projection">
                        <div class="metric-label">Año 1 (2027)</div>
                        <div class="metric-value">${formatNumber(projection.year1)} ${projection.unit}</div>
                        <div class="metric-bar year1" style="width: ${(projection.year1 / projection.baseline) * 100}%"></div>
                        <div class="metric-reduction">-${(((projection.baseline - projection.year1) / projection.baseline) * 100).toFixed(1)}%</div>
                    </div>

                    <div class="metric-projection">
                        <div class="metric-label">Año 2 (2028)</div>
                        <div class="metric-value">${formatNumber(projection.year2)} ${projection.unit}</div>
                        <div class="metric-bar year2" style="width: ${(projection.year2 / projection.baseline) * 100}%"></div>
                        <div class="metric-reduction">-${(((projection.baseline - projection.year2) / projection.baseline) * 100).toFixed(1)}%</div>
                    </div>

                    <div class="metric-projection">
                        <div class="metric-label">Año 3 (2029)</div>
                        <div class="metric-value">${formatNumber(projection.year3)} ${projection.unit}</div>
                        <div class="metric-bar year3" style="width: ${(projection.year3 / projection.baseline) * 100}%"></div>
                        <div class="metric-reduction">-${(((projection.baseline - projection.year3) / projection.baseline) * 100).toFixed(1)}%</div>
                    </div>
                </div>

                <div class="actions-list">
                    <h4>Acciones Propuestas:</h4>
        `;

        strategy.actions.forEach((action, idx) => {
            html += `
                <div class="action-item">
                    <span class="action-number">${idx + 1}</span>
                    <div class="action-details-box">
                        <strong>${action.title}</strong>
                        <p>${action.description}</p>
                        <div class="action-meta">
                            <span class="meta-item">Impacte: ${(action.impact * 100).toFixed(1)}%</span>
                            <span class="meta-item">Timeline: ${action.timeline}</span>
                            <span class="meta-item cost-${action.cost.toLowerCase()}">Cost: ${action.cost}</span>
                        </div>
                    </div>
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
        `;
    });

    html += `
            </div>

            <div class="export-section full-width" style="margin-top: 40px;">
                <button class="btn btn-primary" onclick="exportReductionCalculator()">📥 Exportar Calculadora de Reducció</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ===== EXPORTAR =====
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

function exportReductionCalculator() {
    const metrics = baselineMetrics;
    const reductionProjections = calculateReductionProjections(metrics);

    const html = `
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculadora de Reducció</title>
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
        .section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3498db; }
        .footer { margin-top: 50px; text-align: center; color: #95a5a6; font-size: 12px; border-top: 1px solid #bdc3c7; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌱 Calculadora de Reducció del 30% en 3 Anys</h1>
        <p>Data de generació: ${new Date().toLocaleDateString('ca-ES')}</p>

        <h2>📊 Proyecciones con Reducción</h2>

        <h3>⚡ Energía</h3>
        <div class="section">
            <table>
                <thead>
                    <tr><th>Año</th><th>Consum (kWh)</th><th>Reducció</th></tr>
                </thead>
                <tbody>
                    <tr><td>Baseline 2026</td><td>${formatNumber(reductionProjections.energia.baseline)}</td><td>-</td></tr>
                    <tr><td>Año 1 (2027)</td><td>${formatNumber(reductionProjections.energia.year1)}</td><td>-${(((reductionProjections.energia.baseline - reductionProjections.energia.year1) / reductionProjections.energia.baseline) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Año 2 (2028)</td><td>${formatNumber(reductionProjections.energia.year2)}</td><td>-${(((reductionProjections.energia.baseline - reductionProjections.energia.year2) / reductionProjections.energia.baseline) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Año 3 (2029)</td><td>${formatNumber(reductionProjections.energia.year3)}</td><td>-${(((reductionProjections.energia.baseline - reductionProjections.energia.year3) / reductionProjections.energia.baseline) * 100).toFixed(1)}%</td></tr>
                </tbody>
            </table>
        </div>

        <h3>💧 Agua</h3>
        <div class="section">
            <table>
                <thead>
                    <tr><th>Año</th><th>Consum (m³)</th><th>Reducció</th></tr>
                </thead>
                <tbody>
                    <tr><td>Baseline 2026</td><td>${formatNumber(reductionProjections.agua.baseline)}</td><td>-</td></tr>
                    <tr><td>Año 1 (2027)</td><td>${formatNumber(reductionProjections.agua.year1)}</td><td>-${(((reductionProjections.agua.baseline - reductionProjections.agua.year1) / reductionProjections.agua.baseline) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Año 2 (2028)</td><td>${formatNumber(reductionProjections.agua.year2)}</td><td>-${(((reductionProjections.agua.baseline - reductionProjections.agua.year2) / reductionProjections.agua.baseline) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Año 3 (2029)</td><td>${formatNumber(reductionProjections.agua.year3)}</td><td>-${(((reductionProjections.agua.baseline - reductionProjections.agua.year3) / reductionProjections.agua.baseline) * 100).toFixed(1)}%</td></tr>
                </tbody>
            </table>
        </div>

        <h3>📄 Consumibles d'Oficina</h3>
        <div class="section">
            <table>
                <thead>
                    <tr><th>Año</th><th>Gasto (€)</th><th>Reducció</th></tr>
                </thead>
                <tbody>
                    <tr><td>Baseline 2026</td><td>${formatNumber(reductionProjections.consumibles.baseline)}</td><td>-</td></tr>
                    <tr><td>Año 1 (2027)</td><td>${formatNumber(reductionProjections.consumibles.year1)}</td><td>-${(((reductionProjections.consumibles.baseline - reductionProjections.consumibles.year1) / reductionProjections.consumibles.baseline) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Año 2 (2028)</td><td>${formatNumber(reductionProjections.consumibles.year2)}</td><td>-${(((reductionProjections.consumibles.baseline - reductionProjections.consumibles.year2) / reductionProjections.consumibles.baseline) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Año 3 (2029)</td><td>${formatNumber(reductionProjections.consumibles.year3)}</td><td>-${(((reductionProjections.consumibles.baseline - reductionProjections.consumibles.year3) / reductionProjections.consumibles.baseline) * 100).toFixed(1)}%</td></tr>
                </tbody>
            </table>
        </div>

        <h3>🧹 Productes de Neteja</h3>
        <div class="section">
            <table>
                <thead>
                    <tr><th>Año</th><th>Gasto (€)</th><th>Reducció</th></tr>
                </thead>
                <tbody>
                    <tr><td>Baseline 2026</td><td>${formatNumber(reductionProjections.limpieza.baseline)}</td><td>-</td></tr>
                    <tr><td>Año 1 (2027)</td><td>${formatNumber(reductionProjections.limpieza.year1)}</td><td>-${(((reductionProjections.limpieza.baseline - reductionProjections.limpieza.year1) / reductionProjections.limpieza.baseline) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Año 2 (2028)</td><td>${formatNumber(reductionProjections.limpieza.year2)}</td><td>-${(((reductionProjections.limpieza.baseline - reductionProjections.limpieza.year2) / reductionProjections.limpieza.baseline) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Año 3 (2029)</td><td>${formatNumber(reductionProjections.limpieza.year3)}</td><td>-${(((reductionProjections.limpieza.baseline - reductionProjections.limpieza.year3) / reductionProjections.limpieza.baseline) * 100).toFixed(1)}%</td></tr>
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>&copy; 2026 Calculadora d'Estalvi Energètic - Pla de Reducció</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculadora-reducció-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    alert('Calculadora de reducció exportada correctament!');
}
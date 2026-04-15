import { isSchoolYear } from '../utils/dateUtils.js';

let globalData = {
    original: [],
    custom: []
};

export async function initializeData() {
    try {
        const response = await fetch('./sample-data.json');
        const data = await response.json();

        // Parsear datos originales
        parseOriginalData(data);

        // Cargar datos custom del localStorage
        loadCustomDataFromStorage();
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

function parseOriginalData(data) {
    // Energía
    if (data.Consumo_Energetico_TIC) {
        data.Consumo_Energetico_TIC.forEach(item => {
            globalData.original.push({
                ...item,
                tipo: 'energia',
                source: 'original-energia'
            });
        });
    }

    // CO2
    if (data.Emisiones_CO2_Evitadas) {
        data.Emisiones_CO2_Evitadas.forEach(item => {
            globalData.original.push({
                ...item,
                source: 'original-co2'
            });
        });
    }

    // Agua
    if (data.Impacto_Indirecto_Instalaciones?.agua) {
        data.Impacto_Indirecto_Instalaciones.agua.forEach(item => {
            globalData.original.push({
                ...item,
                tipo: 'agua',
                source: 'original-agua'
            });
        });
    }

    // Consumibles
    if (data.Consumibles_Impresion) {
        data.Consumibles_Impresion.forEach(item => {
            globalData.original.push({
                ...item,
                tipo: 'consumibles',
                source: 'original-consumibles'
            });
        });
    }

    // Limpieza y mantenimiento
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

export function getAllData() {
    return [...globalData.original, ...globalData.custom];
}

export function getCustomData() {
    return globalData.custom;
}

export function addCustomData(data) {
    const newData = {
        ...data,
        id: `custom_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toISOString()
    };

    globalData.custom.push(newData);
    saveCustomDataToStorage();

    return newData;
}

export function updateCustomData(id, newData) {
    const index = globalData.custom.findIndex(d => d.id === id);
    if (index !== -1) {
        globalData.custom[index] = {
            ...globalData.custom[index],
            ...newData,
            updatedAt: new Date().toISOString()
        };
        saveCustomDataToStorage();
    }
}

export function deleteCustomData(id) {
    globalData.custom = globalData.custom.filter(d => d.id !== id);
    saveCustomDataToStorage();
}

export function getSchoolYearData() {
    return getAllData().filter(d => isSchoolYear(new Date(d.fecha)));
}

export function getFullYearData() {
    return getAllData();
}

export function getMonthlyComparison() {
    const data = getAllData();
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
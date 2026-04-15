import { getAllData } from '../../modules/dataManager.js';
import { calculateEnergyMetrics } from '../../modules/calculators.js';

class EnergyChart {
    constructor() {
        this.chartInstance = null;
    }

    render(container) {
        const allData = getAllData();
        const chartData = this.prepareChartData(allData);

        const canvas = document.createElement('canvas');
        canvas.id = 'energyChart';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Consum Total (kWh)',
                        data: chartData.consumoTotal,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    },
                    {
                        label: 'Producció Solar (kWh)',
                        data: chartData.produccionSolar,
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    },
                    {
                        label: 'Importat de Xarxa (kWh)',
                        data: chartData.importadoRed,
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
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 15, usePointStyle: true }
                    },
                    title: {
                        display: true,
                        text: 'Evolució del Consum Energètic'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'kWh' }
                    }
                }
            }
        });
    }

    prepareChartData(allData) {
        const energyData = allData.filter(d => d.tipo === 'energia' || d.source === 'original-energia');
        const labels = [];
        const consumoTotal = [];
        const produccionSolar = [];
        const importadoRed = [];

        // Agrupar por fecha
        const byDate = {};
        energyData.forEach(item => {
            const fecha = item.fecha;
            if (!byDate[fecha]) {
                byDate[fecha] = {
                    consumoTotal: 0,
                    produccionSolar: 0,
                    importadoRed: 0
                };
            }

            if (item.consumo_total_kWh) {
                byDate[fecha].consumoTotal = item.consumo_total_kWh;
            }
            if (item.produccion_solar_kWh) {
                byDate[fecha].produccionSolar = item.produccion_solar_kWh;
            }
            if (item.importado_red_kWh) {
                byDate[fecha].importadoRed = item.importado_red_kWh;
            }
        });

        // Ordenar y llenar arrays
        Object.keys(byDate).sort().forEach(fecha => {
            labels.push(new Date(fecha).toLocaleDateString('ca-ES', { month: 'short', day: 'numeric' }));
            consumoTotal.push(byDate[fecha].consumoTotal);
            produccionSolar.push(byDate[fecha].produccionSolar);
            importadoRed.push(byDate[fecha].importadoRed);
        });

        return { labels, consumoTotal, produccionSolar, importadoRed };
    }
}

export default EnergyChart;
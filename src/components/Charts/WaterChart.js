import { getAllData } from '../../modules/dataManager.js';

class WaterChart {
    constructor() {
        this.chartInstance = null;
    }

    render(container) {
        const allData = getAllData();
        const chartData = this.prepareChartData(allData);

        const canvas = document.createElement('canvas');
        canvas.id = 'waterChart';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Consum d\'Aigua (m³)',
                        data: chartData.consumoAgua,
                        backgroundColor: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'm³' }
                    }
                }
            }
        });
    }

    prepareChartData(allData) {
        const waterData = allData.filter(d => d.tipo === 'agua' || d.source === 'original-agua');
        const labels = [];
        const consumoAgua = [];

        const byDate = {};
        waterData.forEach(item => {
            const fecha = item.fecha;
            if (!byDate[fecha]) {
                byDate[fecha] = 0;
            }

            // Convertir litros a m³
            if (item.consumo_litros) {
                byDate[fecha] += item.consumo_litros / 1000;
            } else if (item.valor && item.tipo === 'agua') {
                byDate[fecha] += item.valor; // Si ya está en m³
            }
        });

        Object.keys(byDate).sort().forEach(fecha => {
            labels.push(new Date(fecha).toLocaleDateString('ca-ES', { month: 'short', day: 'numeric' }));
            consumoAgua.push(byDate[fecha].toFixed(2));
        });

        return { labels, consumoAgua };
    }
}

export default WaterChart;
import { getAllData } from '../../modules/dataManager.js';

class ConsumablesChart {
    constructor() {
        this.chartInstance = null;
    }

    render(container) {
        const allData = getAllData();
        const chartData = this.prepareChartData(allData);

        const canvas = document.createElement('canvas');
        canvas.id = 'consumablesChart';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        this.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        data: chartData.values,
                        backgroundColor: [
                            '#3498db',
                            '#2ecc71',
                            '#f39c12',
                            '#e74c3c',
                            '#9b59b6',
                            '#1abc9c'
                        ],
                        borderColor: '#fff',
                        borderWidth: 2
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
                }
            }
        });
    }

    prepareChartData(allData) {
        const consumablesData = allData.filter(d => d.tipo === 'consumibles' || d.source === 'original-consumibles');
        const labels = [];
        const values = [];

        // Agrupar por mes/proveedor
        const byMonth = {};
        consumablesData.forEach(item => {
            const fecha = item.fecha || item.descripcion || 'Otro';
            if (!byMonth[fecha]) {
                byMonth[fecha] = 0;
            }

            if (item.coste_total_euros) {
                byMonth[fecha] += item.coste_total_euros;
            } else if (item.valor) {
                byMonth[fecha] += item.valor;
            }
        });

        Object.keys(byMonth).slice(0, 6).forEach(fecha => {
            labels.push(fecha.substring(0, 15)); // Truncar descripción
            values.push(byMonth[fecha]);
        });

        return { labels: labels.length > 0 ? labels : ['Sense dades'], values: values.length > 0 ? values : [0] };
    }
}

export default ConsumablesChart;
import { getAllData } from '../../modules/dataManager.js';

class CleaningChart {
    constructor() {
        this.chartInstance = null;
    }

    render(container) {
        const allData = getAllData();
        const chartData = this.prepareChartData(allData);

        const canvas = document.createElement('canvas');
        canvas.id = 'cleaningChart';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Cost Mensual (€)',
                        data: chartData.values,
                        backgroundColor: '#27ae60',
                        borderColor: '#229954',
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
                        title: { display: true, text: '€' }
                    }
                }
            }
        });
    }

    prepareChartData(allData) {
        const cleaningData = allData.filter(d => d.tipo === 'limpieza' || d.source === 'original-limpieza');
        const labels = [];
        const values = [];

        const byMonth = {};
        cleaningData.forEach(item => {
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

        Object.keys(byMonth).forEach(fecha => {
            labels.push(fecha.substring(0, 15));
            values.push(byMonth[fecha]);
        });

        return { labels: labels.length > 0 ? labels : ['Sense dades'], values: values.length > 0 ? values : [0] };
    }
}

export default CleaningChart;
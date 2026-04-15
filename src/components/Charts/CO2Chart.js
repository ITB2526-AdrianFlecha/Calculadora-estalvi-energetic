import { getAllData } from '../../modules/dataManager.js';

class CO2Chart {
    constructor() {
        this.chartInstance = null;
    }

    render(container) {
        const allData = getAllData();
        const chartData = this.prepareChartData(allData);

        const canvas = document.createElement('canvas');
        canvas.id = 'co2Chart';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'CO₂ Evitat (Tones)',
                        data: chartData.co2Evitat,
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
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
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Tones de CO₂' }
                    }
                }
            }
        });
    }

    prepareChartData(allData) {
        const co2Data = allData.filter(d => d.source === 'original-co2');
        const labels = [];
        const co2Evitat = [];

        co2Data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).forEach(item => {
            labels.push(new Date(item.fecha).toLocaleDateString('ca-ES', { month: 'short', day: 'numeric' }));
            co2Evitat.push(item.co2_evitado_t || 0);
        });

        return { labels: labels.length > 0 ? labels : ['Sense dades'], co2Evitat };
    }
}

export default CO2Chart;
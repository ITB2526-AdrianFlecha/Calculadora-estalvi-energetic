import { calculateSpecialPeriodsMetrics, getMonthlyAverage } from '../../modules/calculators.js';
import { getAllData } from '../../modules/dataManager.js';

class SpecialPeriodsChart {
    constructor() {
        this.chartInstance = null;
    }

    render(container) {
        const allData = getAllData();
        const chartData = this.prepareChartData(allData);

        const canvas = document.createElement('canvas');
        canvas.id = 'specialPeriodsChart';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Consum Energía (kWh)',
                        data: chartData.energia,
                        backgroundColor: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 1
                    },
                    {
                        label: 'Consum Aigua (m³)',
                        data: chartData.agua,
                        backgroundColor: '#2ecc71',
                        borderColor: '#27ae60',
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
                        beginAtZero: true
                    }
                }
            }
        });
    }

    prepareChartData(allData) {
        const metrics = calculateSpecialPeriodsMetrics(allData);
        const avgEnergy = getMonthlyAverage(allData, 'energia');
        const avgWater = getMonthlyAverage(allData, 'agua');

        return {
            labels: ['Setmana Santa', 'Estiu', 'Nadal', 'Promig'],
            energia: [
                metrics.easterEnergy,
                metrics.summerEnergy,
                metrics.christmasEnergy,
                avgEnergy
            ],
            agua: [
                metrics.easterWater,
                metrics.summerWater,
                metrics.christmasWater,
                avgWater
            ]
        };
    }
}

export default SpecialPeriodsChart;
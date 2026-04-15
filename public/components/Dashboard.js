import EnergyChart from './Charts/EnergyChart.js';
import WaterChart from './Charts/WaterChart.js';
import ConsumablesChart from './Charts/ConsumablesChart.js';
import CleaningChart from './Charts/CleaningChart.js';
import KPICards from './Charts/KPICards.js';
import CO2Chart from './Charts/CO2Chart.js';
import SpecialPeriodsChart from './Charts/SpecialPeriodsChart.js';
import Export from './Export.js';
import { getSavingSuggestions } from '../modules/calculators.js';
import { getAllData } from '../modules/dataManager.js';

class Dashboard {
    render(container) {
        const allData = getAllData();

        // Crear estructura del dashboard
        const dashboard = document.createElement('div');
        dashboard.className = 'dashboard';

        // Título y botón export
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <div class="header-content">
                <h2>📊 Dashboard Principal</h2>
                <p>Anàlisis de consumos i projeccions</p>
            </div>
        `;
        dashboard.appendChild(header);

        // KPI Cards
        const kpiContainer = document.createElement('div');
        kpiContainer.className = 'kpi-container';
        const kpiCards = new KPICards();
        kpiCards.render(kpiContainer);
        dashboard.appendChild(kpiContainer);

        // Gráficos principales
        const chartsContainer = document.createElement('div');
        chartsContainer.className = 'charts-grid';

        // Energy Chart
        const energySection = this.createChartSection('Consum Energètic (kWh)', 'energy');
        const energyChart = new EnergyChart();
        energyChart.render(energySection);
        chartsContainer.appendChild(energySection);

        // Water Chart
        const waterSection = this.createChartSection('Consum d\'Aigua (m³)', 'water');
        const waterChart = new WaterChart();
        waterChart.render(waterSection);
        chartsContainer.appendChild(waterSection);

        // Consumables Chart
        const consumablesSection = this.createChartSection('Consumibles d\'Oficina (€)', 'consumables');
        const consumablesChart = new ConsumablesChart();
        consumablesChart.render(consumablesSection);
        chartsContainer.appendChild(consumablesSection);

        // Cleaning Chart
        const cleaningSection = this.createChartSection('Productes de Neteja (€)', 'cleaning');
        const cleaningChart = new CleaningChart();
        cleaningChart.render(cleaningSection);
        chartsContainer.appendChild(cleaningSection);

        dashboard.appendChild(chartsContainer);

        // CO2 Chart
        const co2Section = document.createElement('div');
        co2Section.className = 'chart-section full-width';
        co2Section.innerHTML = '<h3>🌍 CO₂ Evitat (Tones)</h3>';
        const co2Container = document.createElement('div');
        co2Container.className = 'chart-wrapper';
        co2Section.appendChild(co2Container);
        const co2Chart = new CO2Chart();
        co2Chart.render(co2Container);
        dashboard.appendChild(co2Section);

        // Special Periods Comparison
        const specialSection = document.createElement('div');
        specialSection.className = 'chart-section full-width';
        specialSection.innerHTML = '<h3>📅 Comparativa Períodes Especials vs Promig</h3>';
        const specialContainer = document.createElement('div');
        specialContainer.className = 'chart-wrapper';
        specialSection.appendChild(specialContainer);
        const specialChart = new SpecialPeriodsChart();
        specialChart.render(specialContainer);
        dashboard.appendChild(specialSection);

        // Sugerencias de ahorro
        const suggestionsSection = document.createElement('div');
        suggestionsSection.className = 'suggestions-section full-width';
        suggestionsSection.innerHTML = '<h3>💡 Sugerències d\'Estalvi</h3>';
        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'suggestions-list';

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

        suggestionsSection.appendChild(suggestionsList);
        dashboard.appendChild(suggestionsSection);

        // Export Button
        const exportSection = document.createElement('div');
        exportSection.className = 'export-section full-width';
        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn btn-primary';
        exportBtn.textContent = '📥 Exportar a HTML';
        exportBtn.addEventListener('click', () => {
            const exporter = new Export();
            exporter.exportToHTML();
        });
        exportSection.appendChild(exportBtn);
        dashboard.appendChild(exportSection);

        container.appendChild(dashboard);
    }

    createChartSection(title, type) {
        const section = document.createElement('div');
        section.className = 'chart-section';
        section.innerHTML = `<h3>${title}</h3>`;
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-wrapper';
        section.appendChild(wrapper);
        return section;
    }
}

export default Dashboard;
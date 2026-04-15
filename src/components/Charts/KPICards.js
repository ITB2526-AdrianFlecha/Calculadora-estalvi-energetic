import { calculateAllMetrics } from '../../modules/calculators.js';
import { getAllData } from '../../modules/dataManager.js';
import { formatNumber } from '../../utils/formatters.js';

class KPICards {
    render(container) {
        const allData = getAllData();
        const metrics = calculateAllMetrics(allData);

        const cardsHTML = `
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
        `;

        container.innerHTML = cardsHTML;
    }
}

export default KPICards;
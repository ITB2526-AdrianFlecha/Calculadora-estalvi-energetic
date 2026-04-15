import { calculateAllMetrics, getMonthlyComparison, getSchoolYearData, getFullYearData, getProjections } from '../modules/calculators.js';
import { getAllData } from '../modules/dataManager.js';
import { formatNumber } from '../utils/formatters.js';

class AnalisisDetallat {
    render(container) {
        const allData = getAllData();
        const metrics = calculateAllMetrics(allData);
        const projections = getProjections(metrics);

        const analysis = document.createElement('div');
        analysis.className = 'analysis-container';

        // Título
        const header = document.createElement('div');
        header.className = 'analysis-header';
        header.innerHTML = `
            <h2>📈 Anàlisis Detallat</h2>
            <p>Desglossament complet dels consumos i projeccions</p>
        `;
        analysis.appendChild(header);

        // Métriques por tipo de consum
        const metricsContainer = document.createElement('div');
        metricsContainer.className = 'metrics-detailed';

        // Energía
        metricsContainer.appendChild(this.createMetricCard(
            '⚡ Energía',
            metrics.energia,
            projections.energia,
            'kWh'
        ));

        // Agua
        metricsContainer.appendChild(this.createMetricCard(
            '💧 Agua',
            metrics.agua,
            projections.agua,
            'm³'
        ));

        // Consumibles
        metricsContainer.appendChild(this.createMetricCard(
            '📄 Consumibles d\'Oficina',
            metrics.consumibles,
            projections.consumibles,
            '€'
        ));

        // Limpieza
        metricsContainer.appendChild(this.createMetricCard(
            '🧹 Productes de Neteja',
            metrics.limpieza,
            projections.limpieza,
            '€'
        ));

        analysis.appendChild(metricsContainer);

        // Tabla comparativa
        const comparisonTable = document.createElement('div');
        comparisonTable.className = 'comparison-table-section';
        comparisonTable.innerHTML = `
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
                    ${this.getComparisonRows(metrics)}
                </tbody>
            </table>
        `;
        analysis.appendChild(comparisonTable);

        // Proyecciones
        const projectionsSection = document.createElement('div');
        projectionsSection.className = 'projections-section';
        projectionsSection.innerHTML = `
            <h3>🔮 Proyecciones a Futuro (con inflación del 3%)</h3>
            <p class="note">Basadas en datos históricos y factor de inflación acumulativo</p>
        `;

        const projectionTable = document.createElement('table');
        projectionTable.className = 'projection-table';
        projectionTable.innerHTML = `
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
                    <td>2027 (+3% inflación)</td>
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
        `;
        projectionTable.appendChild(projectionTable);
        projectionsSection.appendChild(projectionTable);
        analysis.appendChild(projectionsSection);

        container.appendChild(analysis);
    }

    createMetricCard(title, currentMetrics, projectionMetrics, unit) {
        const card = document.createElement('div');
        card.className = 'metric-card-detailed';

        card.innerHTML = `
            <h4>${title}</h4>
            <div class="metric-values">
                <div class="metric-value">
                    <span class="label">Total Actual</span>
                    <span class="value">${formatNumber(currentMetrics.total)} ${unit}</span>
                </div>
                <div class="metric-value">
                    <span class="label">Promedio Diario</span>
                    <span class="value">${formatNumber(currentMetrics.promedio)} ${unit}</span>
                </div>
                <div class="metric-value">
                    <span class="label">Proyección Año 2026</span>
                    <span class="value highlight">${formatNumber(projectionMetrics.yearProjection)} ${unit}</span>
                </div>
                <div class="metric-value">
                    <span class="label">Proyección Año 2027</span>
                    <span class="value">${formatNumber(projectionMetrics.year2Projection)} ${unit}</span>
                </div>
            </div>
        `;

        return card;
    }

    getComparisonRows(metrics) {
        const comparisons = [
            {
                name: '⚡ Energía (kWh)',
                escolar: metrics.energia.totalEscolar,
                completo: metrics.energia.total,
                unit: 'kWh'
            },
            {
                name: '💧 Agua (m³)',
                escolar: metrics.agua.totalEscolar,
                completo: metrics.agua.total,
                unit: 'm³'
            },
            {
                name: '📄 Consumibles (€)',
                escolar: metrics.consumibles.totalEscolar,
                completo: metrics.consumibles.total,
                unit: '€'
            },
            {
                name: '🧹 Limpieza (€)',
                escolar: metrics.limpieza.totalEscolar,
                completo: metrics.limpieza.total,
                unit: '€'
            }
        ];

        return comparisons.map(comp => {
            const diferencia = comp.completo - comp.escolar;
            const variacion = comp.escolar !== 0 ? ((diferencia / comp.escolar) * 100).toFixed(2) : 0;

            return `
                <tr>
                    <td>${comp.name}</td>
                    <td>${formatNumber(comp.escolar)} ${comp.unit}</td>
                    <td>${formatNumber(comp.completo)} ${comp.unit}</td>
                    <td>${formatNumber(diferencia)} ${comp.unit}</td>
                    <td>${variacion > 0 ? '+' : ''}${variacion}%</td>
                </tr>
            `;
        }).join('');
    }
}

export default AnalisisDetallat;
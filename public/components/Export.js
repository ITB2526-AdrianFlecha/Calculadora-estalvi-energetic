import { getAllData } from '../modules/dataManager.js';
import { calculateAllMetrics, getProjections } from '../modules/calculators.js';
import { formatNumber, formatDate } from '../utils/formatters.js';

class Export {
    exportToHTML() {
        const allData = getAllData();
        const metrics = calculateAllMetrics(allData);
        const projections = getProjections(metrics);

        const html = this.generateHTMLReport(metrics, projections, allData);

        // Crear blob y descargar
        const blob = new Blob([html], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calculadora-estalvi-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        alert('Informe exportat correctament!');
    }

    generateHTMLReport(metrics, projections, allData) {
        return `
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe Calculadora d'Estalvi Energètic</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        h1 { color: #2c3e50; margin-bottom: 10px; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; margin-bottom: 20px; }
        h3 { color: #7f8c8d; margin-top: 20px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; text-align: left; border: 1px solid #bdc3c7; }
        th { background-color: #3498db; color: white; }
        tr:nth-child(even) { background-color: #ecf0f1; }
        .metric-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3498db; }
        .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
        .metric-item { background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-label { font-size: 12px; color: #7f8c8d; text-transform: uppercase; margin-bottom: 5px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .footer { margin-top: 50px; text-align: center; color: #95a5a6; font-size: 12px; border-top: 1px solid #bdc3c7; padding-top: 20px; }
        .projection-warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
        page-break { page-break-after: always; }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚡ Informe Calculadora d'Estalvi Energètic</h1>
        <p>Data de generació: ${new Date().toLocaleDateString('ca-ES')}</p>

        <h2>📊 Resum Executiu</h2>

        <h3>Energía</h3>
        <div class="metric-section">
            <div class="metric-grid">
                <div class="metric-item">
                    <div class="metric-label">Total Consumit</div>
                    <div class="metric-value">${formatNumber(metrics.energia.total)} kWh</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Promedio Diari</div>
                    <div class="metric-value">${formatNumber(metrics.energia.promedio)} kWh</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Proyección 2026</div>
                    <div class="metric-value">${formatNumber(projections.energia.yearProjection)} kWh</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Año Escolar</div>
                    <div class="metric-value">${formatNumber(metrics.energia.totalEscolar)} kWh</div>
                </div>
            </div>
        </div>

        <h3>Agua</h3>
        <div class="metric-section">
            <div class="metric-grid">
                <div class="metric-item">
                    <div class="metric-label">Total Consumit</div>
                    <div class="metric-value">${formatNumber(metrics.agua.total)} m³</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Promedio Diari</div>
                    <div class="metric-value">${formatNumber(metrics.agua.promedio)} m³</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Proyección 2026</div>
                    <div class="metric-value">${formatNumber(projections.agua.yearProjection)} m³</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Año Escolar</div>
                    <div class="metric-value">${formatNumber(metrics.agua.totalEscolar)} m³</div>
                </div>
            </div>
        </div>

        <h3>Consumibles d'Oficina</h3>
        <div class="metric-section">
            <div class="metric-grid">
                <div class="metric-item">
                    <div class="metric-label">Total Gastat</div>
                    <div class="metric-value">${formatNumber(projections.consumibles.yearProjection)} €</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Promedio Mensual</div>
                    <div class="metric-value">${formatNumber(projections.consumibles.yearProjection / 12)} €</div>
                </div>
            </div>
        </div>

        <h3>Productes de Neteja</h3>
        <div class="metric-section">
            <div class="metric-grid">
                <div class="metric-item">
                    <div class="metric-label">Total Gastat</div>
                    <div class="metric-value">${formatNumber(projections.limpieza.yearProjection)} €</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Promedio Mensual</div>
                    <div class="metric-value">${formatNumber(projections.limpieza.yearProjection / 12)} €</div>
                </div>
            </div>
        </div>

        <h2>🔮 Proyecciones Futuras (con Inflación del 3%)</h2>
        <div class="projection-warning">
            <strong>Nota:</strong> Las proyecciones se basan en datos históricos con un factor de inflación acumulativo del 3% anual.
        </div>
        <table>
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
                    <td>2027 (+3%)</td>
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
        </table>

        <div class="footer">
            <p>&copy; 2026 Calculadora d'Estalvi Energètic</p>
        </div>
    </div>
</body>
</html>
        `;
    }
}

export default Export;
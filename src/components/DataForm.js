import { addCustomData, deleteCustomData, getCustomData, updateCustomData } from '../modules/dataManager.js';
import { formatDate, parseDate } from '../utils/dateUtils.js';

class DataForm {
    constructor() {
        this.consumptionTypes = [
            { value: 'energia', label: 'Energía (kWh)' },
            { value: 'agua', label: 'Agua (Litros)' },
            { value: 'consumibles', label: 'Consumibles (€)' },
            { value: 'limpieza', label: 'Limpieza (€)' }
        ];
        this.editingId = null;
    }

    render(container) {
        const dataForm = document.createElement('div');
        dataForm.className = 'data-form-container';

        // Formulario
        const formSection = document.createElement('section');
        formSection.className = 'form-section';
        formSection.innerHTML = this.getFormHTML();
        dataForm.appendChild(formSection);

        // Tabla de datos
        const tableSection = document.createElement('section');
        tableSection.className = 'table-section';
        tableSection.innerHTML = `
            <h3>📋 Datos Registrados</h3>
            <div id="custom-data-table"></div>
        `;
        dataForm.appendChild(tableSection);

        container.appendChild(dataForm);

        // Attach event listeners
        this.setupEventListeners();
        this.renderDataTable();
    }

    getFormHTML() {
        return `
            <h2>📝 Entrada de Dades Manual</h2>
            <form id="data-entry-form" class="form-grid">
                <div class="form-group">
                    <label for="entrada-fecha">Data:</label>
                    <input type="date" id="entrada-fecha" required>
                </div>

                <div class="form-group">
                    <label for="entrada-tipo">Tipus de Consum:</label>
                    <select id="entrada-tipo" required>
                        <option value="">Seleccionar...</option>
                        ${this.consumptionTypes.map(type =>
                            `<option value="${type.value}">${type.label}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label for="entrada-valor">Valor:</label>
                    <input type="number" id="entrada-valor" step="0.01" min="0" required>
                </div>

                <div class="form-group">
                    <label for="entrada-descripcion">Descripció (opcional):</label>
                    <input type="text" id="entrada-descripcion" placeholder="Afegir notes...">
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="form-submit-btn">➕ Afegir Dada</button>
                    <button type="button" class="btn btn-secondary" id="form-cancel-btn" style="display:none;">❌ Cancelar</button>
                </div>
            </form>
        `;
    }

    setupEventListeners() {
        const form = document.getElementById('data-entry-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Botó cancelar
        document.getElementById('form-cancel-btn').addEventListener('click', () => {
            this.editingId = null;
            form.reset();
            document.getElementById('form-cancel-btn').style.display = 'none';
            document.getElementById('form-submit-btn').textContent = '➕ Afegir Dada';
        });
    }

    handleFormSubmit() {
        const fecha = document.getElementById('entrada-fecha').value;
        const tipo = document.getElementById('entrada-tipo').value;
        const valor = parseFloat(document.getElementById('entrada-valor').value);
        const descripcion = document.getElementById('entrada-descripcion').value;

        if (!fecha || !tipo || !valor) {
            alert('Si us plau, completa els camps requerits');
            return;
        }

        const data = {
            fecha,
            tipo,
            valor,
            descripcion,
            timestamp: new Date().toISOString()
        };

        if (this.editingId) {
            updateCustomData(this.editingId, data);
            this.editingId = null;
            document.getElementById('form-cancel-btn').style.display = 'none';
            document.getElementById('form-submit-btn').textContent = '➕ Afegir Dada';
        } else {
            addCustomData(data);
        }

        document.getElementById('data-entry-form').reset();
        this.renderDataTable();
    }

    renderDataTable() {
        const customData = getCustomData();
        const tableContainer = document.getElementById('custom-data-table');

        if (customData.length === 0) {
            tableContainer.innerHTML = '<p class="no-data">No hi ha dades registrades. Comença a afegir-ne!</p>';
            return;
        }

        let html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Tipus</th>
                        <th>Valor</th>
                        <th>Descripció</th>
                        <th>Accions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        customData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(item => {
            const typeLabel = this.consumptionTypes.find(t => t.value === item.tipo)?.label || item.tipo;
            html += `
                <tr>
                    <td>${formatDate(item.fecha)}</td>
                    <td>${typeLabel}</td>
                    <td>${item.valor.toFixed(2)}</td>
                    <td>${item.descripcion || '-'}</td>
                    <td>
                        <button class="btn-icon" data-id="${item.id}" data-action="edit" title="Editar">✏️</button>
                        <button class="btn-icon" data-id="${item.id}" data-action="delete" title="Eliminar">🗑️</button>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = html;

        // Attach event listeners para editar y eliminar
        tableContainer.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const action = e.target.dataset.action;

                if (action === 'edit') {
                    this.editData(id);
                } else if (action === 'delete') {
                    if (confirm('Estàs segur que vols eliminar aquesta dada?')) {
                        deleteCustomData(id);
                        this.renderDataTable();
                    }
                }
            });
        });
    }

    editData(id) {
        const customData = getCustomData();
        const item = customData.find(d => d.id === id);

        if (!item) return;

        // Pobllar formulari amb dades
        document.getElementById('entrada-fecha').value = item.fecha;
        document.getElementById('entrada-tipo').value = item.tipo;
        document.getElementById('entrada-valor').value = item.valor;
        document.getElementById('entrada-descripcion').value = item.descripcion || '';

        // Canviar mode a edició
        this.editingId = id;
        document.getElementById('form-cancel-btn').style.display = 'inline-block';
        document.getElementById('form-submit-btn').textContent = '💾 Guardar Canvis';

        // Scroll a formulari
        document.getElementById('data-entry-form').scrollIntoView({ behavior: 'smooth' });
    }
}

export default DataForm;
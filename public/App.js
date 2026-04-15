import Dashboard from './components/Dashboard.js';
import DataForm from './components/DataForm.js';
import AnalisisDetallat from './components/AnalisisDetallat.js';
import { initializeData } from './modules/dataManager.js';

class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.components = {};
        this.init();
    }

    async init() {
        // Inicialitzar dades
        await initializeData();

        // Crear components
        this.components.dashboard = new Dashboard();
        this.components.dataForm = new DataForm();
        this.components.analisis = new AnalisisDetallat();

        // Setup navegació
        this.setupNavigation();

        // Renderizar pàgina inicial
        this.renderPage('dashboard');
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.target.dataset.page;
                this.renderPage(page);
            });
        });
    }

    renderPage(pageName) {
        // Amagar totes les pàgines
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Mostrar pàgina seleccionada
        const pageElement = document.getElementById(`${pageName}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
        }

        // Actualitzar botons de navegació
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Renderizar component
        if (this.components[pageName]) {
            const contentElement = document.getElementById(`${pageName}-content`);
            if (contentElement) {
                contentElement.innerHTML = '';
                this.components[pageName].render(contentElement);
            }
        }

        this.currentPage = pageName;
    }
}

// Iniciar aplicació
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
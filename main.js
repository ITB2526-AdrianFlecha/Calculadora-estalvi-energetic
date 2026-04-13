document.addEventListener('DOMContentLoaded', () => {
    // Variables globals per mantenir l'estat del gràfic
    let dadesGlobals = { llum: 0, aigua: 0, cons: 0, net: 0 };
    let tipusActiu = 'llum'; // Pestanya per defecte

    // --- 1. CONFIGURACIÓ DELS 2 GRÀFICS ---
    // Gràfic 1: Situació Actual
    const ctxActual = document.getElementById('consumChart').getContext('2d');
    let chartActual = new Chart(ctxActual, {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Consum Actual' },
                legend: { display: false }
            },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Gràfic 2: Projecció a 3 Anys
    const ctxObjectiu = document.getElementById('objectiuChart').getContext('2d');
    let chartObjectiu = new Chart(ctxObjectiu, {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Objectiu a 3 Anys (-30%)' },
                legend: { display: false }
            },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Funció per redibuixar ELS DOS gràfics segons la pestanya escollida
    function renderitzarGrafic() {
        let labelsActual = [];
        let dataActual = [];
        let bgColorActual = [];
        let titleActual = '';

        let labelsObj = ['Any 1 (-10%)', 'Any 2 (-20%)', 'Any 3 (-30%)'];
        let dataObj = [];
        let bgColorObj = [];
        let titleObj = '';

        if (tipusActiu === 'llum') {
            labelsActual = ['Llum (kWh)'];
            dataActual = [dadesGlobals.llum];
            bgColorActual = ['#FFCE56'];
            titleActual = 'Elèctric Actual';

            dataObj = [dadesGlobals.llum * 0.9, dadesGlobals.llum * 0.8, dadesGlobals.llum * 0.7];
            bgColorObj = ['#ffe082', '#ffd54f', '#ffca28'];
            titleObj = 'Evolució Elèctrica';

        } else if (tipusActiu === 'aigua') {
            labelsActual = ['Aigua (L)'];
            dataActual = [dadesGlobals.aigua];
            bgColorActual = ['#36A2EB'];
            titleActual = 'Aigua Actual';

            dataObj = [dadesGlobals.aigua * 0.9, dadesGlobals.aigua * 0.8, dadesGlobals.aigua * 0.7];
            bgColorObj = ['#90caf9', '#64b5f6', '#42a5f5'];
            titleObj = 'Evolució Aigua';

        } else if (tipusActiu === 'despeses') {
            labelsActual = ['Consumibles (€)', 'Neteja (€)'];
            dataActual = [dadesGlobals.cons, dadesGlobals.net];
            bgColorActual = ['#FF6384', '#4BC0C0'];
            titleActual = 'Despeses Actuals';

            let totalDespeses = dadesGlobals.cons + dadesGlobals.net;
            labelsObj = ['Any 1 (-10%)', 'Any 2 (-20%)', 'Any 3 (-30%)'];
            dataObj = [totalDespeses * 0.9, totalDespeses * 0.8, totalDespeses * 0.7];
            bgColorObj = ['#b39ddb', '#9575cd', '#7e57c2'];
            titleObj = 'Evolució Despesa Total (€)';
        }

        // Actualitzem Gràfic ACTUAL
        chartActual.data.labels = labelsActual;
        chartActual.data.datasets = [{
            label: titleActual,
            data: dataActual,
            backgroundColor: bgColorActual,
            borderWidth: 1
        }];
        chartActual.options.plugins.title.text = 'Situació Actual';
        chartActual.update();

        // Actualitzem Gràfic OBJECTIU
        chartObjectiu.data.labels = labelsObj;
        chartObjectiu.data.datasets = [{
            label: titleObj,
            data: dataObj,
            backgroundColor: bgColorObj,
            borderWidth: 1
        }];
        chartObjectiu.options.plugins.title.text = titleObj;
        chartObjectiu.update();
    }

    // Escoltar clics a les pestanyes
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            tipusActiu = e.target.getAttribute('data-target');
            renderitzarGrafic();
        });
    });

    // --- 2. CARREGAR DADES ---
    const statusMsg = document.getElementById('status-msg');

    document.getElementById('btn-default').addEventListener('click', async () => {
        try {
            statusMsg.innerText = "Carregant dades del centre...";
            const response = await fetch('dataclean.json');
            if (!response.ok) throw new Error("No s'ha trobat el fitxer dataclean.json");

            const dades = await response.json();
            processarDades(dades);
            statusMsg.innerText = "✅ Dades del centre (dataclean.json) carregades correctament.";
        } catch (err) {
            statusMsg.innerText = "❌ Error: Necessites obrir la web amb Live Server per llegir arxius locals.";
            console.error(err);
        }
    });

    const fileInput = document.getElementById('json-file');
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        statusMsg.innerText = "Processant el teu fitxer...";
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const dades = JSON.parse(event.target.result);
                processarDades(dades);
                statusMsg.innerText = `✅ Fitxer propi (${file.name}) carregat correctament.`;
            } catch (err) {
                statusMsg.innerText = "❌ Error: El format del fitxer JSON no és correcte.";
            }
        };
        reader.readAsText(file);
    });

    // --- 3. LÒGICA MATEMÀTICA ---
    function processarDades(dades) {
        const pesos_ocupacion = { 1: 0.7, 2: 1.0, 3: 0.9, 4: 0.8, 5: 1.0, 6: 0.8, 7: 0.1, 8: 0.05, 9: 0.7, 10: 1.0, 11: 1.0, 12: 0.7 };
        const pesos_electricidad = { 1: 1.0, 2: 1.0, 3: 0.8, 4: 0.7, 5: 0.75, 6: 0.8, 7: 0.15, 8: 0.05, 9: 0.7, 10: 0.8, 11: 0.95, 12: 0.8 };
        const mesos_curs = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
        const DIES_PER_MES = 30.41;

        const suma_pesos_elec_any = Object.values(pesos_electricidad).reduce((a, b) => a + b, 0);
        const suma_pesos_elec_curs = mesos_curs.reduce((sum, m) => sum + pesos_electricidad[m], 0);
        const suma_pesos_ocup_any = Object.values(pesos_ocupacion).reduce((a, b) => a + b, 0);
        const suma_pesos_ocup_curs = mesos_curs.reduce((sum, m) => sum + pesos_ocupacion[m], 0);

        let llumAny = 0, llumCurs = 0, aiguaAny = 0, aiguaCurs = 0;
        let consAny = 0, consCurs = 0, netAny = 0, netCurs = 0;

        const elecDades = dades["Consumo_Energetico_TIC"] || [];
        if (elecDades.length > 0) {
            const mitjana = elecDades.reduce((s, d) => s + d.consumo_total_kWh, 0) / elecDades.length;
            llumAny = (mitjana * DIES_PER_MES) * suma_pesos_elec_any;
            llumCurs = (mitjana * DIES_PER_MES) * suma_pesos_elec_curs;
        }

        const aiguaDades = (dades["Impacto_Indirecto_Instalaciones"] || {}).agua || [];
        if (aiguaDades.length > 0) {
            const mitjana = aiguaDades.reduce((s, d) => s + d.consumo_litros, 0) / aiguaDades.length;
            aiguaAny = (mitjana * DIES_PER_MES) * suma_pesos_ocup_any;
            aiguaCurs = (mitjana * DIES_PER_MES) * suma_pesos_ocup_curs;
        }

        const consDades = dades["Consumibles_Impresion"] || [];
        if (consDades.length > 0) {
            const total = consDades.reduce((s, d) => s + d.coste_total_euros, 0);
            const baseMensual = (total / 8) / 0.9;
            consAny = baseMensual * suma_pesos_ocup_any;
            consCurs = baseMensual * suma_pesos_ocup_curs;
        }

        const netDades = (dades["Impacto_Indirecto_Instalaciones"] || {}).limpieza_y_mantenimiento || [];
        if (netDades.length > 0) {
            const total = netDades.reduce((s, d) => s + d.coste_total_euros, 0);
            const baseMensual = (total / 2) / 0.9;
            netAny = baseMensual * suma_pesos_ocup_any;
            netCurs = baseMensual * suma_pesos_ocup_curs;
        }

        actualitzarUI(llumAny, llumCurs, aiguaAny, aiguaCurs, consAny, consCurs, netAny, netCurs);
    }

    function actualitzarUI(lA, lC, aA, aC, cA, cC, nA, nC) {
        // 1. INDICADORS
        document.getElementById('res-llum-any').innerText = lA.toFixed(2) + " kWh";
        document.getElementById('res-llum-periode').innerText = lC.toFixed(2) + " kWh";
        document.getElementById('res-aigua-any').innerText = aA.toFixed(2) + " L";
        document.getElementById('res-aigua-periode').innerText = aC.toFixed(2) + " L";
        document.getElementById('res-cons-any').innerText = cA.toFixed(2) + " €";
        document.getElementById('res-cons-periode').innerText = cC.toFixed(2) + " €";
        document.getElementById('res-net-any').innerText = nA.toFixed(2) + " €";
        document.getElementById('res-net-periode').innerText = nC.toFixed(2) + " €";

        // 2. ACTUALITZAR ESTAT GLOBAL I REDIBUIXAR ELS DOS GRÀFICS
        dadesGlobals = { llum: lA, aigua: aA, cons: cA, net: nA };
        renderitzarGrafic();

        // 3. OBJECTIUS MESURABLES I ACCIONS CONCRETES
        const actionPlan = document.getElementById('action-plan-content');
        actionPlan.innerHTML = `
            <div class="action-item">
                <h4>⚡ Electricitat (TIC)</h4>
                <p><strong>Objectiu:</strong> Baixar el consum de ${lA.toFixed(0)} a <strong>${(lA * 0.7).toFixed(0)} kWh/any</strong>.</p>
                <p><strong>Acció:</strong> Programació d'apagada automàtica a les 20:00h de tots els ordinadors i substitució de bombetes per LED a les aules restants.</p>
            </div>
            <div class="action-item">
                <h4>💧 Aigua</h4>
                <p><strong>Objectiu:</strong> Reduir el consum de ${aA.toFixed(0)} a <strong>${(aA * 0.7).toFixed(0)} Litres/any</strong>.</p>
                <p><strong>Acció:</strong> Instal·lació de difusors d'aire als rentamans dels lavabos i detecció de fuites mitjançant sensors intel·ligents.</p>
            </div>
            <div class="action-item">
                <h4>🖨️ Consumibles</h4>
                <p><strong>Objectiu:</strong> Reduir la despesa de ${cA.toFixed(0)} a <strong>${(cA * 0.7).toFixed(0)} €/any</strong>.</p>
                <p><strong>Acció:</strong> Establir un límit de còpies per departament i prioritzar l'ús de plataformes educatives digitals.</p>
            </div>
            <div class="action-item">
                <h4>🧹 Neteja</h4>
                <p><strong>Objectiu:</strong> Ajustar la despesa a un màxim de <strong>${(nA * 0.7).toFixed(0)} €/any</strong>.</p>
                <p><strong>Acció:</strong> Substitució de productes químics per solucions biodegradables concentrades que redueixin costos de transport i envàs.</p>
            </div>
        `;

        // 4. CRONOGRAMA
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = `
            <div class="timeline-step">
                <h3>Any 1 (Objectiu -10%)</h3>
                <p>⚡ <strong>Llum:</strong> ${(lA * 0.9).toFixed(2)} kWh</p>
                <p>💧 <strong>Aigua:</strong> ${(aA * 0.9).toFixed(2)} L</p>
                <p>🖨️ <strong>Consum.:</strong> ${(cA * 0.9).toFixed(2)} €</p>
                <p>🧹 <strong>Neteja:</strong> ${(nA * 0.9).toFixed(2)} €</p>
            </div>
            <div class="timeline-step">
                <h3>Any 2 (Objectiu -20%)</h3>
                <p>⚡ <strong>Llum:</strong> ${(lA * 0.8).toFixed(2)} kWh</p>
                <p>💧 <strong>Aigua:</strong> ${(aA * 0.8).toFixed(2)} L</p>
                <p>🖨️ <strong>Consum.:</strong> ${(cA * 0.8).toFixed(2)} €</p>
                <p>🧹 <strong>Neteja:</strong> ${(nA * 0.8).toFixed(2)} €</p>
            </div>
            <div class="timeline-step" style="background:#bbdefb; border-color:var(--primary-color);">
                <h3 style="color:var(--primary-color);">Any 3 (Final -30%)</h3>
                <p>⚡ <strong>Llum:</strong> ${(lA * 0.7).toFixed(2)} kWh</p>
                <p>💧 <strong>Aigua:</strong> ${(aA * 0.7).toFixed(2)} L</p>
                <p>🖨️ <strong>Consum.:</strong> ${(cA * 0.7).toFixed(2)} €</p>
                <p>🧹 <strong>Neteja:</strong> ${(nA * 0.7).toFixed(2)} €</p>
            </div>
        `;
    }

    // --- 5. EXPORTAR A PDF ---
    document.getElementById('btn-export').addEventListener('click', () => {
        const element = document.getElementById('dashboard');
        html2pdf().from(element).set({
            margin: 0.5,
            filename: 'Pla_Sostenibilitat_ITB.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }).save();
    });
});
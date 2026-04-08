// Función para cargar datos desde un archivo JSON
async function carregar_dades(ruta_fitxer) {
    const response = await fetch(ruta_fitxer);
    return await response.json();
}

// Función para la calculadora de sostenibilidad visual
function calculadora_sostenibilitat_visual(dades) {
    // --- PESOS MENSUALES (Barcelona y Calendario Escolar) ---
    const pesos_ocupacion = {
        1: 0.7, 2: 1.0, 3: 0.9, 4: 0.8, 5: 1.0, 6: 0.8,
        7: 0.1, 8: 0.05, 9: 0.7, 10: 1.0, 11: 1.0, 12: 0.7
    };
    const pesos_electricidad = {
        1: 1.0, 2: 1.0, 3: 0.8, 4: 0.7, 5: 0.75, 6: 0.8,
        7: 0.15, 8: 0.05, 9: 0.7, 10: 0.8, 11: 0.95, 12: 0.8
    };

    const mesos_curs = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];

    const suma_pesos_elec_any = Object.values(pesos_electricidad).reduce((a, b) => a + b, 0);
    const suma_pesos_elec_curs = mesos_curs.reduce((sum, m) => sum + pesos_electricidad[m], 0);
    const suma_pesos_ocup_any = Object.values(pesos_ocupacion).reduce((a, b) => a + b, 0);
    const suma_pesos_ocup_curs = mesos_curs.reduce((sum, m) => sum + pesos_ocupacion[m], 0);

    const DIES_PER_MES = 30.41;

    // --- CABECERA VISUAL ---
    console.log("=".repeat(65));
    console.log(" 🌱  CALCULADORA DE SOSTENIBILIDAD Y GASTOS TIC (BARCELONA)  🌱");
    console.log("=".repeat(65));
    console.log(" 📊 Considerando estacionalidad, clima y calendario escolar");
    console.log("-".repeat(65) + "\n");

    // --- 1 & 2: CONSUMO ELÉCTRICO ---
    const electricitat = dades["Consumo_Energetico_TIC"] || [];
    if (electricitat.length > 0) {
        const mitjana_diaria_base_kwh = electricitat.reduce((sum, dia) => sum + dia["consumo_total_kWh"], 0) / electricitat.length;
        const consum_mensual_base_kwh = mitjana_diaria_base_kwh * DIES_PER_MES;
        const consum_any_kwh = consum_mensual_base_kwh * suma_pesos_elec_any;
        const consum_curs_kwh = consum_mensual_base_kwh * suma_pesos_elec_curs;

        console.log(" ⚡  1. CONSUMO ELÉCTRICO (Ajustado por clima y luz)");
        console.log(`     ├─ Próximo año completo:      ${consum_any_kwh.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} kWh`);
        console.log(`     └─ Curso escolar (Sep-Jun):   ${consum_curs_kwh.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} kWh\n`);
    }

    // --- 3 & 4: CONSUMO DE AGUA ---
    const aigua = (dades["Impacto_Indirecto_Instalaciones"] || {})["agua"] || [];
    if (aigua.length > 0) {
        const mitjana_diaria_base_aigua = aigua.reduce((sum, dia) => sum + dia["consumo_litros"], 0) / aigua.length;
        const consum_mensual_base_aigua = mitjana_diaria_base_aigua * DIES_PER_MES;
        const consum_any_aigua = consum_mensual_base_aigua * suma_pesos_ocup_any;
        const consum_curs_aigua = consum_mensual_base_aigua * suma_pesos_ocup_curs;

        console.log(" 💧  2. CONSUMO DE AGUA (Ajustado por ocupación)");
        console.log(`     ├─ Próximo año completo:      ${consum_any_aigua.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} Litros`);
        console.log(`     └─ Curso escolar (Sep-Jun):   ${consum_curs_aigua.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} Litros\n`);
    }

    // --- 5 & 6: CONSUMIBLES DE OFICINA ---
    const consumibles = dades["Consumibles_Impresion"] || [];
    if (consumibles.length > 0) {
        const total_euros_consumibles = consumibles.reduce((sum, item) => sum + item["coste_total_euros"], 0);
        const consum_mensual_base_cons = (total_euros_consumibles / 8) / 0.9;
        const consum_any_consumibles = consum_mensual_base_cons * suma_pesos_ocup_any;
        const consum_curs_consumibles = consum_mensual_base_cons * suma_pesos_ocup_curs;

        console.log(" 🖨️   3. CONSUMIBLES DE OFICINA Y TIC");
        console.log(`     ├─ Próximo año completo:      ${consum_any_consumibles.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €`);
        console.log(`     └─ Curso escolar (Sep-Jun):   ${consum_curs_consumibles.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €\n`);
    }

    // --- 7 & 8: PRODUCTOS DE LIMPIEZA ---
    const neteja = (dades["Impacto_Indirecto_Instalaciones"] || {})["limpieza_y_mantenimiento"] || [];
    if (neteja.length > 0) {
        const total_euros_neteja = neteja.reduce((sum, item) => sum + item["coste_total_euros"], 0);
        const consum_mensual_base_neteja = (total_euros_neteja / 2) / 0.9;
        const consum_any_neteja = consum_mensual_base_neteja * suma_pesos_ocup_any;
        const consum_curs_neteja = consum_mensual_base_neteja * suma_pesos_ocup_curs;

        console.log(" 🧹  4. PRODUCTOS DE LIMPIEZA Y MANTENIMIENTO");
        console.log(`     ├─ Próximo año completo:      ${consum_any_neteja.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €`);
        console.log(`     └─ Curso escolar (Sep-Jun):   ${consum_curs_neteja.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €\n`);
    }

    // --- OBJETIVOS DEL PROYECTO ---
    console.log("=".repeat(65));
    console.log(" 🎯  OBJETIVO DE REDUCCIÓN DEL PROYECTO (3 AÑOS)");
    console.log("     Meta: -30% respecto al consumo anual actual");
    console.log("=".repeat(65));

    if (electricitat.length > 0) {
        console.log(`  ▶ Límite de electricidad:    ${(consum_any_kwh * 0.7).toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} kWh`);
    }
    if (aigua.length > 0) {
        console.log(`  ▶ Límite de agua:            ${(consum_any_aigua * 0.7).toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} Litros`);
    }
    if (consumibles.length > 0) {
        console.log(`  ▶ Límite de consumibles:     ${(consum_any_consumibles * 0.7).toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €`);
    }
    if (neteja.length > 0) {
        console.log(`  ▶ Límite de limpieza:        ${(consum_any_neteja * 0.7).toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €`);
    }
    console.log("-".repeat(65));
}

// =====================================================================
// 2. NUEVA CALCULADORA GENERAL (INTERACTIVA Y MANUAL)
// =====================================================================

function calculadora_general(...args) {
    // Uso ...args para que, si el menú antiguo le envía los "dades" del JSON,
    // la función simplemente los ignore sin dar error y proceda a preguntar.

    const DIES_ANY = 365;
    const DIES_CURS = 304;
    const MESOS_ANY = 12;
    const MESOS_CURS = 10;

    console.log("\n" + "=".repeat(65));
    console.log(" 🌍  CALCULADORA DE SOSTENIBILIDAD GENERAL (MANUAL)  🌍");
    console.log("=".repeat(65));
    console.log(" 📝 Introduce los promedios solicitados.");
    console.log("    (Pulsa ENTER dejándolo en blanco si no tienes el dato)");
    console.log("-".repeat(65) + "\n");

    // Función interna para asegurar que el usuario introduce números válidos
    function obtenir_dada(missatge) {
        while (true) {
            const entrada = prompt(missatge).trim();
            if (entrada === "") {
                return 0.0;
            }
            try {
                // Reemplazamos comas por puntos por si el usuario escribe "15,5"
                return parseFloat(entrada.replace(',', '.'));
            } catch (e) {
                console.log("     ⚠️ Entrada no válida. Por favor, introduce un número (ej: 15.5 o 1500).");
            }
        }
    }

    // Preguntas al usuario
    const mitjana_diaria_elec = obtenir_dada(" ⚡ ¿Cuál es el consumo eléctrico medio diario en kWh?: ");
    const mitjana_diaria_aigua = obtenir_dada(" 💧 ¿Cuál es el consumo de agua medio diario en Litros?: ");
    const mitjana_mensual_cons = obtenir_dada(" 🖨️  ¿Cuál es el gasto medio mensual en consumibles (€)?: ");
    const mitjana_mensual_neteja = obtenir_dada(" 🧹 ¿Cuál es el gasto medio mensual en limpieza y mantenimiento (€)?: ");

    console.log("\n" + "-".repeat(65));
    console.log(" 📊 RESULTADOS DEL CÁLCULO ESTÁNDAR LINEAL");
    console.log("-".repeat(65) + "\n");

    let consum_any_kwh = 0;
    let consum_any_aigua = 0;
    let consum_any_consumibles = 0;
    let consum_any_neteja = 0;

    // --- 1 & 2: CONSUMO ELÉCTRICO ---
    if (mitjana_diaria_elec > 0) {
        consum_any_kwh = mitjana_diaria_elec * DIES_ANY;
        const consum_curs_kwh = mitjana_diaria_elec * DIES_CURS;
        console.log(" ⚡  1. CONSUMO ELÉCTRICO (Media lineal)");
        console.log(`     ├─ Próximo año completo:      ${consum_any_kwh.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} kWh`);
        console.log(`     └─ Período (10 meses):        ${consum_curs_kwh.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} kWh\n`);
    }

    // --- 3 & 4: CONSUMO DE AGUA ---
    if (mitjana_diaria_aigua > 0) {
        consum_any_aigua = mitjana_diaria_aigua * DIES_ANY;
        const consum_curs_aigua = mitjana_diaria_aigua * DIES_CURS;
        console.log(" 💧  2. CONSUMO DE AGUA (Media lineal)");
        console.log(`     ├─ Próximo año completo:      ${consum_any_aigua.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} Litros`);
        console.log(`     └─ Período (10 meses):        ${consum_curs_aigua.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} Litros\n`);
    }

    // --- 5 & 6: CONSUMIBLES DE OFICINA ---
    if (mitjana_mensual_cons > 0) {
        consum_any_consumibles = mitjana_mensual_cons * MESOS_ANY;
        const consum_curs_consumibles = mitjana_mensual_cons * MESOS_CURS;
        console.log(" 🖨️   3. CONSUMIBLES DE OFICINA Y TIC");
        console.log(`     ├─ Próximo año completo:      ${consum_any_consumibles.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €`);
        console.log(`     └─ Período (10 meses):        ${consum_curs_consumibles.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €\n`);
    }

    // --- 7 & 8: PRODUCTOS DE LIMPIEZA ---
    if (mitjana_mensual_neteja > 0) {
        consum_any_neteja = mitjana_mensual_neteja * MESOS_ANY;
        const consum_curs_neteja = mitjana_mensual_neteja * MESOS_CURS;
        console.log(" 🧹  4. PRODUCTOS DE LIMPIEZA Y MANTENIMIENTO");
        console.log(`     ├─ Próximo año completo:      ${consum_any_neteja.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €`);
        console.log(`     └─ Período (10 meses):        ${consum_curs_neteja.toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €\n`);
    }

    // --- OBJETIVOS DEL PROYECTO ---
    console.log("=".repeat(65));
    console.log(" 🎯  OBJETIVO DE REDUCCIÓN (3 AÑOS)");
    console.log("     Meta: -30% respecto al consumo anual actual");
    console.log("=".repeat(65));

    if (consum_any_kwh > 0) {
        console.log(`  ▶ Límite de electricidad:    ${(consum_any_kwh * 0.7).toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} kWh`);
    }
    if (consum_any_aigua > 0) {
        console.log(`  ▶ Límite de agua:            ${(consum_any_aigua * 0.7).toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} Litros`);
    }
    if (consum_any_consumibles > 0) {
        console.log(`  ▶ Límite de consumibles:     ${(consum_any_consumibles * 0.7).toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €`);
    }
    if (consum_any_neteja > 0) {
        console.log(`  ▶ Límite de limpieza:        ${(consum_any_neteja * 0.7).toFixed(2).replace(',', 'X').replace('.', ',').replace('X', '.')} €`);
    }

    if (consum_any_kwh === 0 && consum_any_aigua === 0 && consum_any_consumibles === 0 && consum_any_neteja === 0) {
        console.log("  ⚠️  No se han introducido datos para calcular los objetivos.");
    }

    console.log("-".repeat(65));
}

// =====================================================================
// 3. MENÚ PRINCIPAL E INICIO DEL PROGRAMA
// =====================================================================

async function menu_principal() {
    while (true) {
        console.log("\n" + "=".repeat(50));
        console.log(" 📋 MENÚ PRINCIPAL - ANÁLISIS DE SOSTENIBILIDAD");
        console.log("=".repeat(50));
        console.log(" 1. Calculadora del Centro (Modelo Barcelona)");
        console.log(" 2. Calculadora General (Manual interactiva)");
        console.log(" 3. Salir del programa");
        console.log("-".repeat(50));

        const opcio = prompt("Selecciona una opción (1-3): ").trim();
        console.log("-".repeat(50));
        console.log("\n");

        if (opcio === '1') {
            try {
                // Carga los datos por defecto (dataclean.json)
                const dades = await carregar_dades('dataclean.json');
                calculadora_sostenibilitat_visual(dades);
            } catch (e) {
                // Error genérico por seguridad (sin mostrar rutas ni detalles)
                console.log("\n❌ Error interno: No se ha podido procesar el archivo del centro. Contacte con el administrador.");
            }
        } else if (opcio === '2') {
            try {
                // Llama directamente a la nueva calculadora manual (ya no pide archivo JSON)
                calculadora_general();
            } catch (e) {
                // Error genérico por seguridad
                console.log("\n❌ Error interno: No se ha podido ejecutar la calculadora general.");
            }
        } else if (opcio === '3') {
            console.log("\n👋 ¡Hasta pronto! Cerrando la calculadora...\n");
            break;  // Esto rompe el bucle y cierra el programa
        } else {
            console.log("\n⚠️ Opción no válida. Por favor, elige 1, 2 o 3.");
        }

        // --- PREGUNTA CLARA AL USUARIO ---
        if (opcio === '1' || opcio === '2') {  // Solo preguntar si ejecutó una calculadora
            console.log("\n" + "=".repeat(50));
            while (true) {
                const accion = prompt("¿Deseas volver al menú principal? (S/N): ").trim().toUpperCase();
                if (accion === 'S') {
                    break;
                } else if (accion === 'N') {
                    console.log("\n👋 ¡Hasta pronto! Cerrando la calculadora...\n");
                    return;  // En lugar de exit(), usamos return para salir de la función
                } else {
                    console.log("⚠️ Por favor, introduce 'S' para sí o 'N' para no.");
                }
            }
        }
    }
}

// Ejecución segura del script
menu_principal();

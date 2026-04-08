import json


def carregar_dades(ruta_fitxer):
    with open(ruta_fitxer, 'r', encoding='utf-8') as f:
        return json.load(f)


def calculadora_sostenibilitat_visual(dades):
    # --- PESOS MENSUALES (Barcelona y Calendario Escolar) ---
    pesos_ocupacion = {
        1: 0.7, 2: 1.0, 3: 0.9, 4: 0.8, 5: 1.0, 6: 0.8,
        7: 0.1, 8: 0.05, 9: 0.7, 10: 1.0, 11: 1.0, 12: 0.7
    }
    pesos_electricidad = {
        1: 1.0, 2: 1.0, 3: 0.8, 4: 0.7, 5: 0.75, 6: 0.8,
        7: 0.15, 8: 0.05, 9: 0.7, 10: 0.8, 11: 0.95, 12: 0.8
    }

    mesos_curs = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6]

    suma_pesos_elec_any = sum(pesos_electricidad.values())
    suma_pesos_elec_curs = sum(pesos_electricidad[m] for m in mesos_curs)
    suma_pesos_ocup_any = sum(pesos_ocupacion.values())
    suma_pesos_ocup_curs = sum(pesos_ocupacion[m] for m in mesos_curs)

    DIES_PER_MES = 30.41

    # --- CABECERA VISUAL ---
    print("=" * 65)
    print(" 🌱  CALCULADORA DE SOSTENIBILIDAD Y GASTOS TIC (BARCELONA)  🌱")
    print("=" * 65)
    print(" 📊 Considerando estacionalidad, clima y calendario escolar")
    print("-" * 65 + "\n")

    # --- 1 & 2: CONSUMO ELÉCTRICO ---
    electricitat = dades.get("Consumo_Energetico_TIC", [])
    if electricitat:
        mitjana_diaria_base_kwh = sum(dia["consumo_total_kWh"] for dia in electricitat) / len(electricitat)
        consum_mensual_base_kwh = mitjana_diaria_base_kwh * DIES_PER_MES
        consum_any_kwh = consum_mensual_base_kwh * suma_pesos_elec_any
        consum_curs_kwh = consum_mensual_base_kwh * suma_pesos_elec_curs

        print(" ⚡  1. CONSUMO ELÉCTRICO (Ajustado por clima y luz)")
        print(
            f"     ├─ Próximo año completo:      {consum_any_kwh:,.2f} kWh".replace(',', 'X').replace('.', ',').replace(
                'X', '.'))
        print(f"     └─ Curso escolar (Sep-Jun):   {consum_curs_kwh:,.2f} kWh\n".replace(',', 'X').replace('.',
                                                                                                           ',').replace(
            'X', '.'))

    # --- 3 & 4: CONSUMO DE AGUA ---
    aigua = dades.get("Impacto_Indirecto_Instalaciones", {}).get("agua", [])
    if aigua:
        mitjana_diaria_base_aigua = sum(dia["consumo_litros"] for dia in aigua) / len(aigua)
        consum_mensual_base_aigua = mitjana_diaria_base_aigua * DIES_PER_MES
        consum_any_aigua = consum_mensual_base_aigua * suma_pesos_ocup_any
        consum_curs_aigua = consum_mensual_base_aigua * suma_pesos_ocup_curs

        print(" 💧  2. CONSUMO DE AGUA (Ajustado por ocupación)")
        print(f"     ├─ Próximo año completo:      {consum_any_aigua:,.2f} Litros".replace(',', 'X').replace('.',
                                                                                                             ',').replace(
            'X', '.'))
        print(f"     └─ Curso escolar (Sep-Jun):   {consum_curs_aigua:,.2f} Litros\n".replace(',', 'X').replace('.',
                                                                                                                ',').replace(
            'X', '.'))

    # --- 5 & 6: CONSUMIBLES DE OFICINA ---
    consumibles = dades.get("Consumibles_Impresion", [])
    if consumibles:
        total_euros_consumibles = sum(item["coste_total_euros"] for item in consumibles)
        consum_mensual_base_cons = (total_euros_consumibles / 8) / 0.9
        consum_any_consumibles = consum_mensual_base_cons * suma_pesos_ocup_any
        consum_curs_consumibles = consum_mensual_base_cons * suma_pesos_ocup_curs

        print(" 🖨️   3. CONSUMIBLES DE OFICINA Y TIC")
        print(f"     ├─ Próximo año completo:      {consum_any_consumibles:,.2f} €".replace(',', 'X').replace('.',
                                                                                                              ',').replace(
            'X', '.'))
        print(f"     └─ Curso escolar (Sep-Jun):   {consum_curs_consumibles:,.2f} €\n".replace(',', 'X').replace('.',
                                                                                                                 ',').replace(
            'X', '.'))

    # --- 7 & 8: PRODUCTOS DE LIMPIEZA ---
    neteja = dades.get("Impacto_Indirecto_Instalaciones", {}).get("limpieza_y_mantenimiento", [])
    if neteja:
        total_euros_neteja = sum(item["coste_total_euros"] for item in neteja)
        consum_mensual_base_neteja = (total_euros_neteja / 2) / 0.9
        consum_any_neteja = consum_mensual_base_neteja * suma_pesos_ocup_any
        consum_curs_neteja = consum_mensual_base_neteja * suma_pesos_ocup_curs

        print(" 🧹  4. PRODUCTOS DE LIMPIEZA Y MANTENIMIENTO")
        print(f"     ├─ Próximo año completo:      {consum_any_neteja:,.2f} €".replace(',', 'X').replace('.',
                                                                                                         ',').replace(
            'X', '.'))
        print(f"     └─ Curso escolar (Sep-Jun):   {consum_curs_neteja:,.2f} €\n".replace(',', 'X').replace('.',
                                                                                                            ',').replace(
            'X', '.'))

    # --- OBJETIVOS DEL PROYECTO ---
    print("=" * 65)
    print(" 🎯  OBJETIVO DE REDUCCIÓN DEL PROYECTO (3 AÑOS)")
    print("     Meta: -30% respecto al consumo anual actual")
    print("=" * 65)

    if electricitat:
        print(f"  ▶ Límite de electricidad:    {(consum_any_kwh * 0.7):,.2f} kWh".replace(',', 'X').replace('.',
                                                                                                            ',').replace(
            'X', '.'))
    if aigua:
        print(f"  ▶ Límite de agua:            {(consum_any_aigua * 0.7):,.2f} Litros".replace(',', 'X').replace('.',
                                                                                                                 ',').replace(
            'X', '.'))
    if consumibles:
        print(f"  ▶ Límite de consumibles:     {(consum_any_consumibles * 0.7):,.2f} €".replace(',', 'X').replace('.',
                                                                                                                  ',').replace(
            'X', '.'))
    if neteja:
        print(f"  ▶ Límite de limpieza:        {(consum_any_neteja * 0.7):,.2f} €".replace(',', 'X').replace('.',
                                                                                                             ',').replace(
            'X', '.'))
    print("-" * 65)


# =====================================================================
# 2. NUEVA CALCULADORA GENERAL (INTERACTIVA Y MANUAL)
# =====================================================================

def calculadora_general(*args, **kwargs):
    # Uso *args y **kwargs para que, si el menú antiguo le envía los "dades" del JSON,
    # la función simplemente los ignore sin dar error y proceda a preguntar.

    DIES_ANY = 365
    DIES_CURS = 304
    MESOS_ANY = 12
    MESOS_CURS = 10

    print("\n" + "=" * 65)
    print(" 🌍  CALCULADORA DE SOSTENIBILIDAD GENERAL (MANUAL)  🌍")
    print("=" * 65)
    print(" 📝 Introduce los promedios solicitados.")
    print("    (Pulsa ENTER dejándolo en blanco si no tienes el dato)")
    print("-" * 65 + "\n")

    # Función interna para asegurar que el usuario introduce números válidos
    def obtenir_dada(missatge):
        while True:
            entrada = input(missatge).strip()
            if entrada == "":
                return 0.0
            try:
                # Reemplazamos comas por puntos por si el usuario escribe "15,5"
                return float(entrada.replace(',', '.'))
            except ValueError:
                print("     ⚠️ Entrada no válida. Por favor, introduce un número (ej: 15.5 o 1500).")

    # Preguntas al usuario
    mitjana_diaria_elec = obtenir_dada(" ⚡ ¿Cuál es el consumo eléctrico medio diario en kWh?: ")
    mitjana_diaria_aigua = obtenir_dada(" 💧 ¿Cuál es el consumo de agua medio diario en Litros?: ")
    mitjana_mensual_cons = obtenir_dada(" 🖨️  ¿Cuál es el gasto medio mensual en consumibles (€)?: ")
    mitjana_mensual_neteja = obtenir_dada(" 🧹 ¿Cuál es el gasto medio mensual en limpieza y mantenimiento (€)?: ")

    print("\n" + "-" * 65)
    print(" 📊 RESULTADOS DEL CÁLCULO ESTÁNDAR LINEAL")
    print("-" * 65 + "\n")

    consum_any_kwh = consum_any_aigua = consum_any_consumibles = consum_any_neteja = 0

    # --- 1 & 2: CONSUMO ELÉCTRICO ---
    if mitjana_diaria_elec > 0:
        consum_any_kwh = mitjana_diaria_elec * DIES_ANY
        consum_curs_kwh = mitjana_diaria_elec * DIES_CURS
        print(" ⚡  1. CONSUMO ELÉCTRICO (Media lineal)")
        print(
            f"     ├─ Próximo año completo:      {consum_any_kwh:,.2f} kWh".replace(',', 'X').replace('.', ',').replace(
                'X', '.'))
        print(f"     └─ Período (10 meses):        {consum_curs_kwh:,.2f} kWh\n".replace(',', 'X').replace('.',
                                                                                                           ',').replace(
            'X', '.'))

    # --- 3 & 4: CONSUMO DE AGUA ---
    if mitjana_diaria_aigua > 0:
        consum_any_aigua = mitjana_diaria_aigua * DIES_ANY
        consum_curs_aigua = mitjana_diaria_aigua * DIES_CURS
        print(" 💧  2. CONSUMO DE AGUA (Media lineal)")
        print(f"     ├─ Próximo año completo:      {consum_any_aigua:,.2f} Litros".replace(',', 'X').replace('.',
                                                                                                             ',').replace(
            'X', '.'))
        print(f"     └─ Período (10 meses):        {consum_curs_aigua:,.2f} Litros\n".replace(',', 'X').replace('.',
                                                                                                                ',').replace(
            'X', '.'))

    # --- 5 & 6: CONSUMIBLES DE OFICINA ---
    if mitjana_mensual_cons > 0:
        consum_any_consumibles = mitjana_mensual_cons * MESOS_ANY
        consum_curs_consumibles = mitjana_mensual_cons * MESOS_CURS
        print(" 🖨️   3. CONSUMIBLES DE OFICINA Y TIC")
        print(f"     ├─ Próximo año completo:      {consum_any_consumibles:,.2f} €".replace(',', 'X').replace('.',
                                                                                                              ',').replace(
            'X', '.'))
        print(f"     └─ Período (10 meses):        {consum_curs_consumibles:,.2f} €\n".replace(',', 'X').replace('.',
                                                                                                                 ',').replace(
            'X', '.'))

    # --- 7 & 8: PRODUCTOS DE LIMPIEZA ---
    if mitjana_mensual_neteja > 0:
        consum_any_neteja = mitjana_mensual_neteja * MESOS_ANY
        consum_curs_neteja = mitjana_mensual_neteja * MESOS_CURS
        print(" 🧹  4. PRODUCTOS DE LIMPIEZA Y MANTENIMIENTO")
        print(f"     ├─ Próximo año completo:      {consum_any_neteja:,.2f} €".replace(',', 'X').replace('.',
                                                                                                         ',').replace(
            'X', '.'))
        print(f"     └─ Período (10 meses):        {consum_curs_neteja:,.2f} €\n".replace(',', 'X').replace('.',
                                                                                                            ',').replace(
            'X', '.'))

    # --- OBJETIVOS DEL PROYECTO ---
    print("=" * 65)
    print(" 🎯  OBJETIVO DE REDUCCIÓN (3 AÑOS)")
    print("     Meta: -30% respecto al consumo anual actual")
    print("=" * 65)

    if consum_any_kwh > 0:
        print(f"  ▶ Límite de electricidad:    {(consum_any_kwh * 0.7):,.2f} kWh".replace(',', 'X').replace('.',
                                                                                                            ',').replace(
            'X', '.'))
    if consum_any_aigua > 0:
        print(f"  ▶ Límite de agua:            {(consum_any_aigua * 0.7):,.2f} Litros".replace(',', 'X').replace('.',
                                                                                                                 ',').replace(
            'X', '.'))
    if consum_any_consumibles > 0:
        print(f"  ▶ Límite de consumibles:     {(consum_any_consumibles * 0.7):,.2f} €".replace(',', 'X').replace('.',
                                                                                                                  ',').replace(
            'X', '.'))
    if consum_any_neteja > 0:
        print(f"  ▶ Límite de limpieza:        {(consum_any_neteja * 0.7):,.2f} €".replace(',', 'X').replace('.',
                                                                                                             ',').replace(
            'X', '.'))

    if consum_any_kwh == 0 and consum_any_aigua == 0 and consum_any_consumibles == 0 and consum_any_neteja == 0:
        print("  ⚠️  No se han introducido datos para calcular los objetivos.")

    print("-" * 65)

# =====================================================================
# 3. MENÚ PRINCIPAL E INICIO DEL PROGRAMA
# =====================================================================

def menu_principal():
    while True:
        print("\n" + "=" * 50)
        print(" 📋 MENÚ PRINCIPAL - ANÁLISIS DE SOSTENIBILIDAD")
        print("=" * 50)
        print(" 1. Calculadora del Centro (Modelo Barcelona)")
        print(" 2. Calculadora General (Manual interactiva)")
        print(" 3. Salir del programa")
        print("-" * 50)

        opcio = input("Selecciona una opción (1-3): ").strip()
        print("-" * 50)
        print("\n")

        if opcio == '1':
            try:
                # Carga los datos por defecto (dataclean.json)
                dades = carregar_dades('dataclean.json')
                calculadora_sostenibilitat_visual(dades)
            except Exception:
                # Error genérico por seguridad (sin mostrar rutas ni detalles)
                print(
                    "\n❌ Error interno: No se ha podido procesar el archivo del centro. Contacte con el administrador.")

        elif opcio == '2':
            try:
                # Llama directamente a la nueva calculadora manual (ya no pide archivo JSON)
                calculadora_general()
            except Exception:
                # Error genérico por seguridad
                print("\n❌ Error interno: No se ha podido ejecutar la calculadora general.")

        elif opcio == '3':
            print("\n👋 ¡Hasta pronto! Cerrando la calculadora...\n")
            break  # Esto rompe el bucle y cierra el programa

        else:
            print("\n⚠️ Opción no válida. Por favor, elige 1, 2 o 3.")

        # --- PREGUNTA CLARA AL USUARIO ---
        if opcio in ['1', '2']:  # Solo preguntar si ejecutó una calculadora
            print("\n" + "=" * 50)
            while True:
                accion = input("¿Deseas volver al menú principal? (S/N): ").strip().upper()
                if accion == 'S':
                    break
                elif accion == 'N':
                    print("\n👋 ¡Hasta pronto! Cerrando la calculadora...\n")
                    exit()
                else:
                    print("⚠️ Por favor, introduce 'S' para sí o 'N' para no.")


# Ejecución segura del script
if __name__ == "__main__":
    menu_principal()
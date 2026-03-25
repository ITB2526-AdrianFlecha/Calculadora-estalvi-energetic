import json


def carregar_dades(ruta_fitxer):
    with open(ruta_fitxer, 'r', encoding='utf-8') as f:
        return json.load(f)


def calculadora_sostenibilitat_avanzada(dades):
    print("=== CALCULADORA DE SOSTENIBILITAT I DESPESES (BARCELONA) ===")
    print("Considerant estacionalitat, clima i calendari escolar\n")

    # 1. DEFINICIÓN DE PESOS MENSUALES (Basado en Barcelona y Calendario Escolar)
    # Factor 1.0 = Mes completo de alta actividad.
    # Días promedio por mes: ~30.4

    # Pesos de Ocupación (Afecta a Agua, Consumibles, Limpieza)
    # Vacaciones: Verano (Jul-Ago), Navidad (Dic-Ene), Semana Santa (Mar/Abr)
    pesos_ocupacion = {
        1: 0.7,  # Enero (Vacaciones hasta el día 8 aprox)
        2: 1.0,  # Febrero (Mes completo)
        3: 0.9,  # Marzo (A veces cae Semana Santa)
        4: 0.8,  # Abril (Semana Santa)
        5: 1.0,  # Mayo (Mes completo)
        6: 0.8,  # Junio (Jornada intensiva y fin de clases a finales)
        7: 0.1,  # Julio (Solo administración/limpieza esporádica)
        8: 0.05,  # Agosto (Cerrado prácticamente)
        9: 0.7,  # Septiembre (Clases empiezan a mediados)
        10: 1.0,  # Octubre (Mes completo)
        11: 1.0,  # Noviembre (Mes completo)
        12: 0.7  # Diciembre (Vacaciones desde el 20-22 aprox)
    }

    # Pesos de Electricidad (Afecta Clima/Luz + Ocupación)
    # Invierno: Más iluminación y calefacción. Primavera/Otoño: Suave.
    pesos_electricidad = {
        1: 1.0,  # Enero (Tomado como Base 1.0 al tener los datos reales de este mes)
        2: 1.0,  # Febrero (Frío, oscuro)
        3: 0.8,  # Marzo (Más luz, clima más suave, menos ocupación si hay S.Santa)
        4: 0.7,  # Abril (Clima suave, vacaciones S.Santa)
        5: 0.75,  # Mayo (Mucha luz natural, clima ideal)
        6: 0.8,  # Junio (Calor, posibles ventiladores/AC, jornada intensiva)
        7: 0.15,  # Julio (Inactivo, pero hace calor si hay alguien)
        8: 0.05,  # Agosto (Cerrado)
        9: 0.7,  # Septiembre (Calor, inicio a mediados)
        10: 0.8,  # Octubre (Clima suave, oscurece normal)
        11: 0.95,  # Noviembre (Empieza el frío, oscurece pronto)
        12: 0.8  # Diciembre (Frío y oscuro, pero 2 semanas cerrado)
    }

    # Meses que componen el "Curso Escolar" (Septiembre a Junio)
    mesos_curs = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6]

    # Cálculos de sumas de pesos (Equivalentes a "meses reales de consumo")
    suma_pesos_elec_any = sum(pesos_electricidad.values())
    suma_pesos_elec_curs = sum(pesos_electricidad[m] for m in mesos_curs)

    suma_pesos_ocup_any = sum(pesos_ocupacion.values())
    suma_pesos_ocup_curs = sum(pesos_ocupacion[m] for m in mesos_curs)

    DIES_PER_MES = 30.41  # Promedio de días en un mes

    # ---------------------------------------------------------
    # 1 & 2: CONSUM ELÈCTRIC (kWh)
    # ---------------------------------------------------------
    electricitat = dades.get("Consumo_Energetico_TIC", [])
    if electricitat:
        total_kwh_mostra = sum(dia["consumo_total_kWh"] for dia in electricitat)
        dies_mostra_elec = len(electricitat)
        # Como los datos son de Enero, esta media representa un mes de peso 1.0
        mitjana_diaria_base_kwh = total_kwh_mostra / dies_mostra_elec
        consum_mensual_base_kwh = mitjana_diaria_base_kwh * DIES_PER_MES

        consum_any_kwh = consum_mensual_base_kwh * suma_pesos_elec_any
        consum_curs_kwh = consum_mensual_base_kwh * suma_pesos_elec_curs

        print(f"1. Consum elèctric estimat pròxim any (Ajustat per clima/calendari): {consum_any_kwh:.2f} kWh")
        print(f"2. Consum elèctric estimat curs set-jun (Ajustat): {consum_curs_kwh:.2f} kWh\n")

    # ---------------------------------------------------------
    # 3 & 4: CONSUM D'AIGUA (Litres)
    # ---------------------------------------------------------
    aigua = dades.get("Impacto_Indirecto_Instalaciones", {}).get("agua", [])
    if aigua:
        total_litres_mostra = sum(dia["consumo_litros"] for dia in aigua)
        dies_mostra_aigua = len(aigua)
        # Los datos son de Febrero (peso 1.0 en ocupación)
        mitjana_diaria_base_aigua = total_litres_mostra / dies_mostra_aigua
        consum_mensual_base_aigua = mitjana_diaria_base_aigua * DIES_PER_MES

        consum_any_aigua = consum_mensual_base_aigua * suma_pesos_ocup_any
        consum_curs_aigua = consum_mensual_base_aigua * suma_pesos_ocup_curs

        print(f"3. Consum d'aigua estimat pròxim any (Ajustat per ocupació): {consum_any_aigua:.2f} L")
        print(f"4. Consum d'aigua estimat curs set-jun (Ajustat): {consum_curs_aigua:.2f} L\n")

    # ---------------------------------------------------------
    # 5 & 6: CONSUMIBLES D'OFICINA/IMPRESSIÓ (€)
    # ---------------------------------------------------------
    consumibles = dades.get("Consumibles_Impresion", [])
    if consumibles:
        total_euros_consumibles = sum(item["coste_total_euros"] for item in consumibles)
        # Asumimos que la muestra cubre los 8 meses centrales de clases (peso alto promedio ~0.9)
        consum_mensual_base_cons = (total_euros_consumibles / 8) / 0.9

        consum_any_consumibles = consum_mensual_base_cons * suma_pesos_ocup_any
        consum_curs_consumibles = consum_mensual_base_cons * suma_pesos_ocup_curs

        print(f"5. Despesa consumibles d'oficina pròxim any: {consum_any_consumibles:.2f} €")
        print(f"6. Despesa consumibles curs set-jun: {consum_curs_consumibles:.2f} €\n")

    # ---------------------------------------------------------
    # 7 & 8: PRODUCTES DE NETEJA I MANTENIMENT (€)
    # ---------------------------------------------------------
    neteja = dades.get("Impacto_Indirecto_Instalaciones", {}).get("limpieza_y_mantenimiento", [])
    if neteja:
        total_euros_neteja = sum(item["coste_total_euros"] for item in neteja)
        # Tenemos 2 registros (Mayo y Junio). Promedio de peso (1.0 + 0.8)/2 = 0.9
        consum_mensual_base_neteja = (total_euros_neteja / 2) / 0.9

        consum_any_neteja = consum_mensual_base_neteja * suma_pesos_ocup_any
        consum_curs_neteja = consum_mensual_base_neteja * suma_pesos_ocup_curs

        print(f"7. Despesa productes neteja pròxim any: {consum_any_neteja:.2f} €")
        print(f"8. Despesa productes neteja curs set-jun: {consum_curs_neteja:.2f} €\n")

    print("-" * 50)
    print("🎯 OBJECTIU DE REDUCCIÓ PROJECTE (3 ANYS) 🎯")
    print(f"Reducció objectiu: 30% (Multiplicador per assolir la fita: x0.7)")
    if electricitat:
        print(f"-> Límit consum elèctric anual objectiu: {(consum_any_kwh * 0.7):.2f} kWh")
    if aigua:
        print(f"-> Límit consum d'aigua anual objectiu: {(consum_any_aigua * 0.7):.2f} L")
    if consumibles:
        print(f"-> Límit despesa consumibles anual objectiu: {(consum_any_consumibles * 0.7):.2f} €")
    if neteja:
        print(f"-> Límit despesa neteja anual objectiu: {(consum_any_neteja * 0.7):.2f} €")


# Execució del codi
if __name__ == "__main__":
    try:
        dades_json = carregar_dades('dataclean.json')
        calculadora_sostenibilitat_avanzada(dades_json)
    except FileNotFoundError:
        print("Error: No s'ha trobat el fitxer 'dataclean.json'.")
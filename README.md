# 📊 Calculadora d'Estalvi Energètic

Una aplicació web responsive per analitzar i gestionar els consumos energètics, d'aigua, consumibles i neteja amb projeccions realistes i estratègies de reducció de costos.

## 🎯 Funcionalitats Principals

### 📈 Dashboard
- **KPI Cards**: Visualització ràpida de costos anuals i promedis mensuals
- **Gàfics mensuals**: Consum energètic per mesos (Gener-Desembre)
- **Consum d'aigua**: Desglossament per mesos amb tarifes reals
- **Distribució de costos**: Gràfic circular amb desglose per tipus de consum
- **Períodes especials**: Comparativa de consumo en Setmana Santa, Estiu (Juny-Agost) i Nadal vs promig anual
- **Gast total anual**: Sumatori de tots els costos

### 📋 Anàlisi Detallat
- **8 Càlculs principals**:
  1. Consum elèctric de l'any complet (kWh)
  2. Consum elèctric del període escolar (Sept-Jun)
  3. Consum d'aigua de l'any complet (m³)
  4. Consum d'aigua del període escolar (Sept-Jun)
  5. Consumibles d'oficina de l'any complet (€)
  6. Consumibles d'oficina del període escolar (€)
  7. Productes de neteja de l'any complet (€)
  8. Productes de neteja del període escolar (€)

- **Comparativa**: Taula amb comparació entre any escolar i any complet
- **Desglossament de tarifes**: Detall complet de la tarifa d'aigua d'Aigües de Barcelona

### 🌱 Calculadora de Reducció
- **Menú de selecció**: Elegir entre Energía, Água, Consumibles o Neteja
- **Gràfics comparatius**: Baseline vs accions seleccionades amb evolució en 3 anys
- **Estratègies d'estalvi**:
  - **Energía**: 4 accions (LED, Bateries, HVAC, Auditoria)
  - **Água**: 4 accions (Grifos baix flux, Reparació fuites, Riego intel·ligent, Aigües grises)
  - **Consumibles**: 4 accions (Digitalització, Paper reciclat, Inventaris, Reutilització)
  - **Neteja**: 4 accions (Productes ecològics, Microfiber, Formació, Compra a granel)
- **Principis d'Economia Circular**: Guia de reducció, reutilització, reciclatge i recuperació

## 🔧 Funcionalitats Técnicas

### Dades i Càlculs
- ✅ Càrrega de dades des de `dataclean.json`
- ✅ Extrapolació intel·ligent de dades mensuals (12 mesos)
- ✅ Factors mensuales de consumo segons estació
- ✅ Inclusió de consumo de nube (150 kWh/dia)
- ✅ Inclusió de refrigeració de nube (800 L/dia)
- ✅ Tarifes reals Aigües de Barcelona:
  - Cánon de l'Aigua amb tramos progresivos
  - TMTR (Tasa Metropolitana de Tratamiento de Residuos)
  - Cànon de l'Aigua (Generalitat de Catalunya)
  - Cuotas fijas de disponibilidad
  - Calibración de contador
- ✅ Distribució automàtica de consumibles i neteja en mesos de vacacions

### Análisis
- ✅ Períodes escolars (Setembre-Juny)
- ✅ Períodes especials (Setmana Santa, Estiu, Nadal)
- ✅ Inflació aplicada (3% anual)
- ✅ Reductions progressives en 3 anys

### Interfície
- ✅ Navegació en 3 seccions (Dashboard, Análisis, Calculadora)
- ✅ Responsive design (Desktop, Tablet, Mobile)
- ✅ Temes de color per tipo de consum
- ✅ Gràfics interactius amb Chart.js
- ✅ Totalment en català

### Persistència
- ✅ localStorage per guardar accions seleccionades

## 📱 Responsiveness

La web es completament responsive i funciona correctament en:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile Landscape (480px - 768px)
- 📱 Mobile (360px - 480px)
- 📱 Mobile Extra Pequeño (<360px)

## 📊 Tarifes Aplicades

### Electricitat
- **Preu**: 0,25 €/kWh (Barcelona 2025)

### Agua (Aigües de Barcelona - Tarifa No Doméstica)
- **Cánon de l'Aigua**:
  - Tramo 1 (0-500 m³): 1,45 €/m³
  - Tramo 2 (501-1.500 m³): 1,85 €/m³
  - Tramo 3 (>1.500 m³): 2,15 €/m³
  
- **Tractament d'Aigües**:
  - Tramo 1 (0-500 m³): 1,25 €/m³
  - Tramo 2 (501-1.500 m³): 1,65 €/m³
  - Tramo 3 (>1.500 m³): 1,95 €/m³

- **Impostos**:
  - TMTR: 0,58 €/m³
  - Cànon de l'Aigua (Generalitat): 0,092 €/m³

- **Cuotas Fijas**:
  - Disponibilidad Suministro: 8,50 €/mes
  - Disponibilidad Tratamiento: 6,75 €/mes
  - Calibración Contador: 150 € (anual)

### Consumibles
- **Promedio**: 180 €/mes
- **Reduccio en vacacions**: 50% Setmana Santa, 0% Estiu (Juny-Agost), 50% Nadal

### Neteja
- **Promedio**: 1.200 €/mes (inclou sueldo personal + material)
- **Constant**: Tot l'any

## 🛠️ Tecnologies Utilitzades

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Gràfics**: Chart.js v4.4.0
- **Emmagatzemament**: localStorage (navegador)
- **Idioma**: Català (ca-ES)
- **No utilitza**: Base de dades, build tools, frameworks

## 📁 Estructura del Projecte

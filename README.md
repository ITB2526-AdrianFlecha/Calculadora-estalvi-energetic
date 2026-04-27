#  Calculadora d'Estalvi Energètic

Una aplicació web responsive per analitzar i gestionar els consums energètics, d'aigua, consumibles i neteja, amb projeccions realistes i estratègies de reducció de costos.

##  Funcionalitats Principals

###  Dashboard
- **KPI Cards**: Visualització ràpida de costos anuals i mitjanes mensuals
- **Gràfics mensuals**: Consum energètic per mesos (Gener-Desembre)
- **Consum d'aigua**: Desglossament per mesos amb tarifes reals
- **Distribució de costos**: Gràfic circular amb desglosse per tipus de consum
- **Períodes especials**: Comparativa de consums en Setmana Santa, Estiu (Juny-Agost) i Nadal vs mitjana anual
- **Despesa total anual**: Sumatori de tots els costos.

###  Anàlisi Detallat
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

###  Calculadora de Reducció
- **Menú de selecció**: Elegir entre Energia, Aigua, Consumibles o Neteja
- **Gràfics comparatius**: Baseline vs accions seleccionades amb evolució en 3 anys
- **Estratègies d'estalvi**:
  - **Energia**: 4 accions (LED, Bateries, HVAC, Auditoria)
  - **Aigua**: 4 accions (Aixetes baix flux, Reparació fuites, Riego intel·ligent, Aigües grises)
  - **Consumibles**: 4 accions (Digitalització, Paper reciclat, Inventaris, Reutilització)
  - **Neteja**: 4 accions (Productes ecològics, Microfibres, Formació, Compra a granel)
- **Principis d'Economia Circular**: Guia de reducció, reutilització, reciclatge i recuperació

##  Funcionalitats Tècniques

### Dades i Càlculs
-  Càrrega de dades des de `dataclean.json`
-  Extrapolació intel·ligent de dades mensuals (12 mesos)
-  Factors mensuals de consum segons estació
-  Inclusió de consum de núvol(150 kWh/dia)
-  Inclusió de refrigeració de núvol (800 L/dia)
-  Tarifes reals Aigües de Barcelona:
  - Cànon de l'Aigua amb trams progressius
  - TMTR (Taxa Metropolitana de Tractament de Residus)
  - Cànon de l'Aigua (Generalitat de Catalunya)
  - Quotes fixes de disponibilitat
  - Calibració de comptador
-  Distribució automàtica de consumibles i neteja en mesos de vacances

### Anàlisis
-  Períodes escolars (Setembre-Juny)
-  Períodes especials (Setmana Santa, Estiu, Nadal)
-  Inflació aplicada (3% anual)
-  Reduccions progressives en 3 anys

### Interfície
-  Navegació en 3 seccions (Dashboard, Anàlisis, Calculadora)
-  Responsive design (Desktop, Tablet, Mobile)
-  Temes de color per tipus de consum
-  Gràfics interactius amb Chart.js
-  Totalment en català

### Persistència
-  localStorage per guardar accions seleccionades

##  Responsiveness

La web és completament responsive i funciona correctament en:
-  Desktop (1024px+)
-  Tablet (768px - 1024px)
-  Mobile Landscape (480px - 768px)
-  Mobile (360px - 480px)
-  Mobile Extra petit (<360px)

##  Tarifes Aplicades

### Electricitat
- **Preu**: 0,25 €/kWh (Barcelona 2025)

### Aigua (Aigües de Barcelona - Tarifa No Domèstica)
- **Cànon de l'Aigua**:
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

- **Quotes Fixes**:
  - Disponibilitat Suministre: 8,50 €/mes
  - Disponibilitat Tractament: 6,75 €/mes
  - Calibració Comptador: 150 € (anual)

### Consumibles
- **Promig**: 180 €/mes
- **Reducció en vacacions**: 50% Setmana Santa, 0% Estiu (Juny-Agost), 50% Nadal

### Neteja
- **Promedio**: 1.200 €/mes (inclou sueldo personal + material)
- **Constant**: Tot l'any

##  Tecnologies Utilitzades

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Gràfics**: Chart.js v4.4.0
- **Emmagatzemament**: localStorage (navegador)
- **Idioma**: Català (ca-ES)
- **No utilitza**: Base de dades, build tools, frameworks

##  Estructura del Projecte
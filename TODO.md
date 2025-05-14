# TODO - MongoDB Cluster Project

## Praktické implementace

### 1. Základní nastavení
- [x] Instalace MongoDB
  - [x] Výběr verze MongoDB
  - [ ] Vytvoření keyfile pro MongoDB
  - [ ] Nastavení autentizace a autorizace

### 2. Architektura
- [x] Design architektury
  - [x] Vytvoření schématu v draw.io
  - [x] Definice počtu a vlastností clusterů
  - [x] Definice počtu a vlastností uzlů (minimálně 3)
  - [x] Definice počtu a vlastností shardů (minimálně 3)
  - [x] Definice počtu a vlastností replikací (minimálně 3)

### 3. Docker konfigurace
- [x] Vytvoření docker-compose.yml
  - [x] Konfigurace MongoDB clusteru
  - [x] Nastavení replikace
  - [x] Nastavení shardingu
  - [ ] Konfigurace zabezpečení

### 4. Data
- [ ] Příprava dat
  - [ ] Vyhledání a zpracování 3 datových souborů
  - [ ] Zajištění alespoň 5000 záznamů v jednom souboru
  - [ ] Vytvoření Python skriptu pro zpracování dat
  - [ ] Vytvoření JupyterLab notebooku
  - [ ] Příprava statistik a grafů

### 5. Dotazy
- [ ] Vývoj dotazů
  - [ ] Práce s daty (6+ dotazů)
  - [ ] Agregační funkce (6+ dotazů)
  - [ ] Konfigurace (6+ dotazů)
  - [ ] Nested dokumenty (6+ dotazů)
  - [ ] Indexy (6+ dotazů)
  - [ ] Testování výpadku uzlů
  - [ ] Implementace validačního schématu

### 6. Testování
- [ ] Testování clusteru
  - [ ] Testování replikace
  - [ ] Testování shardingu
  - [ ] Testování výpadku uzlů
  - [ ] Testování zálohování

## Dokumentace

### 1. Úvod
- [ ] Popis tématu projektu
- [ ] Co se v práci dozví čtenář
- [ ] Co není součástí projektu, ale by mohlo být
- [x] Uvedení verze MongoDB

### 2. Architektura
- [x] Popis schématu a architektury
- [x] Popis konfigurace
  - [ ] CAP teorém
  - [x] Detaily clusteru
  - [x] Detaily uzlů
  - [x] Detaily shardingu
  - [x] Detaily replikace
  - [x] Detaily perzistence dat
  - [x] Detaily distribuce dat
  - [ ] Detaily zabezpečení

### 3. Funkční řešení
- [x] Popis struktury
- [x] Popis instalace
- [x] Dokumentace docker-compose.yml

### 4. Případy užití a studie
- [ ] Popis využití MongoDB
- [ ] Důvod výběru MongoDB
- [ ] 3 případové studie (minimálně 1/2 A4 každá)

### 5. Výhody a nevýhody
- [ ] Popis výhod MongoDB
- [ ] Popis nevýhod MongoDB
- [ ] Výhody a nevýhody konkrétního řešení

### 6. Data
- [ ] Popis datových souborů
- [ ] Popis práce s daty
- [ ] Popis vytvořených statistik
- [ ] Popis vytvořených grafů

### 7. Dotazy
- [ ] Dokumentace všech dotazů
- [ ] Popis kategorií dotazů
- [ ] Popis výsledků dotazů

### 8. Závěr
- [ ] Kritické hodnocení práce
- [ ] Shrnutí závěrů
- [ ] Popis možností využití řešení

### 9. Zdroje
- [ ] Seznam použitých zdrojů
- [ ] Seřazení zdrojů abecedně
- [ ] Uvedení použitých nástrojů

## Přílohy
- [ ] Data
  - [ ] 3 datasets
  - [ ] Python skript (JupyterLab)
- [ ] Dotazy
  - [ ] Soubor se všemi dotazy
  - [ ] Zadání v přirozeném jazyce
  - [ ] Řešení v jazyce MongoDB
- [x] Funkční řešení
  - [x] docker-compose.yml
  - [x] Skripty pro zprovoznění
  - [x] Další požadované soubory

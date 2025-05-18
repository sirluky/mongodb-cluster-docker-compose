# 3. Případy užití a případové studie

Tato kapitola popisuje vhodné případy užití MongoDB, konkrétní důvody volby této databáze v projektu a tři případové studie z praxe.

## 3.1 Pro jaké účely je MongoDB vhodná?
- Práce s velkými objemy nestrukturovaných nebo semi-strukturovaných dat (např. JSON, dokumenty)
- Horizontální škálování (sharding) při vysokých nárocích na zápis/čtení
- Systémy s požadavkem na vysokou dostupnost a odolnost (replikace)
- Rychlý vývoj (schema-less model, snadná změna struktury dat)
- Analytické systémy, logování, e-commerce, IoT, real-time aplikace

## 3.2 Proč byla MongoDB zvolena pro tento projekt?
- Popularita, z daných databází má nejsilnější komunitu. Znamená i nejvíce dokumentace
- Dataset obsahuje velké množství záznamů s různorodou strukturou (e-commerce data)
- Potenciál horizontálního škálování (sharding) pro efektivní práci s velkými daty
- Možnost snadné replikace a zálohování
- Podpora pro rychlé dotazy i nad rozsáhlými kolekcemi
- Snadná integrace s Pythonem a analytickými nástroji

## 3.3 Proč nebyla zvolena jiná NoSQL databáze?
- **Redis** – primárně pro caching, složitější pro analytická data
- **Cassandra** – vhodná pro time-series, méně flexibilní pro složité dotazy
- **Elasticsearch** – výborný pro fulltext, ne pro transakční/analytická data
- MongoDB je pro tento typ dat (e-commerce, dokumentová struktura, analytika) nejvhodnější

## 3.4 Případové studie

### Studie 1: E-commerce platforma
**Popis:**
Velká e-commerce platforma potřebovala škálovat databázi pro objednávky, produkty a zákazníky. MongoDB umožnila horizontální škálování pomocí shardingu a vysokou dostupnost díky replikaci. Výsledkem bylo zrychlení odezvy systému a možnost zpracovávat miliony transakcí denně.

**Použité technologie:** MongoDB sharding, replikace, automatizované zálohování

**Výsledek:**
- Zvýšení výkonu o 60 %
- Snížení výpadků systému
- Snadnější rozšiřování systému

### Studie 2: IoT analytická platforma
**Popis:**
Společnost sbírající data z tisíců IoT zařízení potřebovala ukládat a analyzovat velké množství časových řad. MongoDB díky shardingové architektuře umožnila efektivní ukládání, agregace a analýzu dat v reálném čase.

**Použité technologie:** MongoDB, agregace, horizontální škálování

**Výsledek:**
- Zpracování milionů datových bodů za minutu
- Možnost škálovat na desítky serverů
- Jednoduchá integrace s analytickými nástroji

### Studie 3: Log management systém
**Popis:**
Firma potřebovala řešit centralizované ukládání a analýzu logů z různých aplikací. MongoDB umožnila díky flexibilnímu schématu a shardingové architektuře efektivní ukládání i rychlé dotazy napříč obrovskými kolekcemi.

**Použité technologie:** MongoDB, sharding, replikace, indexování

**Výsledek:**
- Rychlé vyhledávání v miliardách záznamů
- Možnost snadného rozšíření úložiště
- Zjednodušení správy logů a reportingu

---

V další kapitole budou popsány výhody a nevýhody MongoDB a konkrétního řešení.

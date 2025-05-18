# 4. Výhody a nevýhody

Tato kapitola shrnuje výhody a nevýhody MongoDB obecně i konkrétního řešení v tomto projektu.

## 4.1 Výhody MongoDB
- Horizontální škálování (sharding) – vhodné pro velké objemy dat
- Vysoká dostupnost díky replikaci
- Flexibilní schéma (schema-less)
- Rychlé dotazy díky indexům
- Snadná integrace s moderními jazyky a nástroji (Python, BI, Jupyter)
- Aktivní komunita a rozsáhlá dokumentace

## 4.2 Nevýhody MongoDB
- Složitější správa a konfigurace clusteru (oproti single-node DB)
- Vyšší nároky na hardware při větších clusterech
- Nehodí se pro silně relační data s komplexními transakcemi
- Některé operace (např. JOIN) jsou omezené

## 4.3 Výhody řešení v tomto projektu
- Plně automatizované nasazení (Docker Compose, Makefile)
- Možnost rychlého testování a opakovaného nasazení
- Ověřený postup pro sharding a replikaci
- Zabezpečení pomocí keyfile autentizace
- Snadné nahrání a analýza reálných dat

## 4.4 Nevýhody řešení v tomto projektu
- Vše běží na jednom stroji (omezená simulace reálného HA prostředí)
- Výkon omezen hardwarem hostitele
- Pro produkční nasazení by bylo nutné rozdělit uzly na různé servery

---

V další kapitole budou popsána případná specifika řešení.

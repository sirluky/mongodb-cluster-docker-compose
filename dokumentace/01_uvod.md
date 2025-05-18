# Úvod

Tato dokumentace popisuje proces návrhu, implementace a nasazení shardingovaného MongoDB clusteru v Dockeru, včetně automatizace pomocí Makefile, nahrání dat, analýzy a popisu architektury. Dokumentace je zpracována dle požadavků semestrální práce a obsahuje všechny povinné části.

## Téma a cíle projektu
Cílem projektu je vytvořit plně funkční shardingovaný cluster MongoDB s replikací, zabezpečením (keyfile autentizace), automatizovaným nasazením pomocí Docker Compose a Makefile, a naplněním reálnými daty z veřejného datasetu. Součástí je i základní analýza dat a popis architektury.

## Co se v dokumentaci dozvíte
- Principy a architekturu MongoDB clusteru (sharding, replikace, distribuce dat, zabezpečení)
- Detailní popis nasazení a konfigurace prostředí pomocí Docker Compose a Makefile
- Postup nahrání a analýzy reálných dat
- Výhody a nevýhody zvoleného řešení
- Případové studie použití MongoDB

## Co není součástí projektu
- Vývoj vlastního klientského rozhraní nebo aplikace nad databází
- Detailní návrh vlastního schématu (používán je veřejný dataset)
- Řešení pokročilých bezpečnostních politik mimo povinnou autentizaci

## Použité technologie
- **MongoDB**: 6.0.2 (aktuální verze v době zpracování, splňuje požadavek max. 3 verze zpětně)
- **Docker, Docker Compose**: pro automatizované nasazení clusteru
- **Python, Pandas, Numpy**: pro analýzu a úpravu dat
- **Jupyter Notebook**: pro vizualizaci a analýzu dat
- **Makefile**: pro zjednodušení a automatizaci spouštění všech kroků

## Stručný popis postupu
1. Automatizované vytvoření clusteru (sharding, replikace, zabezpečení)
2. Nahrání a základní analýza dat
3. Ověření funkčnosti a popis architektury
4. Zpracování případových studií a analýza výhod/nevýhod

---

V dalších kapitolách jsou jednotlivé kroky popsány podrobně včetně ukázek konfigurace a skriptů.

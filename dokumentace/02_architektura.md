# 1. Architektura

Tato kapitola detailně popisuje architekturu MongoDB clusteru, jeho nasazení, konfiguraci, sharding, replikaci, CAP teorém, perzistenci a zabezpečení.

## 1.1 Schéma a popis architektury

Cluster je tvořen následujícími komponentami:
- **2 konfigurační servery** (configsvr01, configsvr02) – tvoří replikační set pro metadata clusteru.
- **3 shardy** (každý shard je replikační set o 3 uzlech, např. shard01-a, shard01-b, shard01-c)
- **2 routery (mongos)** – zajišťují rozdělování dotazů na správné shardy
- **Seeder** – pomocný kontejner pro nahrávání dat
- **Jupyter notebook** – pro analýzu a vizualizaci dat

### Schéma architektury

Schéma clusteru je možné vytvořit v draw.io podle této textové struktury:

```
[Client]
   |
 [Router01]---[Router02]
   |            |
 [Configsvr01]--[Configsvr02]--[Configsvr03]
   |            |         |
 [Shard01]     [Shard02]  [Shard03]
 (3 uzly)      (3 uzly)   (3 uzly)
```

Každý shard je samostatný replikační set (PSS – Primary, Secondary, Secondary) a cluster je zabezpečen keyfile autentizací.

### Popis architektury
- Architektura odpovídá doporučenému produkčnímu nasazení MongoDB: 3 konfigurační servery, každý shard jako replikační set, více routerů pro vysokou dostupnost.
- Proč takto? Tato architektura umožňuje škálování (sharding), vysokou dostupnost (replikace), odolnost proti výpadku a bezpečnost.
- Odlišnosti od doporučení: Vše běží v Dockeru na jednom stroji (pro účely testování a výuky), v produkci by byly uzly na oddělených serverech.

## 1.2 Specifika konfigurace  

### 1.2.1 CAP teorém
- MongoDB v této konfiguraci poskytuje **CP** (Consistency, Partition tolerance):
  - **Konzistence** je zajištěna díky replikaci a majority zápisu.
  - **Partition tolerance** je zajištěna díky replikaci a shardingové architektuře.
  - **Availability** je částečně obětována při výpadku většiny replik v setu.
- Proč je to dostačující? Pro většinu analytických a transakčních úloh je důležitější konzistence a odolnost proti výpadkům než absolutní dostupnost za každou cenu.

### 1.2.2 Cluster
- Používá se **jeden cluster** MongoDB, protože cílem je demonstrovat horizontální škálování a replikaci v rámci jednoho logického celku.

### 1.2.3 Uzly
- Každý shard i config server je tvořen **3 uzly** (Primary + 2x Secondary), což je doporučené minimum pro zajištění replikace a odolnosti.
- Proč 3? Zajišťuje většinové hlasování a možnost přežití výpadku jednoho uzlu.

### 1.2.4 Sharding
- V clusteru jsou **3 shardy**, každý s vlastním replikačním setem.
- Proč 3? Umožňuje horizontální škálování a rozdělení dat podle klíče, což je pro větší dataset vhodné.

### 1.2.5 Replikace
- Každý replikační set (shard i config server) má **3 repliky**.
- Proč 3? Zajišťuje vysokou dostupnost a možnost recovery při výpadku jednoho uzlu.

### 1.2.6 Perzistence dat
- Data jsou ukládána na persistentní Docker volumes (`/data/db`, `/data/configdb`).
- MongoDB používá write-ahead log (journal) pro zajištění perzistence i při výpadku.
- Primární paměť (RAM) slouží pro cache, sekundární (disk) pro trvalé uložení.
- Nahrávání a ukládání dat probíhá pomocí skriptů v kontejneru `seeder`.

### 1.2.7 Distribuce dat
- Data jsou rozdělována mezi shardy podle sharding klíče (nastaveno v `/scripts/init-router.js`).
- Každý zápis/čtení je směrován přes router na správný shard.
- Replikace zajišťuje, že každý záznam je na více uzlech v rámci shardu.
- Distribuci lze ověřit příkazem `sh.status()` a `rs.status()` v MongoDB shellu.

### 1.2.8 Zabezpečení
- Cluster používá **keyfile autentizaci** pro zabezpečení komunikace mezi uzly a povinnou autentizaci uživatelů.
- Každý kontejner má přístup k keyfile (`/data/mongodb-keyfile`).
- Po inicializaci je vytvořen administrátorský účet (viz `/scripts/auth.sh`).

---

V další kapitole bude popsána struktura řešení, popis docker-compose.yml a Makefile, a návod na spuštění celého prostředí.

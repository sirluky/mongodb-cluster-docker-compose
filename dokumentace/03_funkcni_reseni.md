# 2. Funkční řešení

Tato kapitola obsahuje popis adresářové struktury, jednotlivých souborů, detailní rozbor docker-compose.yml, Makefile a návod na instalaci a spuštění prostředí.

## 2.1 Struktura řešení

Adresářová struktura projektu:

```
├── dataset/                # Soubory s daty (CSV)
├── docker/                 # Dockerfile a keyfile pro build kontejnerů
├── dokumentace/            # Dokumentace projektu (tento adresář)
├── scripts/                # Skripty pro inicializaci, autentizaci, nahrání dat, dotazy
├── visualization/          # Jupyter notebooky a vizualizace dat
├── docker-compose.yml      # Hlavní konfigurační soubor Docker Compose
├── Makefile                # Automatizace buildů, spuštění, inicializace
├── seeder.Dockerfile       # Dockerfile pro kontejner seeder
├── readme.md               # Základní popis projektu a návod
└── ...
```

### Popis klíčových souborů a složek
- `docker-compose.yml` – Definuje všechny služby clusteru (shardy, config servery, routery, seeder, jupyter), persistentní svazky a síť.
- `Makefile` – Automatizuje spuštění, inicializaci, nahrání dat, správu clusteru.
- `scripts/` – Obsahuje:
  - `init-*.js` – inicializace jednotlivých částí clusteru
  - `auth.js` – nastavení autentizace
  - `insert_*.py` – python skripty pro nahrání dat
  - `queries.js` – ukázky dotazů
  - `create-indexes.js` – tvorba indexů
- `docker/` – Dockerfile pro build MongoDB kontejnerů a keyfile pro zabezpečení
- `dataset/` – CSV soubory s daty (viz kapitola 6)
- `visualization/` – Jupyter notebooky a skripty pro analýzu dat

## 2.1.1 docker-compose.yml

Soubor definuje tyto služby:
- **seeder** – kontejner s Pythonem pro nahrávání dat
- **jupyter** – Jupyter notebook pro analýzu a vizualizace
- **router01, router02** – mongos routery
- **configsvr01-03** – konfigurační servery (replikační set)
- **shard01-a/b/c, shard02-a/b/c, shard03-a/b/c** – jednotlivé uzly shardů (každý shard je replikační set)

Každá služba má připojené volume pro persistentní data a skripty. Všechny kontejnery používají společný keyfile pro zabezpečení.

Příklad (zkráceně):
```yaml
services:
  seeder:
    build:
      context: .
      dockerfile: seeder.Dockerfile
    volumes:
      - ./scripts:/scripts
      - ./dataset:/dataset
    entrypoint: ["sleep", "infinity"]
  ...
  router01:
    build: 
      context: docker
    container_name: router-01
    command: mongos --port 27017 --configdb rs-config-server/... --keyFile /data/mongodb-keyfile
    ...
  shard01-a:
    build: 
      context: docker
    container_name: shard-01-node-a
    command: mongod --port 27017 --shardsvr --replSet rs-shard-01 --keyFile /data/mongodb-keyfile
    ...
volumes:
  mongodb_cluster_shard01_a_db:
  ...
```

## 2.2 Instalace a spuštění

### Požadavky
- Docker, Docker Compose
- (volitelně) Python 3.x (pro úpravy dat)

### Postup spuštění
1. **Stažení repozitáře**
   ```bash
git clone <repo-url>
cd mongodb-cluster-docker-compose
```
2. **Vytvoření a spuštění clusteru**
   ```bash
make setup
```
   - Tento příkaz provede kompletní inicializaci: sestaví kontejnery, inicializuje config servery, shardy, routery, nastaví autentizaci, vytvoří indexy a nahraje data.
3. **Ověření běhu clusteru**
   - Připojte se k routeru:
   ```bash
docker compose exec router01 mongosh --port 27017 -u "admin_lukas" --authenticationDatabase admin
sh.status()
```
4. **Spuštění Jupyter notebooku** (pro analýzu dat):
   - Notebook je dostupný na http://localhost:8888 (token je nastaven na `dev`)

### Automatizace pomocí Makefile

Makefile obsahuje cíle pro:
- `docker-up` – spuštění všech kontejnerů
- `docker-down` – vypnutí kontejnerů
- `setup` – kompletní inicializace (včetně nahrání dat)
- `docker-insert-data` – opětovné nahrání dat
- `docker-create-indexes` – vytvoření indexů
- a další (viz Makefile)

---

V další kapitole budou popsány případy užití MongoDB, důvody volby této databáze a případové studie.

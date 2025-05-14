# PREZENČNÍ FORMA - Semestrální projekt

## Obecné informace & obhajoba

### Obecné informace k semestrální práci

Semestrální práci zpracovává každý student individuálně.

Semestrální práce se skládá z:
- Funkčního řešení
- Dokumentace
- Povinných příloh k dokumentaci
- Ostatních nepovinných příloh

Minimální rozsah dokumentace k semestrální práci není stanoven, ovšem semestrální práce musí mít zpracované jednotlivé části s dostatečnou hloubkou, doporučený rozsah je tak stanoven na **10-30 stran od Úvodu k Závěru**.

Do doporučeného rozsahu nejsou započteny strany, kde obrázek, tabulka nebo jakákoliv jiná ilustrace tvoří půl strany, apod. a dále nejsou započteny přílohy k dokumentaci semestrální práce.

Je nutné dodržet povinné části semestrální práce a dále specifika vybraného tématu, nelze zpracovat pouze vybrané části semestrální práce, v tom případě nebude semestrální projekt obhajitelný.

Práce musí být vlastním dílem autora, jinak nebude uznána (kontrola plagiátorství), v práci je nutné uvést veškeré použité zdroje a nástroje.

### Obhajoba

Obhajoba semestrální práce je povinná a koná se dle vypsaných termínů ve STAGu nebo případně po individuální domluvě s vyučující, práce není uznána pouhým odevzdáním.

Na obhajobu je nutné dostavit se včas a ideálně s mírnou časovou rezervou, jelikož uvítám pokud se ostatní studující zúčastní co největšího počtu prezentací obhajob semestrálních pracích.

- Na obhajobu **nevytvářejte žádnou prezentaci** ve formátu PPTX apod., budete používat odevzdanou semestrální práci, tedy funkční řešení, dokumentaci k semestrální práci včetně příloh, tedy celý ZIP, který jste odeslali.
- Prezentace bude cca na **15 minut** – předvedení stěžejních částí, zajímavostí ze zadaného tématu, čím je vaše práce výjimečná a co naopak nesplňuje.
- Při obhajobě je nutné přesně vědět, jak funguje odevzdané řešení, a to z pohledu architektury, datových toků, jednotlivých dotazů apod., vše musí být reprodukovatelné/spustitelné. Před obhajobou si celé řešení na svém zařízení spusťte, ať časově nenarušujete okénko určené pro další/ho prezentující/ho, tzn. na obhajobu si student ideálně přinese vlastní zařízení (notebook), kde bude mít své řešení plně spuštěné a které bude prezentovat, pokud to není možné, pak řešení spustí na počítači v učebně a své řešení předvede na něm.
- Následují otázky vyučující cca **5-10 minut**.

## Volba tématu semestrální práce

Student si vybírá z níže uvedených témat:
- NoSQL databáze klíč-hodnota – Redis
- NoSQL databáze klíč-hodnota – Valkey
- NoSQL databáze dokumentová – MongoDB
- NoSQL databáze sloupcově orientované – Apache Cassandra

---

# PREZENČNÍ FORMA - Semestrální projekt - zadání - pokyny

## Pro téma 1, 2, 3 a 4 platí následující povinné body semestrální práce, které řádně popište v dokumentaci:

### ÚVOD

Tato kapitola odpovídá na otázky:
- Jaké téma semestrální práce popisuje?
- Co vše se čtenář v seminární práci dozví – oblasti, technologie, případové studie, apod?
- Co není součástí semestrálního projektu, ale vzhledem k tématu by mohlo být?

Nezapomeňte uvést verzi databáze, se kterou pracujete, dodržujte princip, že volíte maximálně tři verze zpětně od aktuální, výjimka existuje jen pro Redis.

### 1. ARCHITEKTURA

Tato kapitola podrobně popisuje, jak jste provedli nasazení NoSQL databáze, proveďte a uveďte, jak konkrétně jste vybranou databázi nasadili a nastavili v rámci clusteru a jak ji využíváte. Tato kapitola musí obsahovat následující podkapitoly:

#### 1.1. Schéma a popis architektury

- Vytvořte schéma architektury a vložte jako obrázek např. pomocí draw.io.
- Podrobně architekturu popište, je nutné minimálně odpovědět na tyto otázky:
  - Jak vypadá architektura Vašeho řešení a proč?
  - Jak se případně liší od doporučeného používání a proč?

#### 1.2. Specifika konfigurace

Podrobně popište specifikaci Vaší konfigurace. Tato kapitola musí obsahovat následující podkapitoly:

##### 1.2.1. CAP teorém

Uveďte, jaké garance Brewerova CAP teorému splňuje Vaše řešení?
Uveďte, proč právě tyto garance jsou pro Vaše řešení dostačující? 
Uveďte řádný popis.

##### 1.2.2. Cluster

Minimálně 1.
Uveďte kolik clusterů používáte a proč?
Uveďte řádný popis.

##### 1.2.3. Uzly

Minimálně 3.
Uveďte kolik nodů používáte a proč?
Uveďte řádný popis.

##### 1.2.4. Sharding

Minimálně 3.
Uveďte kolik shardů používáte a proč je považujete za dostačující vzhledem k použitým datům.
Uveďte řádný popis.

##### 1.2.5. Replikace

Minimálně 3.
Uveďte kolik replikací používáte a proč je považujete za dostačující vzhledem k použitým datům?
Uveďte řádný popis.

##### 1.2.6. Perzistence dat

Minimálně 3.
Uveďte, jakým způsobem řeší Vaše databáze perzistenci dat?
Uveďte, jak pracujte s primární i sekundární pamětí.
Uveďte, jak načítáte a ukládáte data.
Uveďte řádný popis.

##### 1.2.7. Distribuce dat

Z předešlých kapitol vše shrňte a uveďte, jak se data rozdělují pomocí shardů, jak je replikujte, jak konkrétně u Vašeho řešení probíhá celková distribuce dat pro zápis/čtení.
Uveďte řádný popis - textový popis + screeny + popis uvádějící například skript, který provádí automatické rozdělení dat, počty záznamů na jendotlivých uzlech (count),...

##### 1.2.8. Zapezpečení

Uveďte, jakým způsobem jste vyřešili zabezpečení databáze a proč?
Minimálně je požadována autentizace a autorizace.
Upozornění: V případě MongoDB je nutné mít keyfile.

### 2. FUNKČNÍ ŘEŠENÍ

Tato kapitola obsahuje popis návod na zprovoznění funkčního řešení a popis jeho struktury.

#### 2.1. Struktura

Popište adresářovou strukturu Vašeho řešení a jednotlivé soubory, docker-compose.yml popište důkladně samostatně v kapitole 2.1.1.

##### 2.1.1. docker-compose.yml

Uveďte řádný popis vytvořeného docker-compose.yml.

#### 2.2. Instalace

Podrobně popište, jak zprovoznit Vaše řešení.

Řešení je nutné vytvořit tak, aby využívalo docker a spuštění probíhalo maximálně automatizovaně pomocí docker-compose.yml, tzn. že docker-compose.yml odkazuje na veškeré skripty, se kterými pracuje a pro zprovoznění není nutné provádět manuální spuštění pomocných skriptů.

V rámci docker-compose.yml využijte automatické spuštění skriptů poté co se vám spustí kontejnery viz například https://www.baeldung.com/ops/docker-compose-run-script-on-start

### 3. PŘÍPADY UŽITÍ A PŘÍPADOVÉ STUDIE

Popište pro jaké účely (případy užití) ja daná NoSQL databáze vhodná.

Uveďte, pro jaký účel (případ užití) jste si danou databázi zvolili a proč? K čemu Vaše řešení slouží? O jaký případ užití se jedná?

Uveďte, proč jste nezvolili jinou NoSQL databázi vzhledem k účelu?

Vyhledejte a popište 3 případové studie spojené s vybranou NoSQL databází.
Rozsah každé případové studie musí být alespoň 1/2 A4.

### 4. VÝHODY A NEVÝHODY

Popište, jaké výhody a nevýhody má daná NoSQL databáze.

Uveďte, jaké výhody a nevýhody má Vaše řešení a proč?

### 5. DALŠÍ SPECIFIKA

Popis specifických vlastností řešení, pokud nejsou použity žádná specifika, pak uveďte, že vaše řešení je použito jak je doporučeno a nemá vlastní specifika (nic mu nechybí a ani mu nic nepřebývá).

### 6. DATA

Použijte libovolné 3 datové soubory, kdy jeden soubor obsahuje alespoň 5 tis. záznamů.

Popis dat bude ve velké míře zpracován pomocí knihoven jazyka Python a dále bude doplněn dovysvětlujícími texty.

- S jakými typy dat Vaše databáze pracuje, jakého jsou formátu a jak s nimi databáze nakládá?
- Proč jste nezvolili další možné datové struktury pro Vaši databázi?
- S kolika daty Vaše databáze bude pracovat? Jakého rozsahu jsou ukázková data?
- Kolik obsahují prázdných hodnot?
- Jaké úpravy jste s daty prováděli a proč?
- Jaký je zdroj dat? Uveďte URL adresu.
- Pomocí skriptů v Python s využitím knihoven Pandas, Numpy, apod. data popište a proveďte základní analýzu dat (základní statistiky - počty, prázdná pole, suma, průměr, grafické zobrazení, apod.

### 7. DOTAZY

Uveďte a popište 30 NETRIVIÁLNÍCH různých navazujících příkladů včetně řešení (všechny tři datasety popisují jedno téma) a podrobného vysvětlení jednotlivých příkazů.

NETRIVIVÁLNÍ DOTAZ je například dotaz využívající v MongoDB aggregate a zároveň unwind a zároveň group a zároveň sort nebo například aggregate a zároveň lookup a zároveň match a zároveň project a zároveň unset a zároveň ......

Příkazy řádně okomentujete tzn., že každý příkaz zkopírujete z konzole a u každého příkazu uvedete, jaké je jeho obecné chování a jak konkrétně pracuje s daty ve vašem případě a řeší konkrétní úlohu.

Předpoklad je takový, že budete mít příkazy z různých kategorií např.
- "práce s daty" - insert, update, delete, merge
- "agregační funkce",
- "konfigurace",
- "nested (embedded) dokumenty"
- "indexy"

takových kategorií je požadováno alespoň 5, kdy u každé "kategorie" uvedete alespoň 6 příkazů.

Každý dotaz musí vracet nějaká data.
Každý dotaz musí vracet různá data. Nelze, aby stejná data vracelo více dotazů.

Dle zvoleného typu databáze využijte i možnost práce s clusterem, replikačním faktorem a shardingem.
Pokuste se například (mimo jiné) nasimulovat výpadek některého z uzlů a popište možnosti řešení.

Upozornění: V případě MongoDB je nutné mít validační schéma.

### ZÁVĚR

V závěru pochvalně i kriticky zhodnoťte Vaši semestrální práci, popište hloubku zpracování. Shrňte k jakým závěrům jste došli, co je možné s Vaším řešením vykonávat, apod.

### ZDROJE

Uveďte řádně všechny zdroje, se kterými jste pracovali, abecedně seřazené, a to včetně použitých nástrojů.

### PŘÍLOHY DOKUMENTACE

#### Data

Složka pojmenovaná Data, která obsahuje:
- obsahuje minimálně 3 datasety
- obsahuje Python skript (JupyterLab)

#### Dotazy

Složka pojmenovaná Dotazy, která obsahuje:
- 1 soubor se všemi dotazy, kdy každý dotaz obsahuje zadání v přirozeném jazyce a řešení v příslušeném jazyce vybrané NoSQL databáze

#### Funkční řešení

Složka pojmenovaná Funkční řešení, která obsahuje:
- docker-compose.yml
- skripty nutné pro zprovoznění
- případně další složky a soubory nutné pro zprovoznění řešení
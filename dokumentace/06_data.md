# 6. Data a analýza

Tato kapitola popisuje použitá data, jejich zpracování, analýzu a důvody volby konkrétních datových struktur.

## 6.1 Použité datové soubory
Projekt využívá tři hlavní datové soubory z veřejného e-commerce datasetu [Olist Brazilian E-Commerce](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce):
- `olist_orders_dataset.csv` (obsahuje více než 99 000 záznamů)
- `olist_order_items_dataset.csv` (obsahuje přes 110 000 záznamů)
- `olist_products_dataset.csv` (obsahuje přes 32 000 záznamů)

Každý soubor má různou strukturu, všechny jsou ve formátu CSV a byly importovány do MongoDB pomocí Python skriptů.

## 6.2 Popis typů dat a práce s nimi
- Data jsou převáděna do JSON dokumentů, což odpovídá dokumentovému modelu MongoDB
- MongoDB umožňuje efektivní ukládání i dotazování nad těmito daty
- Proč ne jiné struktury? Relační model by byl složitější na škálování a úpravy schématu

## 6.3 Rozsah a kvalita dat
- Celkem importováno přes 200 000 záznamů
- Prázdné hodnoty: v každém souboru se vyskytují, jejich počet je analyzován v Jupyter notebooku

## 6.4 Úpravy dat
- Byly odstraněny nekonzistentní záznamy a prázdné řádky
- Data byla převedena do vhodného formátu pro MongoDB (JSON)
- Propojení mezi soubory zachováno pomocí klíčů (order_id, product_id)

## 6.5 Základní analýza dat (ukázka v Pythonu)

Příklad skriptu pro analýzu dat:
```python
import pandas as pd
orders = pd.read_csv('dataset/olist_orders_dataset.csv')
print('Počet záznamů:', len(orders))
print('Počet prázdných hodnot v každém sloupci:')
print(orders.isnull().sum())
print('Základní statistiky:')
print(orders.describe(include="all"))
```

Výsledky analýzy a vizualizace jsou zpracovány v Jupyter notebooku v adresáři `visualization/`.

## 6.6 Zdroj dat
- [https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)

---

Tímto je dokumentace kompletní dle zadání. Dotazové příklady (kapitola 7) nejsou součástí této dokumentace dle zadání.

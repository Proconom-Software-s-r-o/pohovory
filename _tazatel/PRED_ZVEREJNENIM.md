# Před zveřejněním na GitHubu

Složka `_tazatel/` obsahuje vzorová řešení všech pěti úkolů. Kdyby se dostala ke kandidátům, zadání je k ničemu – a smazání v pozdějším commitu nepomůže, protože obsah zůstane v historii.

## Doporučený postup: veřejný repozitář bez `_tazatel/`

Stav, ve kterém teď repozitář je, ještě není nikde zveřejněný, takže stačí připravit první commit bez téhle složky:

```sh
# 1) Vzorová řešení a pokyny si odložte mimo repozitář
mv _tazatel ../pohovory-tazatel

# 2) Commit a push toho, co kandidát uvidí
git add -A
git commit -m "Zadani pro pohovory - stavebni denik"
git remote add origin git@github.com:<organizace>/<repo>.git
git push -u origin main
```

`_tazatel/` si pak držte lokálně nebo v separátním privátním repozitáři.

## Varianta: privátní větev

Když je chcete mít pohromadě, dejte je do větve, která se nepushuje:

```sh
git switch -c tazatel
git add _tazatel && git commit -m "Pokyny a reseni pro tazatele"
git switch main          # main zustane bez _tazatel/
```

⚠️ Tohle chrání jen proti nepozornosti – kdokoli s přístupem do repozitáře si větev může vypsat. Pro veřejný repozitář použijte první variantu.

## Kontrola před pushnutím

```sh
git ls-files | grep -i tazatel     # nesmí nic vypsat
git log --all --name-only | grep -i tazatel
```

## Co se naopak pushnout má

- `backend/Pohovor.Api/Data/*.json` – bez nich nemá kandidát co zobrazit.
- `frontend/.env.example` – kandidát si z něj udělá `.env`.
- `frontend/.env` **ne** (je v `.gitignore`), i když v něm nic citlivého není.

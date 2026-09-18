# Pokyny pro tazatele

> ⚠️ **Tahle složka nepatří kandidátovi.** Před zveřejněním repozitáře na GitHubu ji buď smažte, nebo ji držte jen v privátní větvi. Viz [PRED_ZVEREJNENIM.md](PRED_ZVEREJNENIM.md).

## K čemu to je

Kandidáti mají v portfoliu skoro výhradně kód psaný agentem. Tohle je společný základ, na kterém uvidíme, jestli rozumí tomu, co by jim agent napsal: naklonují repozitář, sdílí obrazovku a plní zadání nahlas.

Aplikace je hotová až na pět míst. Nejde o to je všechna stihnout – jde o to, co kandidát říká u toho, co dělá.

## Před pohovorem

1. Pošlete odkaz na repozitář a [README.md](../README.md) den předem, ať má nainstalované .NET 10, Node 22 a pnpm a ať mu projde `dotnet build` a `pnpm install`. Instalace během pohovoru sežere 20 minut.
2. Ať si ověří, že mu naběhne `http://localhost:3000` a `http://localhost:5001/swagger`.
3. Sami si repozitář znovu naklonujte do čisté složky a projděte ho – ať víte, co kandidát vidí.

## Časování (60 minut)

| Čas       | Co                                                              |
| --------- | --------------------------------------------------------------- |
| 0–5 min   | Uvítání, sdílení obrazovky, kandidát si projde repozitář nahlas |
| 5–20 min  | Úkol 1 (backend – create)                                       |
| 20–30 min | Úkol 2 (backend – update)                                       |
| 30–40 min | Úkol 3 (debounce) – tady přijdou otázky na hooky                |
| 40–55 min | Úkol 4 (uložení přes klienta)                                   |
| 55–60 min | Úkol 5 jen pokud zbyde čas, jinak dotazy kandidáta              |

Když se zasekne, napovězte a jděte dál – nechat ho 20 minut bojovat s překlepem nic neukáže.

## Co sledovat

**Zelené vlajky**

- Než začne psát, otevře si vzorový handler / hook a řekne, čím se řídí.
- Přečte si test a odvodí z něj, co se po něm chce.
- Sám se zeptá na okrajové případy (prázdný popis, budoucí datum, schválený záznam).
- Pojmenuje, proč `useEffect` vrací úklidovou funkci, ne jen že ji „tam má".
- Spustí testy dřív, než řekne, že je hotovo.

**Červené vlajky**

- Napíše byznys logiku do controlleru nebo `try/catch` s `return BadRequest(...)` v handleru.
- Filtruje seznam `useEffect`em + `useState` místo `queryKey`.
- Obalí `useMemo`/`useCallback`em všechno, ale neumí říct proč.
- Řekne, že je hotovo, aniž by to jednou spustil.
- Přepíše vzorové soubory, aby mu vyšlo jeho řešení.

## Otázky k jednotlivým úkolům

### Po úkolu 1 a 2 (backend)

- Proč je logika v handleru a ne v controlleru? Co by se stalo, kdyby ji tam někdo dal?
- Proč tu na neexistující záznam vracíme 400, a ne 404?
- Kde je `try/catch`, který z vaší výjimky udělá HTTP 400? (→ `GeneralController.ResolveResponse`)
- Proč je mazání soft delete? Co to komplikuje při čtení?
- `IZaznamManager` se injektuje konstruktorem – kde se registruje a jaký má lifetime? Co by se rozbilo, kdyby byl singleton?
- Kdyby dva lidi uložili záznam ve stejnou chvíli, co se stane? (→ `SemaphoreSlim` v `JsonFileStore`, „poslední vyhraje")
- Co by se muselo změnit, kdyby místo JSON souboru byla databáze? (→ ideálně jen `ZaznamManager`)

### Po úkolu 3 (debounce) – hlavní blok na hooky

- **Co všechno může `useEffect` vrátit?** (→ buď nic, nebo úklidovou funkci; nic jiného – proto se do něj nedává `async` funkce, ta vrací Promise)
- Kdy přesně se ta úklidová funkce zavolá? (→ před každým dalším během efektu a při odmountování)
- Co se stane, když ji tady vynecháte? (→ naskládané timeouty, `setState` nad odmountovanou komponentou)
- Proč to nejde napsat bez `useState`? (→ obyčejná proměnná se při renderu ztratí, `useRef` nevyvolá překreslení)
- Kdy byste místo `useState` sáhl po `useRef`?
- **Jaké další hooky znáte a kdy je použijete?** (`useContext`, `useReducer`, `useRef`, `useLayoutEffect`, `useId`, `useTransition`, `useDeferredValue`, `useImperativeHandle`, `useSyncExternalStore`)
- Rozdíl `useEffect` vs. `useLayoutEffect`?
- `useDeferredValue` dělá podobnou věc – proč jsme tu použili vlastní debounce? (→ debounce omezuje počet dotazů na server, `useDeferredValue` jen prioritu renderu)
- Proč se komponenta v dev režimu vyrenderuje dvakrát a proč to vadí jen špatně napsaným efektům? (→ StrictMode)
- Jaká jsou pravidla hooků a proč existují?

### Po úkolu 4 (uložení)

- Proč po uložení stačí `invalidateQueries` a nemusíme si ručně přepisovat stav?
- Co dělá `queryKey` a proč v něm máme filtry? Co by se stalo, kdyby tam nebyly?
- Kdy by dávalo smysl místo invalidace použít `setQueryData` nebo optimistický update? Jaká je nevýhoda?
- Proč tu není Redux?
- `useCallback` s `[queryClient, tToast]` – co se stane, když se pole závislostí vynechá úplně?
- Kde se toast s chybou z backendu bere? (→ interceptor v `apiFactoryHelper.ts` + `Utils.handleError`)

### Po úkolu 5

- Proč `useMemo` a ne prostě spočítat při renderu? Kdy je `useMemo` zbytečný?
- `useMemo` vs. `useCallback` – co je čím?
- Kdyby byl seznam 50 000 řádků, co byste udělal jinak? (→ virtualizace, server-side filtrování/stránkování)

### Obecné

- Proč tu má každá query vlastní hook? Co to přináší?
- Klíčem v i18n je rovnou český text – výhody a nevýhody?
- Co byste na téhle codebase změnil, kdyby to byl ostrý projekt?
- Jak byste tuhle věc testoval? Co byste testoval a co ne?

## Vzorová řešení

Ve složce [reseni/](reseni/) – **nedávejte je kandidátovi**, slouží na rychlé porovnání.

| Úkol | Soubor                                                                                      |
| ---- | ------------------------------------------------------------------------------------------- |
| 1    | [reseni/backend/CreateZaznamHandler.cs](reseni/backend/CreateZaznamHandler.cs)               |
| 2    | [reseni/backend/UpdateZaznamHandler.cs](reseni/backend/UpdateZaznamHandler.cs)               |
| 3    | [reseni/frontend/useDebouncedValue.ts](reseni/frontend/useDebouncedValue.ts)                 |
| 4    | [reseni/frontend/useUlozZaznam.ts](reseni/frontend/useUlozZaznam.ts)                         |
| 5    | [reseni/frontend/stavebniDenikTopbar.souhrn.tsx](reseni/frontend/stavebniDenikTopbar.souhrn.tsx) |

Se všemi pěti nasazenými je `dotnet test` 11/11 zelených, `pnpm test` 8/8, `pnpm lint` bez varování.

## Po pohovoru

Repozitář vraťte do výchozího stavu:

```sh
git checkout -- .
git clean -fd
```

`backend/Pohovor.Api/Data/*.json` se během pohovoru mění – bez tohohle kroku dostane další kandidát cizí záznamy.

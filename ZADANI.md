# Zadání

Aplikace je rozjetá a z větší části hotová – umí vypsat stavby, vypsat a filtrovat záznamy deníku a mazat je. **Nejde ale nic založit ani uložit.** To je vaše práce.

Úkoly jsou seřazené tak, jak dávají smysl. Nemusíte stihnout všechny; důležitější než množství je, jak přemýšlíte, tak u toho prosím nahlas komentujte, co děláte a proč.

**Než začnete:** rozjeďte backend i frontend podle [README.md](README.md) a klikněte si appku, ať víte, co kde je.

Ke každému úkolu je v kódu `TODO` s podrobnějšími poznámkami.

---

## Úkol 1 – backend: založení záznamu

📄 `backend/Pohovor.Api/v1/Modules/Zaznamy/Handlers/CreateZaznamHandler.cs`

Endpoint `POST /api/zaznamy` existuje a je zaregistrovaný, ale handler zatím hází `NotImplementedException`.

Doplňte ho tak, aby:

1. ověřil, že stavba z `request.Zaznam.KStavba` existuje,
2. ověřil, že `Popis` není prázdný,
3. ověřil, že `Datum` není v budoucnosti,
4. doplnil autora (`IClaimResolver`), stav `Rozpracovany` a datum vytvoření,
5. záznam uložil a vrátil jako `ZaznamDTO`.

**Jak poznáte, že je hotovo:** `dotnet test` v `backend/` rozsvítí `CreateZaznamHandlerTests` (testy si přečtěte, přesné znění chybových hlášek berou jako součást zadání). Pak to zkuste ještě ve Swaggeru na `http://localhost:5001/swagger` a mrkněte do `backend/Pohovor.Api/Data/zaznamy.json`.

> Vzor hotového handleru: `GetZaznamyHandler.cs` a `DeleteZaznamHandler.cs` ve stejné složce.

---

## Úkol 2 – backend: editace záznamu

📄 `backend/Pohovor.Api/v1/Modules/Zaznamy/Handlers/UpdateZaznamHandler.cs`

Totéž pro `PUT /api/zaznamy/{ZaznamId}`:

1. načíst záznam, který se edituje,
2. **schválený záznam už nejde měnit**,
3. přepsat editovatelné property (autor a datum vytvoření se nemění),
4. zapsat datum změny, uložit a vrátit `ZaznamDTO`.

**Jak poznáte, že je hotovo:** `UpdateZaznamHandlerTests` jsou zelené.

---

## Úkol 3 – frontend: odložení hledání (debounce)

📄 `frontend/src/common/hooks/useDebouncedValue.ts`

Vyhledávací pole v liště deníku posílá dotaz na API při každém stisku klávesy. Hook `useDebouncedValue` je zatím prázdná skořápka – jen vrací vstup beze změny.

Doplňte ho tak, aby vracel poslední hodnotu, která se po zadanou dobu nezměnila, a aby se rozběhnutý časovač při další změně (a při odmountování komponenty) zrušil.

**Jak poznáte, že je hotovo:** v deníku pište do vyhledávacího pole a sledujte záložku Network – dotaz na `/api/zaznamy` musí odejít až po dopsání, ne po každém písmenu.

---

## Úkol 4 – frontend: uložení záznamu

📄 `frontend/src/stavebniDenik/hooks/useUlozZaznam.ts`

Formulář vpravo je hotový a volá `ulozZaznam(...)`, ten ale zatím jen hodí chybu. Doplňte hook tak, aby:

1. podle toho, jestli dostal `zaznamId`, zavolal create nebo update,
2. po úspěchu zneplatnil query se seznamem záznamů, ať se tabulka překreslí,
3. ukázal success toast,
4. chybu předal do `Utils.handleError` a vrátil `null`.

**Jak poznáte, že je hotovo:** v appce založíte nový záznam, objeví se v tabulce, otevřete ho, upravíte a změna se zase projeví. A je vidět v `zaznamy.json`.

> Vzor hotové zápisové akce: `useSmazZaznam.ts` ve stejné složce. Držte se stejného tvaru.

---

## Úkol 5 (bonus) – frontend: souhrn v liště

📄 `frontend/src/stavebniDenik/stavebniDenikScene/stavebniDenikTopbar.tsx`

Vpravo v liště jsou tři údaje, které zatím ukazují nuly: počet záznamů, průměrný počet pracovníků a období od–do. Dopočítejte je z toho, co je právě v tabulce (tedy včetně filtrů) tak, aby se nepřepočítávaly při každém překreslení.

Pomocné funkce `prumerPracovniku` a `obdobiZaznamu` už v `zaznamUtils.ts` jsou i s testy.

---

## Na co se budeme ptát

Nic z toho není chyták, jde nám o to, jak o věcech přemýšlíte:

- co všechno může vrátit `useEffect` a kdy se to zavolá,
- kdy sáhnout po `useMemo` / `useCallback` a kdy je to zbytečné,
- jaké další hooky znáte a k čemu je používáte,
- proč tu filtry nejsou v `useEffect`u, ale v `queryKey`,
- proč controller nesmí obsahovat byznys logiku,
- proč se na neexistující záznam vrací 400 a ne 404,
- co by se muselo změnit, kdyby místo JSON souboru byla databáze.

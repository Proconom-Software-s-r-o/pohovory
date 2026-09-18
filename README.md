# Pohovor – Stavební deník

Malá dvouvrstvá aplikace pro programovací část pohovoru. Doména je zjednodušený **stavební deník**: ke stavbě se vedou denní záznamy (datum, počasí, teploty, počet pracovníků, popis prací, stav schvalování).

Repozitář je záměrně napsaný ve stejném stylu jako naše ostré projekty, aby se v něm dalo pracovat tak, jak to u nás děláme doopravdy:

- **backend** – ASP.NET Core Web API, CQRS přes MediatR, tenké controllery, DTO + AutoMapper. Místo databáze se **čte a zapisuje do JSON souborů** v `backend/Pohovor.Api/Data/`.
- **frontend** – React 19 + TypeScript + Vite, `@tanstack/react-query`, MUI, i18next, Bootstrap utility třídy.

Zadání pro kandidáta je v **[ZADANI.md](ZADANI.md)**.

---

## Požadavky

| Nástroj    | Verze                                   |
| ---------- | --------------------------------------- |
| .NET SDK   | 10.0                                    |
| Node.js    | 22+                                     |
| pnpm       | 11+ (`corepack enable` nebo `npm i -g pnpm`) |

## Spuštění

### Backend

```sh
cd backend
dotnet restore
dotnet run --project Pohovor.Api
```

Poběží na `http://localhost:5001`, Swagger UI je na `http://localhost:5001/swagger`.

Testy:

```sh
cd backend
dotnet test
```

> Testy jsou po naklonování **červené záměrně** – rozsvítit je je součástí zadání.

### Frontend

```sh
cd frontend
cp .env.example .env    # na Windows: copy .env.example .env
pnpm install
pnpm start-dev
```

Poběží na `http://localhost:3000`. Backend musí běžet zároveň.

Ostatní příkazy:

```sh
pnpm test      # vitest
pnpm lint      # oxlint
pnpm format    # oxfmt
pnpm build     # tsc + vite build
```

## Struktura

```
backend/
  Pohovor.Commons/          sdílené věci – GeneralController, výjimky, JSON úložiště
  Pohovor.Api/
    Startup.cs              registrace DI, AutoMapperu a MediatRu
    Data/                   stavby.json a zaznamy.json = "databáze"
    v1/
      Models/               entity tak, jak leží v JSON souboru (XId, KStavba, Smazano…)
      Enums/
      DTOS/                 DTO + AutoMapper profily
      DataManagers/         přístup k datům (obdoba DbContextu)
      Modules/
        Zaznamy/            ZaznamyController + Handlers/
        Stavby/
        Ciselnik/
  Pohovor.Api.UnitTests/    xUnit + Moq

frontend/
  src/
    appRouter.tsx           routy, scény se načítají lazy
    i18n.ts                 cs/en, klíčem je český text
    queryClient.ts
    common/                 sdílené komponenty, hooky a utility
    hooks/                  useRouteParams, useStavbaDetail
    services/api/           ručně psaný klient ve tvaru NSwag výstupu
    seznamStaveb/           výběr stavby
    stavebniDenik/          hlavní modul
      stavebniDenikScene.tsx
      stavebniDenikContext.ts
      stavebniDenikScene/   komponenty scény
      hooks/                jedna query = jeden hook
      zaznamUtils.ts        + unit testy
```

## Konvence, kterých se držíme

**Backend**

- Každá operace = vlastní `Request` + `Response` + `Handler` (MediatR). Všechny tři třídy jsou v jednom souboru v `Modules/{Modul}/Handlers/`.
- Controller neobsahuje byznys logiku – jen atributy a `ResolveResponse(request)`. Vždy dědí z `GeneralController`.
- Chyby se hlásí vyhozením výjimky, ne návratovou hodnotou. `GeneralController` je mapuje na HTTP kódy (`BadDataException` → 400 se zprávou pro uživatele, `ForbiddenException` → 403, …). V handleru se nepíše try/catch kvůli HTTP kódům.
- Handler nikdy nevrací `null` a nevrací entitu – vrací DTO.
- Mazání je soft delete (`Smazano = DateTime.Now`), při čtení se filtruje `Smazano == null`.
- `CancellationToken` se předává dál do všech async volání.

**Frontend**

- Stránka se jmenuje **scéna** (`*Scene.tsx`), jedna routa = jedna scéna, komponenty scény mají vlastní složku.
- Každá query má vlastní hook v `hooks/` daného modulu; hook vrací memoizovaný objekt `{ query, data }`. Do `common/hooks` se hook stěhuje, až když ho potřebuje víc modulů.
- Server state drží `@tanstack/react-query`. Filtry patří do `queryKey` – ne do `useEffect`u.
- Na API se chodí jen přes `ApiClientFactory`, chyby se chytají do `catch` a předávají do `Utils.handleError`.
- Toasty jen přes `Utils`, potvrzovací dialogy jen přes `useConfirmDialog`.
- MUI komponenty do formulářů se obalují v `common/components/form`, prázdné stavy řeší `NoDataIcon`.
- Datum se drží jako `Moment`, ne jako `Date`.
- Layout hlavně Bootstrap utility třídami, oddělovače přes `react-resizable-panels`.
- Texty přes i18next, klíčem je rovnou český text (`t('Uložit')`), a klíč musí být v `cs` i `en`.
- Formátuje oxfmt (4 mezery, jednoduché uvozovky, 120 znaků), lintuje oxlint.

## Poznámky

- **Autentizace tu není.** Controllery mají explicitně `[AllowAnonymous]`; v ostré aplikaci je na jejich místě `[Authorize(Roles = Role.V1User)]`. Jméno autora záznamu se bere z hlavičky `X-User` (nastavuje se přes `VITE_USER` v `.env`).
- **Gridy nejsou ze Syncfusion.** V ostré aplikaci se Syncfusion používá na gridy a stromy, tady je kvůli licenci nahrazený obyčejnou MUI tabulkou.
- `dotnet build` hlásí `NU1903` u balíčku AutoMapper 13.0.1 – je to stejná verze, jakou má ostrá aplikace, a nechali jsme ji kvůli shodě. Opravená řada 15.x má jinou licenci.

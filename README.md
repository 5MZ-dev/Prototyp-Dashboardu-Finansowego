# Premium Finance Dashboard

Projekt stworzony jako nowoczesny dashboard finansowy z użyciem React, Tailwind CSS oraz Vite.

## Funkcje

- Design w stylu premium z przyjemnym ciemnym motywem i gradientami.
- Pobieranie danych z zewnętrznego API: `https://fakestoreapi.com/products`.
- Wyszukiwanie produktów po tytule, opisie i kategorii.
- Sortowanie listy produktów po cenie rosnąco lub malejąco.
- Automatyczne budowanie przy każdym commicie dzięki GitHub Actions.
- Konfiguracja gotowa do Netlify (`netlify.toml`).

## Uruchomienie lokalne

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Uruchom lokalny serwer deweloperski:
   ```bash
   npm run dev
   ```
3. Zbuduj produkcyjną wersję:
   ```bash
   npm run build
   ```

## Deployment

Repozytorium jest połączone z GitHub i zawiera workflow CI w `.github/workflows/ci.yml`, który buduje aplikację przy każdym pushu na `main`.

### Netlify – Automatyczny deploy z GitHub Actions

Aby skonfigurować automatyczny deployment na Netlify przy każdym commicie:

1. **Utwórz stronę na Netlify:**
   - Zaloguj się na [netlify.com](https://netlify.com)
   - Kliknij "Add new site" → "Import an existing project"
   - Wybierz GitHub i połącz repozytorium
   - Ustaw `npm run build` jako build command i `dist` jako publish folder
   - Po deploymencie skopiuj Site ID z ustawień

2. **Dodaj sekrety do GitHub:**
   - Przejdź do Settings → Secrets and variables → Actions
   - Dodaj `NETLIFY_AUTH_TOKEN`:
     - Na Netlify: User settings → Applications → Personal access tokens
     - Wygeneruj nowy token i skopiuj
   - Dodaj `NETLIFY_SITE_ID` (z kroku 1)

3. **Workflow będzie uruchamiany automatycznie** przy każdym pushu na `main`

### Netlify – Prosty setup

Alternatywnie, jeśli chcesz pominąć GitHub Actions:

1. Połącz repozytorium z Netlify bezpośrednio
2. Ustaw `npm run build` jako build command
3. Ustaw `dist` jako folder publikacji
4. Netlify będzie automatycznie deployować przy każdym pushu

### Vercel

Dodany plik `vercel.json` zawiera gotową konfigurację:

- build command: `npm run build`
- output directory: `dist`

Wystarczy zaimportować repozytorium na [vercel.com](https://vercel.com) i włączyć automatyczny deploy.

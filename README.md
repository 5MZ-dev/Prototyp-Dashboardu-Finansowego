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

### Netlify

Repo jest już gotowy do Netlify dzięki plikowi `netlify.toml`.

1. Połącz repozytorium z Netlify.
2. Ustaw pole `build command` na `npm run build`.
3. Ustaw folder publikacji na `dist`.
4. Jeśli chcesz użyć GitHub Actions do automatycznego deployu, dodaj w repozytorium sekret `NETLIFY_AUTH_TOKEN` i `NETLIFY_SITE_ID`. Workflow znajduje się w `.github/workflows/netlify-deploy.yml`.

### Vercel

Dodałem plik `vercel.json`, więc Vercel powinien poprawnie wykryć ustawienia:

- build command: `npm run build`
- output directory: `dist`

Wystarczy zaimportować repozytorium na Vercel i włączyć automatyczny deploy przy każdym commicie.

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

Aby włączyć automatyczny deployment na Netlify:

1. Połącz repozytorium GitHub z Netlify.
2. Ustaw pole `build command` na `npm run build`.
3. Ustaw folder publikacji na `dist`.

Możesz też łatwo zaimportować repozytorium do Vercel i pozostawić domyślną konfigurację "Vite".

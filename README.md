# Premium Finance Dashboard

Projekt stworzony jako nowoczesny dashboard finansowy z użyciem React, Tailwind CSS oraz Vite.

## Funkcje

- Design w stylu premium z przyjemnym ciemnym motywem i gradientami.
- Pobieranie danych z zewnętrznego API: `https://fakestoreapi.com/products`.
- Wyszukiwanie produktów po tytule, opisie i kategorii.
- Sortowanie listy produktów po cenie rosnąco lub malejąco.
- Wykresy wartości akcji z Yahoo Finance w czasie rzeczywistym.
- Porównawczy widok kilku spółek w jednym miejscu.
- Automatyczne budowanie przy każdym commicie dzięki GitHub Actions.

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

### Vercel – Najszybciej

1. Przejdź do [vercel.com](https://vercel.com)
2. Kliknij "Import Project" i połącz repozytorium GitHub
3. Vercel automatycznie wykryje Vite i ustawienia buildowania
4. Kliknij "Deploy" – strona będzie dostępna pod domeną Vercel

**Zmiany będą deployowane automatycznie** przy każdym puszu na `main`.

### Netlify

1. Przejdź do [netlify.com](https://netlify.com) i zaloguj się
2. Kliknij "Add new site" → "Import an existing project"
3. Wybierz GitHub i połącz repozytorium
4. Netlify automatycznie wykryje ustawienia z `netlify.toml`
5. Kliknij "Deploy site"

**Automatyczne deploymenty** będą się uruchamiać przy każdym commicie na `main`.

### GitHub Actions

Projekt zawiera workflow CI (`.github/workflows/ci.yml`), który buduje i testuje aplikację przy każdym pushu.

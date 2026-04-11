import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

const sortOptions = [
  { value: 'asc', label: 'Cena rosnąco' },
  { value: 'desc', label: 'Cena malejąco' },
];

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Błąd przy pobieraniu danych');
        }
        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (err) {
        setError((err as Error).message || 'Nieznany błąd');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    const matched = products.filter((product) => {
      return (
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)
      );
    });

    return matched.sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price,
    );
  }, [products, query, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden pb-20">
        <div className="pointer-events-none absolute inset-0 bg-hero opacity-80" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-100 shadow-glow">
                Premium Edition
              </div>
              <div className="max-w-2xl space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Finansowy dashboard z klasą.
                </h1>
                <p className="text-lg leading-8 text-slate-300">
                  Przeglądaj produkty w stylu premium, wyszukuj po nazwie i filtruj ceny w czasie rzeczywistym.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Bestsellery</p>
                    <p className="mt-4 text-3xl font-semibold text-white">16+</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Aktualne oferty</p>
                    <p className="mt-4 text-3xl font-semibold text-white">100% live</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">Filtrowanie</h2>
              <p className="mt-3 text-slate-400">
                Użyj wyszukiwarki oraz sortowania, aby szybko znaleźć najlepsze oferty.
              </p>
              <div className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-slate-300">
                  Wyszukaj produkt
                </label>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  placeholder="Szukaj po nazwie, opisie lub kategorii"
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                />
                <label className="block text-sm font-medium text-slate-300">Sortuj po cenie</label>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-950/60 p-6 text-slate-300">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Aktualny stan</p>
                <p className="mt-3 text-3xl font-semibold text-white">{loading ? 'Ładowanie...' : `${filteredProducts.length} ofert`}</p>
                <p className="mt-3 text-sm text-slate-400">Dane pobierane z zewnętrznego API fakestoreapi.com.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1fr_0.38fr]">
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="rounded-full bg-slate-800/80 px-3 py-1">Najlepsze oferty</span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1">Ekskluzywna stylistyka</span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1">Gotowe na produkcję</span>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {loading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse rounded-[2rem] border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl">
                    <div className="mb-5 h-48 rounded-3xl bg-slate-800" />
                    <div className="h-5 w-3/4 rounded-full bg-slate-800" />
                    <div className="mt-4 space-y-3">
                      <div className="h-4 rounded-full bg-slate-800" />
                      <div className="h-4 rounded-full bg-slate-800 w-5/6" />
                    </div>
                  </div>
                ))}

              {!loading && !error && filteredProducts.length === 0 && (
                <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-10 text-center text-slate-400">
                  Nie znaleziono produktów pasujących do kryteriów.
                </div>
              )}

              {!loading && !error &&
                filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:shadow-glow"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 opacity-70" />
                    <img
                      src={product.image}
                      alt={product.title}
                      className="mb-6 h-56 w-full object-contain object-center"
                    />
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">{product.category}</p>
                        <h3 className="mt-3 text-xl font-semibold text-white">{product.title}</h3>
                      </div>
                      <p className="line-clamp-3 text-sm leading-6 text-slate-300">{product.description}</p>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-2xl font-semibold text-white">{product.price.toFixed(2)} zł</p>
                          <p className="text-sm text-slate-400">{product.rating.count} opinii</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100">
                          {product.rating.rate.toFixed(1)} ★
                        </span>
                      </div>
                    </div>
                  </article>
                ))}

              {error && (
                <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-8 text-rose-100 shadow-lg">
                  <h2 className="text-xl font-semibold">Błąd</h2>
                  <p className="mt-3 text-slate-200">{error}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6 rounded-[2rem] border border-slate-800/80 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Dlaczego ta aplikacja?</h2>
              <p className="text-slate-400">
                Pobiera dane z zewnętrznego API, obsługuje wyszukiwanie i sortowanie po cenie oraz prezentuje je w nowoczesnym designie premium.
              </p>
            </div>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-violet-400" />
                <span>Responsywny interfejs użytkownika.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <span>Eleganckie karty produktów z akcentami premium.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span>Automatyczne budowanie dzięki GitHub Actions.</span>
              </li>
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;

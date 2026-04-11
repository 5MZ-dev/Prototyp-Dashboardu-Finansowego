import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

type StockPoint = {
  date: string;
  close: number;
};

const stockSymbols = [
  { value: 'AAPL', label: 'Apple' },
  { value: 'MSFT', label: 'Microsoft' },
  { value: 'GOOGL', label: 'Google' },
];

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
  const [stockSymbol, setStockSymbol] = useState(stockSymbols[0].value);
  const [stockData, setStockData] = useState<StockPoint[]>([]);
  const [stockLoading, setStockLoading] = useState(true);
  const [stockError, setStockError] = useState<string | null>(null);
  const [selectedStocks, setSelectedStocks] = useState<string[]>(stockSymbols.map((symbol) => symbol.value));
  const [multiStockData, setMultiStockData] = useState<Record<string, StockPoint[]>>({});
  const [multiStockLoading, setMultiStockLoading] = useState(false);
  const [multiStockError, setMultiStockError] = useState<string | null>(null);
  const [activeStockTab, setActiveStockTab] = useState<'multi' | 'comparison'>('multi');

  const stockLineColors: Record<string, string> = {
    AAPL: '#38bdf8',
    MSFT: '#a855f7',
    GOOGL: '#f97316',
  };

  const fetchStockHistory = async (symbol: string) => {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`,
    );
    if (!response.ok) {
      throw new Error(`Błąd pobierania danych dla ${symbol}`);
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];
    const timestamps: number[] = result?.timestamp ?? [];
    const closes: number[] = result?.indicators?.quote?.[0]?.close ?? [];

    return timestamps
      .map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toLocaleDateString('pl-PL', {
          month: 'short',
          day: 'numeric',
        }),
        close: closes[index] ?? 0,
      }))
      .filter((point) => point.close > 0);
  };

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

  useEffect(() => {
    async function loadStockData() {
      setStockLoading(true);
      setStockError(null);

      try {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?range=1mo&interval=1d`,
        );

        if (!response.ok) {
          throw new Error('Błąd pobierania danych giełdowych');
        }

        const data = await response.json();
        const result = data.chart?.result?.[0];
        const timestamps: number[] = result?.timestamp ?? [];
        const closes: number[] = result?.indicators?.quote?.[0]?.close ?? [];

        const points = timestamps
          .map((timestamp, index) => ({
            date: new Date(timestamp * 1000).toLocaleDateString('pl-PL', {
              month: 'short',
              day: 'numeric',
            }),
            close: closes[index] ?? 0,
          }))
          .filter((point) => point.close > 0);

        setStockData(points);
      } catch (err) {
        setStockError((err as Error).message || 'Nieznany błąd wykresu akcji');
      } finally {
        setStockLoading(false);
      }
    }

    loadStockData();
  }, [stockSymbol]);

  useEffect(() => {
    async function loadMultiStockData() {
      if (selectedStocks.length === 0) {
        setMultiStockData({});
        return;
      }
      setMultiStockLoading(true);
      setMultiStockError(null);

      try {
        const entries = await Promise.all(
          selectedStocks.map(async (symbol) => [symbol, await fetchStockHistory(symbol)] as const),
        );
        setMultiStockData(Object.fromEntries(entries));
      } catch (err) {
        setMultiStockError((err as Error).message || 'Nieznany błąd wykresów zbiorowych');
      } finally {
        setMultiStockLoading(false);
      }
    }

    loadMultiStockData();
  }, [selectedStocks]);

  const comparisonData = useMemo(() => {
    const dates = new Set<string>();
    selectedStocks.forEach((symbol) => {
      (multiStockData[symbol] ?? []).forEach((point) => dates.add(point.date));
    });

    const monthNames = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
    const sortedDates = Array.from(dates).sort((a, b) => {
      const parseDate = (str: string) => {
        const [day, month] = str.split(' ');
        const monthIndex = monthNames.indexOf(month.toLowerCase());
        return new Date(2026, Math.max(0, monthIndex), Number(day)).getTime();
      };
      return parseDate(a) - parseDate(b);
    });

    return sortedDates.map((date) => {
      const item: Record<string, string | number | null> = { date };
      selectedStocks.forEach((symbol) => {
        const point = (multiStockData[symbol] ?? []).find((stockPoint) => stockPoint.date === date);
        item[symbol] = point?.close ?? null;
      });
      return item as Record<string, string | number>;
    });
  }, [selectedStocks, multiStockData]);

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
        <section className="mb-10 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Wykres wartości akcji</h2>
              <p className="mt-2 text-slate-400">
                Śledź notowania najważniejszej spółki na wykresie z ostatniego miesiąca.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-3 text-sm text-slate-300">
                Symbol:
                <select
                  value={stockSymbol}
                  onChange={(event) => setStockSymbol(event.target.value)}
                  className="rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                >
                  {stockSymbols.map((symbol) => (
                    <option key={symbol.value} value={symbol.value}>
                      {symbol.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-8 min-h-[320px] rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-6">
            {stockLoading ? (
              <div className="flex h-full items-center justify-center text-slate-400">Ładowanie wykresu...</div>
            ) : stockError ? (
              <div className="text-center text-rose-300">{stockError}</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={stockData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(148,163,184,0.15)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} itemStyle={{ color: '#f8fafc' }} labelStyle={{ color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="close" stroke="#7c3aed" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="mb-10 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Zestaw wykresów dla kilku spółek</h2>
              <p className="mt-2 text-slate-400">
                Porównaj notowania wielu firm na raz i obserwuj trendy w jednym miejscu.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {stockSymbols.map((symbol) => (
                <label key={symbol.value} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 transition hover:border-violet-400">
                  <input
                    type="checkbox"
                    value={symbol.value}
                    checked={selectedStocks.includes(symbol.value)}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSelectedStocks((current) =>
                        current.includes(value)
                          ? current.filter((item) => item !== value)
                          : [...current, value],
                      );
                    }}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-violet-500 focus:ring-violet-400"
                  />
                  {symbol.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-6">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveStockTab('multi')}
                className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                  activeStockTab === 'multi'
                    ? 'bg-violet-500 text-white shadow-glow'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Indywidualne wykresy
              </button>
              <button
                type="button"
                onClick={() => setActiveStockTab('comparison')}
                className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                  activeStockTab === 'comparison'
                    ? 'bg-violet-500 text-white shadow-glow'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Wykres porównawczy
              </button>
            </div>

            {activeStockTab === 'multi' ? (
              multiStockLoading ? (
                <div className="flex h-full min-h-[260px] items-center justify-center text-slate-400">Ładowanie zestawu wykresów...</div>
              ) : multiStockError ? (
                <div className="text-center text-rose-300">{multiStockError}</div>
              ) : selectedStocks.length === 0 ? (
                <div className="text-center text-slate-400">Wybierz przynajmniej jedną spółkę, aby zobaczyć wykresy.</div>
              ) : (
                <div className="grid gap-6 xl:grid-cols-3">
                  {selectedStocks.map((symbol) => (
                    <div key={symbol} className="rounded-[1.75rem] border border-slate-700/80 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">{symbol}</p>
                          <h3 className="text-lg font-semibold text-white">{stockSymbols.find((item) => item.value === symbol)?.label}</h3>
                        </div>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={multiStockData[symbol] ?? []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={16} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 14 }} itemStyle={{ color: '#f8fafc' }} labelStyle={{ color: '#94a3b8' }} />
                            <Line type="monotone" dataKey="close" stroke="#38bdf8" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : multiStockLoading ? (
              <div className="flex h-full min-h-[260px] items-center justify-center text-slate-400">Ładowanie wykresu porównawczego...</div>
            ) : multiStockError ? (
              <div className="text-center text-rose-300">{multiStockError}</div>
            ) : selectedStocks.length === 0 ? (
              <div className="text-center text-slate-400">Wybierz przynajmniej jedną spółkę, aby zobaczyć wykres porównawczy.</div>
            ) : (
              <div className="h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} itemStyle={{ color: '#f8fafc' }} labelStyle={{ color: '#94a3b8' }} />
                    {selectedStocks.map((symbol) => (
                      <Line
                        key={symbol}
                        type="monotone"
                        dataKey={symbol}
                        stroke={stockLineColors[symbol] ?? '#7c3aed'}
                        strokeWidth={3}
                        dot={false}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

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

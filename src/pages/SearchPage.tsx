import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, ChevronRight, ArrowLeft } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { highlight } from "../lib/utils";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const { query, setQuery, results, isLoading } = useSearch(initialQ);
  const [inputVal, setInputVal] = useState(initialQ);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setInputVal(q);
    setQuery(q);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
      setQuery(inputVal.trim());
    }
  };

  return (
    <>
      <Helmet>
        <title>{query ? `"${query}" — Search` : "Search"} — Akta.my</title>
        <meta name="description" content={`Search results for "${query}" across all Malaysian Acts on Akta.my.`} />
      </Helmet>

      <div className="bg-primary py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1 text-white/50 hover:text-white/80 text-sm mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <h1 className="text-2xl font-bold text-white mb-5">Search Results</h1>
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-page-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search any section, act, or keyword…"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-ring text-sm"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-secondary whitespace-nowrap">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {query && (
          <p className="text-sm text-slate-500 mb-6">
            {isLoading ? "Searching..." : results.length > 0
              ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
              : `No results found for "${query}"`}
          </p>
        )}

        {!query && (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Enter a search term above</p>
            <p className="text-sm mt-1">Try "maternity leave", "freedom of speech", or "data protection"</p>
          </div>
        )}

        {query && results.length === 0 && !isLoading && (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No sections match your search</p>
            <p className="text-sm mt-1">Try different keywords or browse all acts</p>
            <Link to="/acts" className="mt-4 inline-block btn-primary text-sm">Browse Acts</Link>
          </div>
        )}

        <div className="space-y-4 fade-in">
          {results.map((r) => (
            <Link
              key={r.section_id}
              to={`/acts/${r.act_id}/section/${r.section_id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-border transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-xs text-primary font-semibold font-mono mb-1">
                    Act {r.act_number} · Section {r.section_number}
                  </p>
                  <h2 className="font-bold text-foreground group-hover:text-foreground/80 text-base transition-colors">
                    {r.section_title}
                  </h2>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1 group-hover:text-muted-foreground transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mb-3">{r.act_title}</p>
              <p
                className="text-sm text-slate-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlight(r.snippet, query) }}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

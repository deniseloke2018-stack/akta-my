import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Filter, ChevronRight } from "lucide-react";
import { useActs } from "../hooks/useActs";
import { CATEGORIES, getCategoryInfo, cn } from "../lib/utils";
import type { Act, ActCategory } from "../types";

export function ActListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const initialCategory = searchParams.get("category") as ActCategory | null;
  const [activeCategory, setActiveCategory] = useState<ActCategory | null>(initialCategory);

  useEffect(() => {
    const cat = searchParams.get("category") as ActCategory | null;
    setActiveCategory(cat);
  }, [searchParams]);

  const { data: acts = [], isLoading } = useActs();

  const filtered: Act[] = acts.filter((act) => {
    const matchQuery =
      !query.trim() ||
      act.title_en.toLowerCase().includes(query.toLowerCase()) ||
      act.title_ms.toLowerCase().includes(query.toLowerCase()) ||
      act.act_number.includes(query);
    const matchCat = !activeCategory || act.category === activeCategory;
    return matchQuery && matchCat;
  });

  const handleCategoryClick = (id: ActCategory | null) => {
    setActiveCategory(id);
    if (id) {
      setSearchParams({ category: id });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <Helmet>
        <title>Browse Acts — Akta.my</title>
        <meta name="description" content="Browse all parsed Malaysian federal Acts. Filter by category or search by name and act number." />
      </Helmet>

      <div className="bg-primary py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Browse All Acts</h1>
          <p className="text-white/60 mb-6">Malaysian federal legislation, parsed section by section.</p>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="act-list-search"
              type="text"
              placeholder="Search by name or act number…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter chips */}
        <div className="flex items-center gap-1 flex-wrap mb-8">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          <button
            onClick={() => handleCategoryClick(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              !activeCategory
                ? "bg-primary text-white border-border"
                : "bg-white text-slate-600 border-slate-200 hover:border-border"
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id as ActCategory)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1",
                activeCategory === cat.id
                  ? "bg-primary text-white border-border"
                  : "bg-[#ffffff] border-slate-200 hover:border-border text-foreground"
              )}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          {filtered.length} act{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Acts list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No acts match your search.</p>
            <button
              onClick={() => { setQuery(""); handleCategoryClick(null); }}
              className="mt-3 text-sm text-muted-foreground hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((act) => {
              const cat = getCategoryInfo(act.category);
              return (
                <Link
                  key={act.id}
                  to={`/acts/${act.id}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-border transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xl">{cat.icon}</span>
                    <span className={"text-xs px-2 py-0.5 rounded-full border border-border bg-[#ffffff] text-foreground font-medium"}>
                      Act {act.act_number}
                    </span>
                  </div>
                  <h2 className="font-bold text-foreground text-base mb-1 group-hover:text-foreground/80 leading-snug">
                    {act.title_en}
                  </h2>
                  <p className="text-xs text-slate-400 mb-3">{act.title_ms}</p>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                    {act.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                    <span>{act.total_sections} sections · {act.year}</span>
                    <span className="text-muted-foreground font-medium flex items-center gap-0.5 group-hover:gap-1 transition-all">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Coming soon note */}
        <div className="mt-12 rounded-2xl bg-primary border border-primary p-6 text-center">
          <p className="text-primary font-medium mb-1">📚 More acts being added</p>
          <p className="text-primary text-sm">
            The MVP includes 5 key acts. Contributions welcome on{" "}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}

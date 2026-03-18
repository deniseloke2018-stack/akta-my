import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, ArrowRight, Shield, BookOpen, Code2, Zap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useActs } from "../hooks/useActs";
import { CATEGORIES, getCategoryInfo, cn } from "../lib/utils";
import type { ActCategory } from "../types";

export function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: acts = [], isLoading } = useActs();
  const featuredActs = acts.filter((a) => a.is_featured);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const stats = [
    { value: "5+", label: "Acts (growing)" },
    { value: "50+", label: "Sections parsed" },
    { value: "Free", label: "Forever, open source" },
    { value: "REST", label: "API available" },
  ];

  return (
    <>
      <Helmet>
        <title>Akta.my — Malaysian Law, Made Accessible</title>
        <meta name="description" content="Free, open-source access to Malaysian legislation. Search any Act, section, or legal topic instantly." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-background min-h-[92vh] flex flex-col items-center justify-center px-4 pt-8 pb-16 relative overflow-hidden">
        {/* Removed decorative gradient blobs */}

        <div className="relative max-w-3xl mx-auto text-center fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Open Source · AGPL-3.0 · Built for Malaysia
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            Malaysian Law,
            <br />
            <span className="text-primary">Made Accessible</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Search every Malaysian federal Act by section, keyword, or topic — no PDFs, no logins.
            Granular citations, REST API, and open data for all.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-12">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden search-glow">
              <Search className="w-5 h-5 text-slate-400 ml-5 flex-shrink-0" />
              <input
                id="hero-search"
                type="text"
                placeholder='Try "maternity leave", "data protection", "murder"…'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-4 text-slate-800 placeholder:text-slate-400 outline-none text-base bg-transparent"
                autoComplete="off"
              />
              <button
                type="submit"
                className="m-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
              >
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-muted-foreground text-xs mt-3">
              Or{" "}
              <Link to="/acts" className="text-primary hover:text-primary/80 underline underline-offset-2">
                browse all acts →
              </Link>
            </p>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {["maternity leave", "freedom of speech", "murder", "personal data", "contract"].map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-border text-secondary-foreground hover:text-foreground rounded-full text-xs font-medium transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto w-full">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Category grid ── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Browse by Category</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Navigate Malaysian law by area of practice or daily concern.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const count = acts.filter((a) => a.category === cat.id as ActCategory).length;
              return (
                <Link
                  key={cat.id}
                  to={`/acts?category=${cat.id}`}
                  className={cn(
                    "category-card flex flex-col gap-2 bg-[#ffffff] text-foreground border-border"
                  )}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{cat.label}</div>
                    <div className="text-xs opacity-70">{cat.label_ms}</div>
                  </div>
                  <div className="text-xs opacity-50 mt-auto">
                    {count > 0 ? `${count} act${count !== 1 ? "s" : ""}` : "Coming soon"}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Acts ── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Acts</h2>
              <p className="text-muted-foreground">The most referenced Malaysian legislation</p>
            </div>
            <Link
              to="/acts"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredActs.map((act) => {
              const cat = getCategoryInfo(act.category);
              return (
                <Link
                  key={act.id}
                  to={`/acts/${act.id}`}
                  className="group rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className={"text-xs px-2 py-0.5 rounded-full border border-border bg-[#ffffff] text-foreground font-medium"}>
                      Act {act.act_number}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary leading-snug">
                    {act.title_en}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 font-medium">{act.title_ms}</p>
                  <p className="text-sm text-foreground/80 line-clamp-2 mb-4 leading-relaxed">
                    {act.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{act.total_sections} sections</span>
                    <span className="text-primary font-medium group-hover:gap-1.5 flex items-center gap-1 transition-all">
                      Read Act <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
            </div>
          )}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Why Akta.my?</h2>
            <p className="text-secondary-foreground/80 max-w-md mx-auto">
              Purpose-built for the way people actually use legal resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Search className="w-6 h-6 text-primary" />,
                title: "Instant Search",
                desc: "Full-text search across every section of every act. No PDFs.",
              },
              {
                icon: <BookOpen className="w-6 h-6 text-primary" />,
                title: "Direct Citations",
                desc: "Every section has a shareable URL. Cite precisely, link directly.",
              },
              {
                icon: <Code2 className="w-6 h-6 text-primary" />,
                title: "REST API",
                desc: "Structured JSON API powered by Supabase. Free for all developers.",
              },
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "Always Free",
                desc: "No account, no paywall. Open source under AGPL-3.0.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-card border border-border p-6 hover:shadow-md transition-all text-card-foreground"
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <Link to="/acts" className="btn-secondary text-base px-8 py-3">
              <Zap className="w-4 h-4" />
              Start Exploring →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

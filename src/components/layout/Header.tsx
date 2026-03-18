import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Scale, Menu, X, BookOpen, Code2, List } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

  const navLinks = [
    { href: "/acts", label: "Browse Acts", icon: <List className="w-4 h-4" /> },
    { href: "/api", label: "API", icon: <Code2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-primary"
            >
              <Scale className="w-4.5 h-4.5 text-white" strokeWidth={2} />
            </div>
            <div>
              <span
                className="font-bold text-xl tracking-tight transition-colors text-primary"
              >
                Akta<span className="text-primary">.my</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 w-64 transition-all search-glow text-slate-800"
          >
            <Search className="w-4 h-4 opacity-60 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search all acts…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder:opacity-60"
              id="header-search"
            />
          </form>

          {/* Mobile menu toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-xl">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 mb-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search all acts…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-slate-800"
              id="header-search-mobile"
            />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <Link
            to="/"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Home
          </Link>
        </div>
      )}
    </header>
  );
}

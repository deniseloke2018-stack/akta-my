import { Link } from "react-router-dom";
import { Scale, Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">
                Akta<span className="text-primary">.my</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Open-source access to Malaysian legislation. No login required. Free forever.
              Built for citizens, lawyers, and developers alike.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-card/80 transition-colors text-sm font-medium text-foreground border border-border"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                AGPL-3.0
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Browse Acts", href: "/acts" },
                { label: "Search", href: "/search" },
                { label: "API Documentation", href: "/api" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "AGC Website", href: "https://agc.gov.my", external: true },
                { label: "e-Federal Gazette", href: "https://efg.agc.gov.my", external: true },
                { label: "LOM Portal", href: "https://lom.agc.gov.my", external: true },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>
            © 2025 Akta.my. Content sourced from the{" "}
            <a
              href="https://agc.gov.my"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline"
            >
              Attorney General's Chambers of Malaysia
            </a>
            . Laws are as-gazetted; always verify with official sources.
          </p>
          <p className="text-muted-foreground">
            Not legal advice. For reference only.
          </p>
        </div>
      </div>
    </footer>
  );
}

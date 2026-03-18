import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Scale, ArrowRight } from "lucide-react";

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found — Akta.my</title>
      </Helmet>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-8xl font-black text-slate-100 mb-4 leading-none">404</div>
        <Scale className="w-12 h-12 text-slate-300 mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Section Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-sm">
          The page you're looking for doesn't exist. It may have been moved, or the URL might be incorrect.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link to="/" className="btn-primary">
            Go Home <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/acts" className="btn-ghost border border-slate-200">
            Browse Acts
          </Link>
        </div>
      </div>
    </>
  );
}

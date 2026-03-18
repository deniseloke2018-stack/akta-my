import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Code2, Database, Search, BookOpen } from "lucide-react";
import { cn } from "../lib/utils";

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-secondary text-green-300 rounded-xl p-4 text-sm overflow-x-auto font-mono leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

function EndpointCard({
  method,
  path,
  description,
  example,
}: {
  method: "GET" | "POST";
  path: string;
  description: string;
  example: string;
}) {
  const methodColor =
    method === "GET"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-blue-100 text-blue-700 border-blue-200";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-5 flex items-start gap-3">
        <span className={cn("px-2 py-0.5 rounded text-xs font-mono font-bold border flex-shrink-0 mt-0.5", methodColor)}>
          {method}
        </span>
        <div className="flex-1 min-w-0">
          <code className="text-foreground font-mono text-sm font-semibold">{path}</code>
          <p className="text-slate-500 text-sm mt-1">{description}</p>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
        <CodeBlock code={example} />
      </div>
    </div>
  );
}

export function APIPage() {
  const baseUrl = "https://your-supabase-project.supabase.co/rest/v1";
  const anonKey = "YOUR_ANON_KEY";

  return (
    <>
      <Helmet>
        <title>API Documentation — Akta.my</title>
        <meta name="description" content="REST API documentation for Akta.my. Access Malaysian legislation data programmatically as structured JSON." />
      </Helmet>

      <div className="bg-primary py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="text-primary font-medium text-sm">For Developers</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">API Documentation</h1>
          <p className="text-white/60 max-w-xl">
            Akta.my exposes a free, open REST API powered by Supabase PostgREST. No authentication required
            for read operations.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">

        {/* Overview */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" /> Base URL & Authentication
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Base URL</p>
              <CodeBlock code={baseUrl} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Required Header</p>
              <CodeBlock code={`apikey: ${anonKey}\nAccept: application/json`} />
            </div>
            <p className="text-sm text-slate-500">
              The anonymous key grants read-only access to all public tables. No account needed.
            </p>
          </div>
        </section>

        {/* Schema */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Schema Overview
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Table</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Key Columns</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    table: "acts",
                    cols: "id, act_number, title_en, title_ms, year, category",
                    desc: "Top-level law registry",
                  },
                  {
                    table: "parts",
                    cols: "id, act_id, part_number, title_en, order_index",
                    desc: "Bahagian / Parts of each act",
                  },
                  {
                    table: "sections",
                    cols: "id, act_id, part_id, section_number, title_en, content",
                    desc: "Individual Seksyen with full text",
                  },
                  {
                    table: "subsections",
                    cols: "id, section_id, label, content",
                    desc: "Subseksyen / clauses",
                  },
                ].map((row) => (
                  <tr key={row.table}>
                    <td className="px-5 py-3 font-mono text-primary font-medium">{row.table}</td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">{row.cols}</td>
                    <td className="px-5 py-3 text-slate-600">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> Endpoints
          </h2>
          <div className="space-y-4">
            <EndpointCard
              method="GET"
              path="/acts"
              description="List all acts. Supports filtering, ordering, and pagination."
              example={`curl "${baseUrl}/acts?select=id,act_number,title_en,year&order=year.asc" \\
  -H "apikey: ${anonKey}"`}
            />
            <EndpointCard
              method="GET"
              path="/acts?act_number=eq.265"
              description="Fetch a specific act by act number."
              example={`curl "${baseUrl}/acts?act_number=eq.265" \\
  -H "apikey: ${anonKey}"`}
            />
            <EndpointCard
              method="GET"
              path="/sections?act_id=eq.{id}"
              description="Get all sections for an act, ordered by index."
              example={`curl "${baseUrl}/sections?act_id=eq.act-265&order=order_index.asc" \\
  -H "apikey: ${anonKey}"`}
            />
            <EndpointCard
              method="GET"
              path="/sections?content=fts.{query}"
              description="Full-text search across all section content using Postgres FTS."
              example={`curl "${baseUrl}/sections?content=fts.maternity+leave&select=id,section_number,title_en" \\
  -H "apikey: ${anonKey}"`}
            />
            <EndpointCard
              method="GET"
              path="/sections?id=eq.{id}"
              description="Fetch a single section by its unique ID."
              example={`curl "${baseUrl}/sections?id=eq.act-265-s60a" \\
  -H "apikey: ${anonKey}"`}
            />
          </div>
        </section>

        {/* Response example */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Example Response</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500 mb-3">
              <code className="font-mono text-foreground/80">GET /sections?id=eq.act-265-s60a</code>
            </p>
            <CodeBlock
              code={`[
  {
    "id": "act-265-s60a",
    "act_id": "act-265",
    "part_id": "act-265-p3",
    "section_number": "60A",
    "title_en": "Maternity allowance",
    "content": "(1) A female employee shall be entitled to receive...",
    "order_index": 38
  }
]`}
            />
          </div>
        </section>

        {/* Rate limits */}
        <section>
          <div className="rounded-2xl bg-primary border border-primary p-6">
            <h3 className="font-bold text-primary mb-2">📌 Usage Notes</h3>
            <ul className="text-sm text-primary space-y-1.5 list-disc list-inside">
              <li>The API is free and public. No API key registration needed.</li>
              <li>Please cache responses and avoid hammering — be a good citizen.</li>
              <li>Rate limit: ~100 requests/min per IP (Supabase default).</li>
              <li>All content is sourced from and copyright the AGC of Malaysia.</li>
              <li>
                Want to self-host? See the{" "}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                  GitHub repo
                </a>{" "}
                for the full Supabase schema and ingestion pipeline.
              </li>
            </ul>
          </div>
        </section>

        {/* Back to browse */}
        <div className="text-center pb-8">
          <Link to="/acts" className="btn-primary inline-flex">
            <BookOpen className="w-4 h-4" />
            Browse Acts in the UI
          </Link>
        </div>
      </div>
    </>
  );
}

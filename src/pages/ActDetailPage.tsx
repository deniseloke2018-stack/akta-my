import { useEffect, useRef, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Copy, Check, BookOpen, Menu, X, Sparkles } from "lucide-react";
import { useAct } from "../hooks/useActs";
import { useParts, useSections, useSubsections } from "../hooks/useSections";
import { getCategoryInfo, cn } from "../lib/utils";
import type { Part, Section, Subsection } from "../types";

function renderContent(content: string, forceItalic: boolean = false) {
  // Convert markdown bold, italic, and newlines to HTML-like rendering
  const lines = content.split("\n");
  let inIllustration = forceItalic;
  
  return lines.map((line, i) => {
    if (/^illustrations?:?\s*$/i.test(line.trim())) {
      inIllustration = true;
    }
    
    let html = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
      
    if (inIllustration && line.trim() !== "") {
      html = `<em>${html}</em>`;
    }

    if (line.trim() === "") return <div key={i} className="h-2" />;
    return (
      <p key={i} className="mb-2 leading-8" dangerouslySetInnerHTML={{ __html: html }} />
    );
  });
}

function SectionBlock({ section, subsections, isHighlighted }: { section: Section; subsections: Subsection[]; isHighlighted: boolean }) {
  const [copied, setCopied] = useState(false);
  const [askCopied, setAskCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHighlighted && ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [isHighlighted]);

  const copyLink = () => {
    const url = `${window.location.origin}/acts/${section.act_id}/section/${section.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const askClaude = () => {
    let text = `Regarding Section ${section.section_number}: ${section.title_en}\n\n`;
    if (section.content) text += `${section.content}\n\n`;
    if (subsections && subsections.length > 0) {
      subsections.forEach(ss => {
        text += `(${ss.label}) ${ss.content}\n\n`;
      });
    }
    const prompt = `Context:\n${text}\nMy question: `;
    navigator.clipboard.writeText(prompt);
    setAskCopied(true);
    setTimeout(() => setAskCopied(false), 2000);
    const url = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={ref}
      id={section.id}
      className={cn(
        "rounded-2xl border bg-white p-6 sm:p-8 transition-all duration-500",
        isHighlighted ? "section-highlight border-primary" : "border-slate-200"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-xs font-mono text-primary font-semibold mb-1">
            Section {section.section_number}
          </div>
          <h2 className="text-lg font-bold text-foreground leading-tight">
            {section.title_en ? section.title_en.charAt(0).toUpperCase() + section.title_en.slice(1) : ""}
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={askClaude}
            title="Ask AI about this section"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium transition-colors"
          >
            {askCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Sparkles className="w-3.5 h-3.5" />}
            {askCopied ? "Copied & Opened!" : "Ask AI"}
          </button>
          <button
            onClick={copyLink}
            title="Copy link to this section"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>
      <div className="legal-content text-sm sm:text-base">
        {section.content && renderContent(section.content)}
        {subsections.length > 0 && (() => {
          let isIll = section.content ? /^illustrations?:?\s*$/im.test(section.content) : false;
          return (
            <div className="mt-4 space-y-4">
              {subsections.map((ss) => {
                if (/^illustrations?:?$/i.test(ss.label) || /^illustrations?:?\s*$/im.test(ss.content)) {
                  isIll = true;
                }
                return (
                  <div key={ss.id} className="flex gap-2">
                    <span className={cn("font-semibold flex-shrink-0", isIll && "italic font-normal")}>{ss.label}</span>
                    <div className="flex-1">{renderContent(ss.content, isIll)}</div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function TableOfContents({
  parts,
  sections,
  activeSection,
  actId,
}: {
  parts: Part[];
  sections: Section[];
  activeSection: string | null;
  actId: string;
}) {
  return (
    <nav className="text-sm">
      {parts.length > 0
        ? parts.map((part) => {
            const partSections = sections.filter((s) => s.part_id === part.id);
            return (
              <div key={part.id} className="mb-4">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 px-2">
                  Part {part.part_number} — {part.title_en}
                </div>
                <ul className="space-y-0.5">
                  {partSections.map((s) => (
                    <li key={s.id}>
                      <Link
                        to={`/acts/${actId}/section/${s.id}`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs leading-snug",
                          activeSection === s.id
                            ? "bg-primary text-white font-medium"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <span className="font-mono text-[10px] opacity-60 flex-shrink-0 w-8">§{s.section_number}</span>
                        <span className="line-clamp-1">{s.title_en ? s.title_en.charAt(0).toUpperCase() + s.title_en.slice(1) : ""}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        : (
          <ul className="space-y-0.5">
            {sections.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/acts/${actId}/section/${s.id}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs leading-snug",
                    activeSection === s.id
                      ? "bg-primary text-white font-medium"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span className="font-mono text-[10px] opacity-60 flex-shrink-0 w-8">§{s.section_number}</span>
                  <span className="line-clamp-1">{s.title_en ? s.title_en.charAt(0).toUpperCase() + s.title_en.slice(1) : ""}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
    </nav>
  );
}

export function ActDetailPage() {
  const { actId, sectionId } = useParams<{ actId: string; sectionId?: string }>();
  const location = useLocation();
  const [tocOpen, setTocOpen] = useState(false);

  const { data: act, isLoading: isLoadingAct } = useAct(actId!);
  const { data: parts = [], isLoading: isLoadingParts } = useParts(actId!);
  const { data: sections = [], isLoading: isLoadingSections } = useSections(actId!);
  const { data: subsections = [], isLoading: isLoadingSubsections } = useSubsections(actId!);

  const isLoading = isLoadingAct || isLoadingParts || isLoadingSections || isLoadingSubsections;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Loading Act...</h1>
      </div>
    );
  }

  if (!act) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Act Not Found</h1>
        <p className="text-slate-500 mb-6">This act doesn't exist in our database yet.</p>
        <Link to="/acts" className="btn-primary">Browse All Acts</Link>
      </div>
    );
  }

  const cat = getCategoryInfo(act.category);
  const activeSection = sectionId ?? null;

  return (
    <>
      <Helmet>
        <title>{act.title_en} — Akta.my</title>
        <meta name="description" content={act.description ?? `Read ${act.title_en} (Act ${act.act_number}) section by section on Akta.my.`} />
      </Helmet>

      {/* Act header */}
      <div className="bg-primary text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-white/80">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/acts" className="hover:text-white/80">Acts</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80">{act.title_en}</span>
          </nav>

          <div className="flex items-start gap-4">
            <span className="text-4xl">{cat.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={"text-xs px-2 py-0.5 rounded-full border border-border bg-[#ffffff] text-foreground font-medium"}>
                  Act {act.act_number}
                </span>
                <span className="text-xs text-white/40">{act.year}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">{act.title_en}</h1>
              <p className="text-white/50 text-sm">{act.title_ms}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar ToC — desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto sidebar-scroll rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3 px-2">
                Table of Contents
              </div>
              <TableOfContents
                parts={parts}
                sections={sections}
                activeSection={activeSection}
                actId={act.id}
              />
            </div>
          </aside>

          {/* Mobile ToC toggle */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setTocOpen(true)}
              className="w-12 h-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
              aria-label="Open table of contents"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile ToC drawer */}
          {tocOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setTocOpen(false)}>
              <div
                className="absolute right-0 top-0 bottom-0 w-80 bg-white p-5 overflow-y-auto sidebar-scroll shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-foreground text-sm">Table of Contents</span>
                  <button onClick={() => setTocOpen(false)}>
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <TableOfContents
                  parts={parts}
                  sections={sections}
                  activeSection={activeSection}
                  actId={act.id}
                />
              </div>
            </div>
          )}

          {/* Sections */}
          <div className="flex-1 min-w-0 space-y-4 fade-in">
            {sections.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No sections parsed yet for this act.</p>
              </div>
            ) : (
              sections.map((section) => {
                const sectionSubsections = subsections.filter(ss => ss.section_id === section.id);
                return (
                  <SectionBlock
                    key={section.id}
                    section={section}
                    subsections={sectionSubsections}
                    isHighlighted={section.id === activeSection}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

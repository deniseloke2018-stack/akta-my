That is an incredibly exciting and highly impactful project idea. Malaysia's official legal repositories (like the AGC's e-Federal Gazette and LOM portals) suffer from the exact same issues as the Indonesian ones: they are heavily reliant on clunky PDFs, lack granular search, and are notoriously difficult for both everyday citizens and modern AI tools to navigate.
Building a Malaysian equivalent—let's call it Akta.my (as a working title)—would be a massive public good.
Here is a Product Requirements Document (PRD) tailored specifically for an MVP (Minimum Viable Product) to get this off the ground quickly and effectively.
Product Requirements Document (PRD)
Project Name: Akta.my (Working Title)
Phase: Minimum Viable Product (MVP)
License: Open Source (AGPL-3.0)
1. Product Vision & Objective
Vision: To democratize access to Malaysian legislation by making the law structured, searchable, accessible, and AI-ready for everyone.
Objective for MVP: Build a fast, open-source web platform and REST API that parses and hosts the most frequently referenced Malaysian federal laws in a granular, section-by-section format.
2. Problem Statement
Currently, to read a Malaysian law, citizens must navigate the Attorney General's Chambers (AGC) website, download a scanned or poorly formatted PDF, and manually scroll to find specific sections.
For citizens: It creates a barrier to understanding their rights.
For legal professionals: It slows down research and citation.
For developers/AI: PDFs are unstructured, leading to AI hallucinations and making programmatic integration nearly impossible.
3. Target Audience
Everyday Citizens: Seeking clear information on labor rights, tenancy, or criminal law.
Legal Professionals & Law Students: Needing quick, shareable citations (e.g., specific sub-sections of an Act).
Developers & AI Models: Requiring structured, machine-readable legal data (JSON/API/Markdown).
4. MVP Scope & Features
A. Data & Content Scope (The "Must-Haves")
To keep the MVP feasible, we will focus only on Federal Laws (Acts of Parliament) and the Constitution, ignoring State Enactments and Subsidiary Legislation for now.
Category
MVP Targets (Examples to parse first)
Constitution
Federal Constitution (Perlembagaan Persekutuan)
Criminal & Civil
Penal Code (Act 574), Criminal Procedure Code (Act 593), Contracts Act 1950
Everyday Rights
Employment Act 1955 (Act 265), Personal Data Protection Act 2010 (Act 709)
Target Volume
Top 50 most accessed Acts.

B. Core User Features
Granular Parsing: Acts must be broken down and displayed by Part (Bahagian), Section (Seksyen), and Subsection (Subseksyen).
Bilingual Support (Basic): Display the English and Bahasa Melayu titles of the Acts (even if the body text is English-first for the MVP, as many AGC documents are).
Universal Search: * Search by Act Number (e.g., "Act 265").
Search by Keyword across all parsed text (e.g., "maternity leave").
Direct Linking & Citation: Every Section must have a unique, shareable URL (e.g., Akta.my/act-265/section-60A).
Clean Reading UI: Distraction-free, mobile-responsive reading experience with a sticky table of contents (Parts/Sections) on the sidebar.
5. Technical Architecture (Proposed)
Frontend Core: ReactJS powered by Vite. Vite provides lightning-fast local development and highly optimized, lightweight production builds, which is crucial for a text-heavy application.
UI & Styling:
TailwindCSS: For utility-first, responsive styling to keep the CSS footprint small.
shadcn/ui & coss ui: Utilizing these component libraries for accessible, beautifully designed, and copy-pasteable UI elements. This will drastically speed up the development of complex components like the search command palette, navigation sidebars, and typography layouts for reading long-form legal text.
Backend, API & Database: Supabase (Backend-as-a-Service).
Database: Supabase's managed PostgreSQL to store the structured legal hierarchy (Acts, Parts, Sections, Subsections).
API Layer: Leveraging Supabase's built-in PostgREST to automatically generate a secure, instant REST API directly from the database schema—zero backend routing required.
Search Engine: Using Postgres's native full-text search capabilities (or pgvector if we eventually integrate AI embeddings) to power fast, typo-tolerant keyword searches across the legal texts.
Data Ingestion Pipeline: A set of Python scripts (run locally or via GitHub Actions) to extract text from the Attorney General's Chambers (AGC) PDFs or Word docs, parse it into structured JSON using regex/NLP, and push it directly into the Supabase database using the supabase-py client. (This data pipeline remains the most complex engineering challenge of the MVP).
6. Out of Scope for MVP (Future Roadmap)
State Enactments & Ordinances: (e.g., Syariah laws, Sabah/Sarawak specific ordinances).
Historical Versioning: Tracking line-by-line amendments over the years. (MVP will just host the currently in force version).
"Know Your Rights" Articles: Writing summaries or plain-English guides requires legal expertise and slows down the MVP launch.
User Accounts: The platform should be 100% open; no login required to read or use the API.
7. Success Metrics for MVP
Data: 50 critical Acts successfully parsed into JSON/Database format.
Performance: Search queries return results in under 200ms.
Engagement: 1,000 monthly unique visitors in the first 3 months.
Developer Adoption: 50+ stars on GitHub; API utilized by at least 3 distinct open-source projects or AI bots.


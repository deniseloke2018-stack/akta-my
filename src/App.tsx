import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/HomePage";
import { ActListPage } from "./pages/ActListPage";
import { ActDetailPage } from "./pages/ActDetailPage";
import { SearchPage } from "./pages/SearchPage";
import { APIPage } from "./pages/APIPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/acts" element={<ActListPage />} />
              <Route path="/acts/:actId" element={<ActDetailPage />} />
              <Route path="/acts/:actId/section/:sectionId" element={<ActDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/api" element={<APIPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
    </QueryClientProvider>
  );
}

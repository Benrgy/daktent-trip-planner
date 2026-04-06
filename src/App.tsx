import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Countries from "./pages/Countries.tsx";
import CountryDetail from "./pages/CountryDetail.tsx";
import Planner from "./pages/Planner.tsx";
import FAQ from "./pages/FAQ.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const basename = window.location.pathname.startsWith("/daktent-trip-planner")
  ? "/daktent-trip-planner"
  : "/";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landen" element={<Countries />} />
          <Route path="/landen/:code" element={<CountryDetail />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/faq" element={<FAQ />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

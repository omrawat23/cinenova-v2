import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx';
import './index.css';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { ThemeProvider } from "./components/providers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <QueryClientProvider client={queryClient}>
     <Analytics />
     <SpeedInsights />
       <ThemeProvider>
         <App />
       </ThemeProvider>
     </QueryClientProvider>
  </StrictMode>
);

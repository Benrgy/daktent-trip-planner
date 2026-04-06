import { useEffect } from "react";

interface PageSEO {
  title: string;
  description: string;
}

export function usePageSEO({ title, description }: PageSEO) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    return () => {
      document.title = "DaktentTripPlanner - Plan je daktent roadtrip in minuten";
    };
  }, [title, description]);
}

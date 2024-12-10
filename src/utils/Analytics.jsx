import React, { useEffect } from "react";
import ReactGA4 from "react-ga4";

const VITE_GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function Analytics(props) {
  ReactGA4.initialize([
    {
      trackingId: VITE_GA_MEASUREMENT_ID,
    },
  ]);

  useEffect(() => {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        console.log(entry);
        ReactGA4.event("Page Performance", {
          page_performance: entry.duration,
          label: window.location.pathname,
          category: "Page performance",
        });
      });
    });

    observer.observe({ entryTypes: ["navigation"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{props.children}</>;
}

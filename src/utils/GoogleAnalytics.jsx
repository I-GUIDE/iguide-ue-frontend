import React, { useEffect } from "react";
import ReactGA4 from "react-ga4";

const VITE_GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const DEEP_TEST_MODE = import.meta.env.VITE_DEEP_TEST_MODE;

export default function GoogleAnalytics(props) {
  ReactGA4.initialize([
    {
      trackingId: VITE_GA_MEASUREMENT_ID,
    },
  ]);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        DEEP_TEST_MODE &&
          console.log("PerformanceObserverNavigation entry", entry);
        ReactGA4.event("Page Performance", {
          page_performance: entry.duration,
          label: window.location.pathname,
          category: "Page performance",
        });
      });
    });

    observer.observe({ type: "navigation", buffered: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{props.children}</>;
}

import React, { useEffect } from "react";
import ReactGA4 from "react-ga4";

const VITE_GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function Analytics(props) {
  ReactGA4.initialize([
    {
      trackingId: VITE_GA_MEASUREMENT_ID,
    },
  ]);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        TEST_MODE && console.log(entry);
        ReactGA4.event({
          page_performance: entry.duration,
          label: window.location.pathname,
          category: "Page performance",
          action: "Page Performance",
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

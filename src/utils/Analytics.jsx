import React from "react";
import ReactGA from "react-ga4";

const VITE_GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function Analytics(props) {
  ReactGA.initialize([
    {
      trackingId: VITE_GA_MEASUREMENT_ID,
    },
  ]);

  return <>{props.children}</>;
}

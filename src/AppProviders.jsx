import { CookiesProvider } from "react-cookie";
import { TourProvider } from "@reactour/tour/";

import TourSteps from "./configs/TourSteps";
import GoogleAnalytics from "./utils/GoogleAnalytics";
import { AlertModalProvider } from "./utils/AlertModalProvider";

export function AppProviders({ children }) {
  return (
    <AlertModalProvider>
      <TourProvider steps={TourSteps} showBadge={false}>
        <GoogleAnalytics>
          <CookiesProvider defaultSetOptions={{ path: "/" }}>
            {children}
          </CookiesProvider>
        </GoogleAnalytics>
      </TourProvider>
    </AlertModalProvider>
  );
}

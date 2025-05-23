import { CookiesProvider } from "react-cookie";
import { TourProvider } from "@reactour/tour/";

import TourSteps from "./configs/TourSteps";
import GoogleAnalytics from "./utils/GoogleAnalytics";
import { AlertModalProvider } from "./utils/AlertModalProvider";

import SessionExpirationModal from "./components/SessionExpirationModal";

export function AppProviders({ children }) {
  return (
    <AlertModalProvider>
      <TourProvider steps={TourSteps} showBadge={false}>
        <GoogleAnalytics>
          <CookiesProvider defaultSetOptions={{ path: "/" }}>
            <SessionExpirationModal />
            {children}
          </CookiesProvider>
        </GoogleAnalytics>
      </TourProvider>
    </AlertModalProvider>
  );
}

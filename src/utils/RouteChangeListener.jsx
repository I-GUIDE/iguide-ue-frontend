import { useEffect } from "react";

import { useLocation } from "react-router";

export default function RouteChangeListener(props) {
  const onRouteChange = props.onRouteChange;
  const location = useLocation();

  useEffect(() => {
    onRouteChange(location.pathname);
  }, [location, onRouteChange]);

  return null;
}

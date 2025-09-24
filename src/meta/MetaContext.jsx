import { createContext, useContext } from "react";

export const MetaContext = createContext();

export function useMeta() {
  const context = useContext(MetaContext);
  if (!context) {
    throw new Error("useMeta must be used within a MetaProvider");
  }
  return context;
}

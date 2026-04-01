import { createContext,  } from "react";

import type { TAppContextType, TNodeChildrentType } from "../types";

export const APPContext = createContext<Partial<TAppContextType>>({});

export const APPContextProvider = ({ children }: TNodeChildrentType) => {


  return (
    <APPContext.Provider value={{}}>
      {children}
    </APPContext.Provider>
  );
};
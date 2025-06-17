// context/ConfigContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Config = {
  startdate: string;
  enddate: string;
  selectedComp?: string;
};

const getTodayDate = () => {
  return new Date().toISOString().slice(0, 10);
};


const defaultConfig: Config = {
  startdate: getTodayDate(),
  enddate: getTodayDate(),
  selectedComp: "",
  
};

const ConfigContext = createContext<{
  config: Config;
   setConfig: React.Dispatch<React.SetStateAction<Config>>;
}>({
  config: defaultConfig,
  setConfig: () => {},
});

export const useConfig = () => useContext(ConfigContext);

export const HotspotConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<Config>(defaultConfig);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

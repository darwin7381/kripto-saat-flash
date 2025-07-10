'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImportantFilterContextType {
  showImportantOnly: boolean;
  setShowImportantOnly: (show: boolean) => void;
}

const ImportantFilterContext = createContext<ImportantFilterContextType | undefined>(undefined);

export function ImportantFilterProvider({ children }: { children: ReactNode }) {
  const [showImportantOnly, setShowImportantOnly] = useState(false);

  return (
    <ImportantFilterContext.Provider value={{ showImportantOnly, setShowImportantOnly }}>
      {children}
    </ImportantFilterContext.Provider>
  );
}

export function useImportantFilter() {
  const context = useContext(ImportantFilterContext);
  if (context === undefined) {
    throw new Error('useImportantFilter must be used within an ImportantFilterProvider');
  }
  return context;
} 
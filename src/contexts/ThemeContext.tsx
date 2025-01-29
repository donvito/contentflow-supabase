import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext<undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useTheme = () => {
  return { theme: 'light', toggleTheme: () => {} };
};
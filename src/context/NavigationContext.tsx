import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  direction: 1 | -1;
  setDirection: (direction: 1 | -1) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [direction, setDirection] = useState<1 | -1>(1);
  const [currentScreen, setCurrentScreen] = useState<string>('Welcome');

  return (
    <NavigationContext.Provider value={{
      direction,
      setDirection,
      currentScreen,
      setCurrentScreen,
    }}>
      {children}
    </NavigationContext.Provider>
  );
}; 
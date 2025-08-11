import React from 'react';
import { NavigationProvider } from './src/context/NavigationContext';
import StepNavigator from './src/components/StepNavigator';

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <StepNavigator />
    </NavigationProvider>
  );
};

export default App; 
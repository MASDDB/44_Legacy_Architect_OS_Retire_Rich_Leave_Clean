import React from 'react';

import { AuthProvider } from './contexts/AuthContext';
import { StripeProvider } from './contexts/StripeContext';
import Routes from './Routes';

function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <Routes />
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;
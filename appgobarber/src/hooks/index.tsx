import React from 'react';

import { AuthProvider } from './Auth';

const AppProvider: React.FunctionComponent = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;

import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { AuthProvider, useAuth } from './store/AuthProvider.jsx';
import { setupInterceptors } from './utils/setupInterceptors.js';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';
import RegisterLayout from './layouts/RegisterLayout.jsx';
import CanvasGrid from './components/CanvasGrid';
import Whiteboard from './pages/Whiteboard.jsx';

const InterceptorConfig = ({ children }) => {
  const { setAccessToken, logout } = useAuth();

  useEffect(() => {
    setupInterceptors(setAccessToken, logout);
  }, [setAccessToken, logout]);

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <InterceptorConfig>
        <Routes>

          <Route path='/login' element={<Login />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />

          <Route element={<RegisterLayout />}>
            <Route path='/register' element={<Register />} />
            <Route path='/verifyOtp' element={<VerifyOtp />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path='/workspace' element={<Dashboard />}>
              <Route index element={<CanvasGrid filterType="home" />} />
              <Route path="myCanvases" element={<CanvasGrid filterType="owned" />} />
              <Route path="sharedWithMe" element={<CanvasGrid filterType="shared" />} />
              <Route path="recents" element={<CanvasGrid filterType="recent" />} />
            </Route>
            <Route path='/canvas/:id' element={<Whiteboard />} />
          </Route>

        </Routes>
      </InterceptorConfig>
    </AuthProvider>
  );
}

export default App;
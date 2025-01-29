import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Calendar } from './pages/Calendar';
import { ContentList } from './pages/ContentList';
import { Settings } from './pages/Settings';
import { Dashboard } from './pages/Dashboard';
import { AddContent } from './pages/AddContent';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="" element={<Dashboard />} />
            <Route path="add" element={<AddContent />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="content" element={<ContentList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
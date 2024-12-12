import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Properties from './pages/properties/properties';
import AdminLayout from './components/layouts/admin-layout';
import AdminOverview from './pages/admin/overview';
import AdminProperties from './pages/admin/properties';
import AdminUsers from './pages/admin/users';
import AdminMessages from './pages/admin/messages';
import ProtectedRoute from './components/auth/protected-route';
import AuthRoute from './components/auth/auth-route';
import { AuthProvider } from './context/auth-context';
import SingleProperty from './pages/single-property/single-property';
import Home from './pages/home/home';
import Login from './pages/admin/login';
import Register from './pages/admin/register';
import Layout from './components/layout/layout';
import NotFound from './pages/notFound/not-found';
import { AnimatePresence } from 'framer-motion';
import SurprisePage from './pages/surprise/surprise';
import { CacheProvider } from './context/CacheContext';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

function App() {
  return (
    <>
    <Router>
      <CacheProvider>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/properties" element={<Layout><Properties /></Layout>} />
              <Route path="/single/:id" element={<Layout><SingleProperty /></Layout>} />
              <Route path="surprise" element={<SurprisePage />} />

              {/* Auth Routes */}
              <Route path="/admin/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              <Route path="/admin/register" element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminOverview />} />
                <Route path="dashboard" element={<AdminOverview />} />
                <Route path="properties" element={<AdminProperties />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="messages" element={<AdminMessages />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </AnimatePresence>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1F2937',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </CacheProvider>
    </Router>
    <Analytics/>
    <SpeedInsights />
    </>
  );
}

export default App;

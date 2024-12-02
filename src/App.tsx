import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import Layout from './components/layout/layout'
import Home from './pages/home/home'
import Properties from './pages/properties/properties'
import SingleProperty from './pages/single-property/single-property'
import { AnimatePresence } from 'framer-motion'
import NotFound from './pages/notFound/not-found'
import Contact from './pages/contact/contact'
import Services from './pages/services/services'
import AboutUs from './pages/aboutUs/aboutUs'
import AdminDashboard from './pages/admin/dashboard'
import AdminLogin from './pages/admin/login'
import Register from './pages/admin/register'

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/properties" element={<Layout><Properties /></Layout>} />
        <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/single/:id" element={<Layout><SingleProperty /></Layout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;

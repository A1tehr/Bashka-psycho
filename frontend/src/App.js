import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import ProgramsPage from './pages/ProgramsPage';
import ProgramDetailPage from './pages/ProgramDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import AppointmentPage from './pages/AppointmentPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AppointmentsManagement from './pages/admin/AppointmentsManagement';
import ContactsManagement from './pages/admin/ContactsManagement';
import NewsletterManagement from './pages/admin/NewsletterManagement';
import ProgramsManagement from './pages/admin/ProgramsManagement';
import BlogManagement from './pages/admin/BlogManagement';
import SiteSettings from './pages/admin/SiteSettings';
import PrivacyEditor from './pages/admin/PrivacyEditor';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
        <div className="App min-h-screen bg-white">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <Header />
                <main><HomePage /></main>
                <Footer />
              </>
            } />
            <Route path="/programs" element={
              <>
                <Header />
                <main><ProgramsPage /></main>
                <Footer />
              </>
            } />
            <Route path="/programs/:id" element={
              <>
                <Header />
                <main><ProgramDetailPage /></main>
                <Footer />
              </>
            } />
            <Route path="/blog" element={
              <>
                <Header />
                <main><BlogPage /></main>
                <Footer />
              </>
            } />
            <Route path="/blog/:slug" element={
              <>
                <Header />
                <main><BlogPostPage /></main>
                <Footer />
              </>
            } />
            <Route path="/contacts" element={
              <>
                <Header />
                <main><ContactPage /></main>
                <Footer />
              </>
            } />
            <Route path="/appointment" element={
              <>
                <Header />
                <main><AppointmentPage /></main>
                <Footer />
              </>
            } />
            <Route path="/privacy" element={
              <>
                <Header />
                <main><PrivacyPolicyPage /></main>
                <Footer />
              </>
            } />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/appointments" element={<AppointmentsManagement />} />
                      <Route path="/contacts" element={<ContactsManagement />} />
                      <Route path="/newsletter" element={<NewsletterManagement />} />
                      <Route path="/programs" element={<ProgramsManagement />} />
                      <Route path="/blog" element={<BlogManagement />} />
                      <Route path="/settings" element={<SiteSettings />} />
                      <Route path="/privacy" element={<PrivacyEditor />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
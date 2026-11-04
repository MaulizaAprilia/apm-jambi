import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Programs from '../pages/public/Programs';
import News from '../pages/public/News';
import NewsDetail from '../pages/public/NewsDetail';
import Gallery from '../pages/public/Gallery';
import Contact from '../pages/public/Contact';

// Admin Pages
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import NewsList from '../pages/admin/News/NewsList';
import NewsCreate from '../pages/admin/News/NewsCreate';
import NewsEdit from '../pages/admin/News/NewsEdit';
import GalleryList from '../pages/admin/Gallery/GalleryList';
import GalleryCreate from '../pages/admin/Gallery/GalleryCreate';
import GalleryEdit from '../pages/admin/Gallery/GalleryEdit';
import Profile from '../pages/admin/Profile';
import AdminContact from '../pages/admin/Contact';
import Documents from '../pages/admin/Documents';
import HomeContent from '../pages/admin/HomeContent';
import AdminPrograms from '../pages/admin/Programs';
import OrganizationStructure from '../pages/admin/OrganizationStructure';
import CommunityCenters from '../pages/admin/CommunityCenters';
import Users from '../pages/admin/Users';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="tentang" element={<About />} />
          <Route path="program" element={<Programs />} />
          <Route path="berita" element={<News />} />
          <Route path="berita/:slug" element={<NewsDetail />} />
          <Route path="galeri" element={<Gallery />} />
          <Route path="kontak" element={<Contact />} />
        </Route>

        {/* ADMIN AUTH UNPROTECTED ROUTE */}
        <Route path="/admin/login" element={<Login />} />

        {/* ADMIN PROTECTED DASHBOARD ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="home-content" element={<HomeContent />} />
          <Route path="programs" element={<AdminPrograms />} />
          
          <Route path="news" element={<NewsList />} />
          <Route path="news/create" element={<NewsCreate />} />
          <Route path="news/:id/edit" element={<NewsEdit />} />
          
          <Route path="gallery" element={<GalleryList />} />
          <Route path="gallery/create" element={<GalleryCreate />} />
          <Route path="gallery/:id/edit" element={<GalleryEdit />} />

          <Route path="documents" element={<Documents />} />
          <Route path="profile" element={<Profile />} />
          <Route path="organization-structure" element={<OrganizationStructure />} />
          <Route path="community-centers" element={<CommunityCenters />} />
          <Route path="users" element={<Users />} />
          <Route path="contact" element={<AdminContact />} />
        </Route>

        {/* Fallback Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

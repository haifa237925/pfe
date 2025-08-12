import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BookCatalogPage from './pages/BookCatalogPage';
import BookDetailPage from './pages/BookDetailPage';
import ReaderPage from './pages/ReaderPage';
import AudioPlayerPage from './pages/AudioPlayerPage';
import WriterDashboardPage from './pages/dashboard/writer/WriterDashboardPage';
import BookUploadPage from './pages/dashboard/writer/BookUploadPage';
import SalesStatsPage from './pages/dashboard/writer/SalesStatsPage';
import ReaderDashboardPage from './pages/dashboard/reader/ReaderDashboardPage';
import WishlistPage from './pages/dashboard/reader/WishlistPage';
import ReadingHistoryPage from './pages/dashboard/reader/ReadingHistoryPage';
import AdminDashboardPage from './pages/dashboard/admin/AdminDashboardPage';
import UserManagementPage from './pages/dashboard/admin/UserManagementPage';
import ContentModerationPage from './pages/dashboard/admin/ContentModerationPage';
import NotFoundPage from './pages/NotFoundPage';

// Route guards
const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ 
  children, 
  role 
}) => {
  const { user, isLoading } = useAuth();
    console.log("rana wselna lel dashboard ama controuna ")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (role && user.role !== role) {
    // Redirect based on user role
    const redirectPath = user.role === 'writer' ? '/writer' : 
                         user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<BookCatalogPage />} />
        <Route path="books/:id" element={<BookDetailPage />} />
      </Route>
      
      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      
      {/* Protected routes */}
      <Route path="/reader/:id" element={
        <ProtectedRoute>
          <ReaderPage />
        </ProtectedRoute>
      } />
      
      <Route path="/audio/:id" element={
        <ProtectedRoute>
          <AudioPlayerPage />
        </ProtectedRoute>
      } />
      
      {/* Writer Dashboard */}
      <Route path="/writer" element={
        <ProtectedRoute role="writer">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<WriterDashboardPage />} />
        <Route path="upload" element={<BookUploadPage />} />
        <Route path="stats" element={<SalesStatsPage />} />
      </Route>
      
      {/* Reader Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ReaderDashboardPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="history" element={<ReadingHistoryPage />} />
      </Route>
      
      {/* Admin Dashboard */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="moderation" element={<ContentModerationPage />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
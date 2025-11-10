import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loadUser } from './store/slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Browse from './pages/Browse';
import VideoPlayer from './pages/VideoPlayer';
import Profiles from './pages/Profiles';
import Subscription from './pages/Subscription';
import AdminDashboard from './pages/admin/Dashboard';
import VideoUpload from './pages/admin/VideoUpload';
import VideoDetails from './pages/VideoDetails';
import Search from './pages/Search';
import AccountSettings from './pages/AccountSettings';
import Analytics from './pages/admin/Analytics';
import ContentManagement from './pages/admin/ContentManagement';
import VideoEdit from './pages/admin/VideoEdit';

// Styles
import GlobalStyles from './styles/GlobalStyles';

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !user) {
        try {
          await dispatch(loadUser()).unwrap();
        } catch (error) {
          console.error('Failed to load user:', error);
          // Token is invalid, remove it
          localStorage.removeItem('token');
        }
      } else if (!storedToken) {
        // No token found, stop loading
        dispatch({ type: 'auth/stopLoading' });
      }
    };

    initializeAuth();
  }, [dispatch, user]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-logo">StreamFlix</div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <Landing /> : <Navigate to="/profiles" replace />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/profiles" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/profiles" replace />} />
          
          {/* Protected Routes */}
          <Route path="/profiles" element={
            <ProtectedRoute>
              <Profiles />
            </ProtectedRoute>
          } />
          
          <Route path="/home/:profileId" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/browse/:profileId" element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          } />
          
          <Route path="/watch/:videoId/:profileId" element={
            <ProtectedRoute>
              <VideoPlayer />
            </ProtectedRoute>
          } />
          
          <Route path="/subscription" element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } />
          
          {/* Video Details - with profile */}
          <Route path="/details/:videoId/:profileId" element={
            <ProtectedRoute>
              <VideoDetails />
            </ProtectedRoute>
          } />
          
          {/* Video Details - without profile (for admin preview) */}
          <Route path="/details/:videoId" element={
            <ProtectedRoute>
              <VideoDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/search/:profileId" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          
          <Route path="/account" element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes - Allow access if user is admin */}
          <Route path="/admin" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/profiles" />}
            </ProtectedRoute>
          } />
          
          <Route path="/admin/upload" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <VideoUpload /> : <Navigate to="/profiles" />}
            </ProtectedRoute>
          } />
          
          <Route path="/admin/analytics" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <Analytics /> : <Navigate to="/profiles" />}
            </ProtectedRoute>
          } />
          
          <Route path="/admin/content" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <ContentManagement /> : <Navigate to="/profiles" />}
            </ProtectedRoute>
          } />
          
          <Route path="/admin/videos/:id/edit" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <VideoEdit /> : <Navigate to="/profiles" />}
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to={user ? "/profiles" : "/"} />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </>
  );
}

export default App;

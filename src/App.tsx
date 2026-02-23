import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Pages/Home'; 
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminDashboard from './Pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CategoryPage from './Pages/CategoryPage'; 
import BookByAuthor from './Pages/BookByAuthor';
import BookDetailPage from './Pages/BookDetailPage';
import Cart from './Pages/Cart';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/author/:id" element={<BookByAuthor />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
      </>
    </Router>
  );
}

export default App;
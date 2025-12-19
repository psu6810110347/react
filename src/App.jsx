import './App.css';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';

// 1. ตั้งค่า Base URL ครั้งเดียว
axios.defaults.baseURL = 'http://localhost:3000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ใช้ useCallback เพื่อให้เรียกใช้ซ้ำได้ทั้งตอนเริ่มแอปและหลัง Login
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const savedToken = Cookies.get('token');
    if (savedToken) {
      setAuthHeader(savedToken);
      setIsAuthenticated(true);
    }
    setIsReady(true);
  }, []);

  const handleLoginSuccess = (token) => {
    // ต้องรับ token มาจาก LoginScreen เพื่อ set header ทันที
    setAuthHeader(token); 
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setAuthHeader(null);
    setIsAuthenticated(false);
  };

  if (!isReady) return null; // หรือใส่ loading spinner สวยๆ ตรงนี้

  return (
    <Routes>
      {/* หน้า Login: ถ้า Login แล้วให้เด้งไปหน้า Books */}
      <Route path="/login" element={
        !isAuthenticated ? 
        <LoginScreen onLoginSuccess={handleLoginSuccess} /> : 
        <Navigate to="/books" replace />
      } />

      {/* หน้า Books: ถ้ายังไม่ Login ให้เด้งไปหน้า Login */}
      <Route path="/books" element={
        isAuthenticated ? 
        <BookScreen onLogout={handleLogout} /> : 
        <Navigate to="/login" replace />
      } />

      {/* Default Route */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/books" : "/login"} replace />} />
      
      {/* 404 Page (Optional) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
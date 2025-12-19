import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedToken = Cookies.get('token'); 
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      setIsAuthenticated(true);
    }
    setIsReady(true);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isReady) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={
        !isAuthenticated ? 
        <LoginScreen onLoginSuccess={handleLoginSuccess} /> : 
        <Navigate to="/books" />
      } />

      <Route path="/books" element={
        isAuthenticated ? <BookScreen /> : <Navigate to="/login" />
      } />

      <Route path="/" element={<Navigate to={isAuthenticated ? "/books" : "/login"} />} />
    </Routes>
  );
}

export default App;
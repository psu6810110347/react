import './App.css';
import axios from 'axios';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // เช็คคุกกี้ตอนโหลดหน้าเว็บครั้งแรก
  useEffect(() => {
    const savedToken = Cookies.get('token'); 
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <BookScreen />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
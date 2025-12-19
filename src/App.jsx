import './App.css';
import axios from 'axios';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    <>
      {isAuthenticated ? (
        <BookScreen />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
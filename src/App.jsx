import { useEffect, useState } from 'react';
import { useAuth } from './components/AuthContext';
import axios from 'axios';
import Login from './components/Login';
import Protected from './components/Protected';
import './App.css';

function App() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchProfile() {
      try {
        const response = await axios.get('/profile', {
          withCredentials: true,
          timeout: 10000
        });

        if (active) {
          setUser(response.data?.email ? response.data : null);
        }
      } catch (error) {
        if (active) {
          console.error('Unable to check the current session:', error);
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();
    return () => {
      active = false;
    };
  }, [setUser]);

  if (isLoading) {
    return <div className="auth-loading" role="status">Checking your session...</div>;
  }

  return user ? <Protected /> : <Login />;
}

export default App;
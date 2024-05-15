import './App.css';
import AppRoutes from './routes/AppRoutes.jsx';
import tokenManager from './services/TokenManager.js';
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = await tokenManager.getUserId();
      const userRoles = await tokenManager.getUserRoles();

      setUserRole(userRoles);
      setIsAuthorized(tokenManager.isAuthenticated());
      console.log("isAuthorized:", isAuthorized);
      console.log("userRole:", userRole);
    };

    fetchData();
  }, []); // Empty dependency array ensures that useEffect runs only once, like componentDidMount



  return (
    <BrowserRouter>
      <AppRoutes isAuthorized={isAuthorized} userRole={userRole} />
    </BrowserRouter>
  );
}

export default App;

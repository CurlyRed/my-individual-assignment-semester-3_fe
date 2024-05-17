import './App.css';
import AppRoutes from './routes/AppRoutes.jsx';
import TokenManager from './services/TokenManager.js';
import { BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <AppRoutes isAuthorized={TokenManager.isAuthenticated()} userRole={TokenManager.getUserRole()} />
    </BrowserRouter>
  );
}

export default App;

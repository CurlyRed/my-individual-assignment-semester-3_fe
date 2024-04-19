import './App.css'
import AppRoutes from './routes/AppRoutes.jsx'
import {BrowserRouter} from "react-router-dom"

function App() {

const isAuthorized = true;
const adminRole = 'admin';
const userRole = 'user';
const supportRole = 'support';

  return (
    <>
        <BrowserRouter>
          <AppRoutes isAuthorized={isAuthorized} userRole={adminRole} />
        </BrowserRouter>
    </>
  )
}

export default App;

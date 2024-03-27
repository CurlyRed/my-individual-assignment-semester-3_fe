import './App.css'
import AppRoutes from './routes/AppRoutes.jsx'
import {BrowserRouter} from "react-router-dom"

function App() {

const isAuthorized = true;

  return (
    <>
        <BrowserRouter>
          <AppRoutes isAuthorized={isAuthorized} />
        </BrowserRouter>
    </>
  )
}

export default App

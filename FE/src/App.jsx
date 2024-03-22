import './App.css'
import AppRoutes from './routes/AppRoutes.jsx'
import {BrowserRouter} from "react-router-dom"

function App() {

  return (
    <>
        <BrowserRouter>
          <AppRoutes></AppRoutes>
        </BrowserRouter>
    </>
  )
}

export default App

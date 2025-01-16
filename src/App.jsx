import { Routes, Route, BrowserRouter } from "react-router-dom"
import './App.css'
import Layout from "./Pages/Layout"
import Home from "./Pages/Home"
import Register from "./Pages/Auth/Register"
import Login from "./Pages/Auth/Login"
import { AppContext } from "./Context/AppContext"
import { useContext, useState } from "react"
import Create from "./Pages/Posts/Create"
import Show from "./Pages/Posts/Show"
import Update from "./Pages/Posts/Update"

export default function App() {
  const { user } = useContext(AppContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  return (
    // Creando la estructura de enrutamiento para la navegación de la aplicación
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          
          <Route path="/register" element={ user && !isRegistering ? <Home/> : <Register setIsRegistering={setIsRegistering}/>}/>
  
          <Route path="/login" element={user && !isLoggingIn ? <Home/> :<Login setIsLogginIn={setIsLoggingIn} />}/>

          <Route path="/create" element={user ? <Create/> :<Login/>}/>

          <Route path="/posts/:id" element={<Show/>}/>

          <Route path="/posts/update/:id" element={user ? <Update/> :<Login/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

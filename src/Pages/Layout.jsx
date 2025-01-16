import { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { Alert, Button, Dialog, DialogActions, DialogTitle, Snackbar } from "@mui/material";

export default function Layout () {
  const {user, token, setUser, setToken} = useContext(AppContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate()
  
  const handleOpenDialog = () => {
      setOpenDialog(true);
    };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenDialog(false);
  };

  async function handleLogout(e) {
    e.preventDefault();

    
    console.log("Se presiona botón cerrar sesión");
    

    const res = await fetch('/api/logout', {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setOpenDialog(false);
      navigate('/');
    }

  }

  return (
    <>
        <header>
            <nav>
              <Link to="/" className="nav-link">Inicio</Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <p className="text-slate-400 text-sm">Bienvenido(a), {user.name}</p>
                  <Link to="/create" className="nav-link">Nuevo post</Link>
                    <button className="nav-link" onClick={handleOpenDialog}>Cerrar sesión</button>
                </div>
              ) : (
              <div className="space-x-4">
                <Link to="/register" className="nav-link">Registro</Link>
                <Link to="/login" className="nav-link">Iniciar sesión</Link>
              </div>
              )}
            </nav>
            
        </header>

        <main>
            <Outlet/>
        </main>

        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Seguro deseas cerrar sesión?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button color="error" onClick={handleLogout}>Cerrar sesión</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                {successMessage}
            </Alert>
        </Snackbar>
    </>
  )
}

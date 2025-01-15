import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { Snackbar, Alert } from '@mui/material';

export default function Register ({ setIsRegistering}) {

    const {setToken} = useContext(AppContext);
    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [open, setOpen] = useState(false);

    async function handleRegister(e) {
        e.preventDefault();

        setIsRegistering(true);

        // Se realiza la petición HTTP al endpoint de nuestra API (únicamente se pone la ruta específica porque en el archivo vite.config.js ya se definió cuál es la ruta del servidor)
        const res = await fetch('/api/register', {
            method: 'post',
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (data.errors) {
            setErrors(data.errors);
            setSuccessMessage('');
            setIsRegistering(false);
        } else {
            localStorage.setItem("token", data.plainTextToken);
            setToken(data.plainTextToken);
            setSuccessMessage('¡Registro exitoso!');
            setErrors({});
            setOpen(true); // Abre el Snackbar
            setTimeout(() => {
                setIsRegistering(false);
                navigate('/');
            }, 3000); // Redirige después de 3 segundos
            console.log(data);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
      <>
          <h1 className="title">Registra una cuenta nueva</h1>

          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                {successMessage}
            </Alert>
          </Snackbar>

          <form onSubmit={handleRegister} className="w-1/2 mx-auto space-y-6">
            <div>
                <input type="text" placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value})}/>
                {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div>
                <input type="text" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value})}/>
                {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div>
                <input type="password" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value})}/>
                {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div>
                <input type="password" placeholder="Confirmar contraseña" value={formData.password_confirmation} onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value})}/>
            </div>
            <button className="primary-btn">Registrarse</button>
          </form>
      </>
    )
  }
  
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { Snackbar, Alert } from "@mui/material";

export default function Login ({ setIsLogginIn }) {

    const {setToken} = useContext(AppContext);
    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [open, setOpen] = useState(false);


    async function handleLogin(e) {
        e.preventDefault();

        // Se realiza la petición HTTP al endpoint de nuestra API (únicamente se pone la ruta específica porque en el archivo vite.config.js ya se definió cuál es la ruta del servidor)
        const res = await fetch('/api/login', {
            method: 'post',
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        console.log(data);

        if (data.errors) {
            setErrors(data.errors);
            setSuccessMessage('');
        } else {
            localStorage.setItem("token", data.plainTextToken);
            setToken(data.plainTextToken);
            setSuccessMessage('¡Inicio de sesión exitoso!');
            setOpen(true);
            setIsLogginIn(true);
            setTimeout(() => {
                setIsLogginIn(false);
                navigate('/');
            }, 3000); // Redirige después de 3 segundos
        }
    }

    return (
      <>
          <h1 className="title">Inicia sesión</h1>

          <Snackbar open={open} autoHideDuration={3000}>
            <Alert severity="success" sx={{width: '100%'}}>
                {successMessage}
            </Alert>
          </Snackbar>

          <form onSubmit={handleLogin} className="w-10/12 md:w-1/2 lg:w-1/2 xl:w-1/2 sm:w-4/5 mx-auto space-y-6">
            <div>
                <input type="text" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value})}/>
                {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div>
                <input type="password" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value})}/>
                {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <button className="primary-btn">Entrar</button>
          </form>
      </>
    )
  }
  
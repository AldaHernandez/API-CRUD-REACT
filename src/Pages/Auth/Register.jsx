import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Register () {

    const {setToken} = useContext(AppContext);
    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});

    async function handleRegister(e) {
        e.preventDefault();

        // Se realiza la petición HTTP al endpoint de nuestra API (únicamente se pone la ruta específica porque en el archivo vite.config.js ya se definió cuál es la ruta del servidor)
        const res = await fetch('/api/register', {
            method: 'post',
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (data.errors) {
            setErrors(data.errors);
        } else {
            localStorage.setItem("token", data.plainTextToken);
            setToken(data.plainTextToken);
            navigate('/');
            console.log(data);
        }
    }

    return (
      <>
          <h1 className="title">Registra una cuenta nueva</h1>

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
  
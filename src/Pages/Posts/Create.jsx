import { useContext, useState } from "react"
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

export default function Create () {
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: "",
        body: ""
    });

    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState('');
    const [open, setOpen] = useState(false);

    async function handleCreate(e) {
        e.preventDefault();

        const res = await fetch('/api/posts', {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        });
        
        const data = await res.json();

        if (data.errors) {
            setErrors(data.errors);
            setSuccessMessage('');
        } else {
            setSuccessMessage('¡Post creado exitosamente!');
            setOpen(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
            
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
        <h1 className="title">Crear un nuevo post</h1>

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                {successMessage}
            </Alert>
        </Snackbar>

        <form onSubmit={handleCreate} className="w-11/12 md:w-1/2 lg:w-1/2 xl:w-1/2 sm:w-4/5 mx-auto space-y-6">
            <div>
                <input type="text" placeholder="Título del post" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                {errors.title && <p className="error">{errors.title[0]}</p>}
            </div>

            <div>
                <textarea style={{resize:"none"}} rows="6" placeholder="Contenido del post" value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})}></textarea>
                {errors.body && <p className="error">{errors.body[0]}</p>}
            </div>

            <button className="primary-btn">Crear</button>
        </form>
        </>
    )
}
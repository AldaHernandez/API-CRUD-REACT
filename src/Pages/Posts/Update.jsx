import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

export default function Update () {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: "",
        body: ""
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [open, setOpen] = useState(false);

    const [errors, setErrors] = useState({});

    async function getPost() {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        
        if (res.ok) {

            if (data.post.user_id !== user.id) {
                navigate("/");
            }

            setFormData({
                title: data.post.title,
                body: data.post.body,
            });
        }
    }

    useEffect(() => {
        getPost();
    }, []);

    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(`/api/posts/${id}`, {
            method: 'put',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        });
        
        const data = await res.json();

        console.log(data);

        if (data.errors) {
            setErrors(data.errors);
            setSuccessMessage('');
        } else {
            setSuccessMessage('Post actualizado');
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
        <h1 className="title">Actualiza tu post</h1>
        
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                {successMessage}
            </Alert>
        </Snackbar>

        <form onSubmit={handleUpdate} className="w-11/12 md:w-1/2 lg:w-1/2 xl:w-1/2 sm:w-4/5 mx-auto space-y-6">
            <div>
                <input type="text" placeholder="Título del post" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                {errors.title && <p className="error">{errors.title[0]}</p>}
            </div>

            <div>
                <textarea style={{resize:"none"}} rows="6" placeholder="Contenido del post" value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})}></textarea>
                {errors.body && <p className="error">{errors.body[0]}</p>}
            </div>

            <button className="primary-btn">Guardar</button>
        </form>
        </>
    )
}
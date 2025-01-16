import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";

export default function Show() {
  const navigate = useNavigate();
    const { id } = useParams();
    const { user, token } = useContext(AppContext);

    const [post, setPost] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const handleOpenDialog = () => {
      setOpenDialog(true);
    };

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setOpenDialog(false);
    };

    async function getPost() {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        
        if (res.ok) {
            setPost(data.post);
        }
    }

    async function handleDelete() {

      if (user && user.id === post.user_id) {
        const res = await fetch(`/api/posts/${id}`, {
          method: 'delete',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setSuccessMessage('Post eliminado');
          setOpenDialog(false);
          setOpenSnackbar(true);
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
        
        console.log(res);
         
        console.log(data);
      }
      
    }

    useEffect(() => {
        getPost();
    }, []);

    return (
      <>
        <div className="w-11/12 md:w-1/2 lg:w-1/2 xl:w-1/2 sm:w-4/5 mx-auto">    
          {post ? ( 
            <div key={post.id} className="mt-4 p-4 border rounded-md border-dashed border-slate-400">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-2xl">{post.title}</h2>
                  <small className="text-xs text-slate-600"> Creado por: {post.user.name} on {" "} {new Date (post.created_at).toLocaleTimeString()}</small>
                </div>
              </div>
              <p>{post.body}</p>

              {user && user.id === post.user_id && <div className="mt-2 flex items-center justify-end gap-4">
                <Link to={`/posts/update/${post.id}`} className="bg-green-500 text-white text-sm rounded-lg px-3 py-1">Editar</Link>

                <button className="bg-red-500 text-white text-sm rounded-lg px-3 py-1" onClick={handleOpenDialog}>
                  Borrar
                </button>
              </div>}
            </div>    
          ) : ( 
          <p>Post no encontrado</p>
          )}
        </div>
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Borrar post?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Si das clic sobre el botón "Borrar", el post dejará de estar disponible
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleDelete} color="error">Borrar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {successMessage}
            </Alert>
        </Snackbar>
      </>
    );
}
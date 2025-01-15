import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Show() {
  const navigate = useNavigate();
    const { id } = useParams();
    const { user, token } = useContext(AppContext);

    const [post, setPost] = useState(null);

    async function getPost() {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        
        if (res.ok) {
            setPost(data.post);
        }
    }

    async function handleDelete(e) {
      e.preventDefault ();

      if (user && user.id === post.user_id) {
        const res = await fetch(`/api/posts/${id}`, {
          method: 'delete',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          navigate('/');
        }
        
        console.log(res);
         
        console.log(data);
      }
      
    }

        useEffect(() => {
            getPost();
        }, []);

    return (
      <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 sm:w-4/5 mx-auto">    
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

              <form onSubmit={handleDelete}>
                <button className="bg-red-500 text-white text-sm rounded-lg px-3 py-1">
                  Borrar
                </button>
              </form>
            </div>}
          </div>    
        ) : ( 
        <p>Post no encontrado</p>
        )}
      </div>
    );
}
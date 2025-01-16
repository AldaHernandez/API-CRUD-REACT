import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home () {
  const [posts, setPosts] = useState([]);
  
  async function getPosts () {
    const res = await fetch('/api/posts');
    const data = await res.json();
    
  
    if (res.ok) {
      setPosts(data);
    } 
  }

  useEffect(()=>{
    getPosts();
  }, []);

  return (
    <div className="w-11/12 md:w-1/2 lg:w-1/2 xl:w-1/2 sm:w-4/5 mx-auto">
        <h1 className="title">Últimos posts</h1>

        {posts.length > 0 ? posts.map((post) => (
          <div key={post.id} className="mb-4 p-4 border rounded-md border-dashed border-slate-400">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h2 className="font-bold text-2xl">{post.title}</h2>
                <small className="text-xs text-slate-600"> Creado por: {post.user.name} on {" "} {new Date (post.created_at).toLocaleTimeString()}</small>
              </div>
              <Link to={`/posts/${post.id}`} className="bg-blue-500 text-white text-sm rounded-lg px-3 py-1">Leer más</Link>
            </div>
            <p>{post.body}</p>
          </div>
        )) : <p>No hay posts, cawn</p>}
    </div>
  );
}
  
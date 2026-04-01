import { useEffect, useState } from "react";

function Feed() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setData(data?.member || []);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Feed</h1>

      {data.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <small>{post.createdAt}</small>
        </div>
      ))}
    </div>
  );
}

export default Feed;
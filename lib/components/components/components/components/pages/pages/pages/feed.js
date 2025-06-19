import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(name, profile_image)')
      .order('created_at', { ascending: false });
    
    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && newPost.trim()) {
      const { error } = await supabase
        .from('posts')
        .insert([{ user_id: user.id, content: newPost }]);
      
      if (!error) {
        setNewPost('');
        fetchPosts();
      }
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border border-gray-300 rounded-md mb-3"
                rows={3}
              />
              <button
                type="submit"
                className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Post
              </button>
            </form>
          </div>
          
          {loading ? (
            <div>Loading posts...</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <h3 className="font-semibold">{post.users?.name || 'Anonymous'}</h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

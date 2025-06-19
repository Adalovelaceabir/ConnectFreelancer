import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';

export default function CreateService() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('services')
        .insert([{
          freelancer_id: user.id,
          title,
          description,
          price: parseFloat(price),
          category,
        }]);
      
      if (!error) {
        router.push('/services');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Create a New Service</h1>
          
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={5}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-md w-full"
            >
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
    }

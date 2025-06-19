import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    let query = supabase
      .from('services')
      .select('*, users(name, profile_image)');
    
    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (data) {
      setServices(data);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('services')
      .select('category')
      .not('category', 'is', null);
    
    if (data) {
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Browse Services</h1>
          <Link href="/services/create" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Create Service
          </Link>
        </div>
        
        <div className="mb-6">
          <label className="mr-2">Filter by category:</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <div>Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h3 className="font-semibold">{service.users?.name || 'Anonymous'}</h3>
                    <p className="text-gray-500 text-sm">{service.category}</p>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${service.price}</span>
                  <Link 
                    href={`/services/${service.id}`}
                    className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

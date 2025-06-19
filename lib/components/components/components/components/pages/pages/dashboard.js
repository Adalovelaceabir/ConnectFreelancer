import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import ProfileSwitcher from '../components/ProfileSwitcher';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setRole(data.role);
        }
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
                <h2 className="text-xl font-semibold">{user.email}</h2>
                <p className="text-gray-600">{role}</p>
              </div>
            </div>
            
            <ProfileSwitcher />
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-4">Welcome to your dashboard</h2>
              
              {role === 'freelancer' || role === 'both' ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Freelancer Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="/services/create" className="bg-primary hover:bg-blue-600 text-white p-4 rounded-lg text-center">
                      Create a Service
                    </a>
                    <a href="/projects" className="bg-secondary hover:bg-green-600 text-white p-4 rounded-lg text-center">
                      Browse Projects
                    </a>
                  </div>
                </div>
              ) : null}
              
              {role === 'buyer' || role === 'both' ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Buyer Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="/projects/create" className="bg-primary hover:bg-blue-600 text-white p-4 rounded-lg text-center">
                      Post a Project
                    </a>
                    <a href="/services" className="bg-secondary hover:bg-green-600 text-white p-4 rounded-lg text-center">
                      Browse Services
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

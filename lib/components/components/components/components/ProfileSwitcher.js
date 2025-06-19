import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProfileSwitcher() {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setRole(data.role);
        }
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  const updateRole = async (newRole) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', user.id);
      
      if (!error) {
        setRole(newRole);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-2">Your Profile Role</h3>
      <div className="flex space-x-4">
        <button
          onClick={() => updateRole('freelancer')}
          className={`px-4 py-2 rounded-md ${role === 'freelancer' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Freelancer
        </button>
        <button
          onClick={() => updateRole('buyer')}
          className={`px-4 py-2 rounded-md ${role === 'buyer' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Buyer
        </button>
        <button
          onClick={() => updateRole('both')}
          className={`px-4 py-2 rounded-md ${role === 'both' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Both
        </button>
      </div>
    </div>
  );
}

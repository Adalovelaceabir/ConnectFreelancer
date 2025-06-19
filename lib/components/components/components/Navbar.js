import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="bg-dark text-light p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          SocialFreelance
        </Link>
        
        <div className="flex space-x-4 items-center">
          <Link href="/feed" className="hover:text-secondary">
            Feed
          </Link>
          <Link href="/services" className="hover:text-secondary">
            Services
          </Link>
          <Link href="/projects" className="hover:text-secondary">
            Projects
          </Link>
          <Link href="/messages" className="hover:text-secondary">
            Messages
          </Link>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
    }

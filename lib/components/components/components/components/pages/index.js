import AuthComponent from '../components/Auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-light">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-dark mb-4">
            Welcome to SocialFreelance
          </h1>
          <p className="text-xl text-gray-600">
            The platform that combines social networking with freelancing opportunities
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary">For Freelancers</h2>
            <ul className="space-y-2">
              <li>Showcase your skills and services</li>
              <li>Connect with potential clients</li>
              <li>Build your professional network</li>
              <li>Get discovered through social interactions</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-secondary">For Buyers</h2>
            <ul className="space-y-2">
              <li>Find talented professionals</li>
              <li>Post your projects and get bids</li>
              <li>Engage with freelancers socially</li>
              <li>Build long-term professional relationships</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10">
          <AuthComponent />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert('Error signing up: ' + error.message);
    } else {
      alert('Sign up successful! Please check your email to verify.');
      router.push('/'); // Redirect to homepage after successful signup
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-md border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">Create a New Account</h1>
        <form onSubmit={handleSignUp}>
          {/* Email and Password input fields remain the same... */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold" htmlFor="email">Email</label>
            <input
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold" htmlFor="password">Password</label>
            <input
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
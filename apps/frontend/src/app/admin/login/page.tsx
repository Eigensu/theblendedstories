'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid credentials');
      }

      localStorage.setItem('admin_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('admin_refresh_token', data.refresh_token);
      }
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black font-sans">
      
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] border-r border-[#222222] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl leading-none -mt-0.5">T</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">The Blended Stories</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Manage your content with precision.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            A premium content management experience designed exclusively for The Blended Stories.
          </p>
        </div>
        
        <div className="relative z-10 text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} The Blended Stories. All rights reserved.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative bg-black">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-10 lg:hidden flex flex-col items-center">
             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
              <span className="text-black font-bold text-2xl leading-none -mt-0.5">T</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">TBS Admin</h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back</h2>
            <p className="text-zinc-400">Sign in to your account to continue</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-1.5">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full px-4 py-3 bg-[#111111] border border-[#222222] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white focus:border-transparent transition-all sm:text-sm placeholder-zinc-600"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full px-4 py-3 bg-[#111111] border border-[#222222] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white focus:border-transparent transition-all sm:text-sm placeholder-zinc-600"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl shadow-sm ${isLoading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200 hover:shadow-md active:scale-[0.98]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black focus:ring-offset-black transition-all duration-200`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-zinc-500" />
                    Authenticating...
                  </>
                ) : 'Sign in'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, UserPlus, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    const endpoint = isLogin ? 'login' : 'register';
    const apiUrl = `https://localhost:44331/api/Auth/${endpoint}`;

    try {
      const res = await axios.post(apiUrl, formData);
      
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        setStatus({ type: 'success', msg: 'Access Granted. Redirecting...' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        setStatus({ type: 'success', msg: 'Account created! Please login.' });
        setIsLogin(true);
      }
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        msg: err.response?.data || 'Connection failed. Is the API running?' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <ShieldCheck className="mx-auto text-praxent-blue mb-2" size={48} />
          <h2 className="text-3xl font-bold text-gray-900">{isLogin ? 'Sign In' : 'Register'}</h2>
          <p className="text-gray-500 mt-2">Almacen Insurance Secure Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-praxent-blue outline-none"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          
          {!isLogin && (
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-praxent-blue outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-praxent-blue outline-none"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button type="submit" className="w-full bg-praxent-blue text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
            {isLogin ? <LogIn size={20}/> : <UserPlus size={20}/>}
            {isLogin ? 'Login to Dashboard' : 'Create Account'}
          </button>
        </form>

        {status.msg && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <AlertCircle size={16} /> {status.msg}
          </div>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-praxent-blue hover:underline text-sm font-semibold">
            {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
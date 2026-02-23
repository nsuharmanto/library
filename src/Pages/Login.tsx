import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setFormError('');

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch('https://library-backend-production-b9cf.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.data && data.data.user && data.data.token) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('token', data.data.token);
      
      const role = (data.data.user.role || '').toLowerCase();
        
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setFormError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setFormError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen px-8 flex items-center justify-center bg-white">
      <div className="w-full max-w-[400px] flex flex-col justify-center">
        {/* Logo & Title */}
        <div className="flex flex-col items-start mb-5">
          <div className="mb-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="focus:outline-none bg-transparent border-none p-0 m-0"
              style={{ display: 'inline-block' }}
              aria-label="Back to homepage"
            >
              <img src="logos/booky_logo.svg" alt="Booky Logo" className="w-8 h-8 inline-block mr-2 align-middle" />
            </button>
            <span className="text-2xl font-bold align-middle">Booky</span>
          </div>
          <h2 className="text-2xl font-bold mt-4 mb-1">Login</h2>
          <p className="text-gray-500 text-sm mb-2">Sign in to manage your library account.</p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-sm font-bold mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className={`border rounded-lg px-4 py-2 text-text-md font-semibold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${emailError ? 'border-red-400' : 'border-gray-300'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {emailError && (
              <div className="text-xs font-medium text-red-500 mt-1">{emailError}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`border rounded-lg px-4 py-2 text-text-md font-semibold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10 ${passwordError ? 'border-red-400' : 'border-gray-300'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <img src="/icons/eye-on.svg" alt="Hide password" width={20} height={20} />
                ) : (
                  <img src="/icons/eye-off.svg" alt="Show password" width={20} height={20} />
                )}
              </button>
            </div>
            {passwordError && (
              <div className="text-xs font-medium text-red-500 mt-1">{passwordError}</div>
            )}
          </div>
          {formError && (
            <div className="text-xs font-medium text-red-500 mt-1 text-center">{formError}</div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-full font-bold text-text-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-text-md font-semibold">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
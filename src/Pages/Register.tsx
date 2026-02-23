import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Error state per field
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Validasi custom
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email address';
    if (!phone) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10,15}$/.test(phone)) newErrors.phone = 'Invalid phone number';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset error saat input berubah
  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'name': setName(value); break;
      case 'email': setEmail(value); break;
      case 'phone': setPhone(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPassword': setConfirmPassword(value); break;
    }
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setFormError('');
    try {
      const res = await fetch('https://library-backend-production-b9cf.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/login');
      } else {
        setFormError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setFormError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="bg-white w-full max-w-[400px] px-0 py-8 flex flex-col items-start">
        {/* Logo & Title */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="focus:outline-none bg-transparent border-none mb-4"
          aria-label="Back to homepage"
        >
          <img src="/logos/booky_logo.svg" alt="Booky Logo" className="w-10 h-10 mx-auto" />
        </button>
        <h2 className="text-display-sm font-bold mb-2">Register</h2>
        <p className="text-neutral-700 text-text-md font-semibold mb-6">
          Create your account to start borrowing books.
        </p>
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" noValidate>
          <div>
            <label className="block text-text-sm font-bold mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              className={`border rounded-lg px-4 py-2 text-text-md font-semibold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              autoComplete="name"
              disabled={loading}
            />
            {errors.name && (
              <div className="text-xs text-red-500 mt-1">{errors.name}</div>
            )}
          </div>
          <div>
            <label className="block text-text-sm font-bold mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className={`border rounded-lg px-4 py-2 text-text-md font-semibold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && (
              <div className="text-xs text-red-500 mt-1">{errors.email}</div>
            )}
          </div>
          <div>
            <label className="block text-text-sm font-bold mb-1" htmlFor="phone">Nomor Handphone</label>
            <input
              id="phone"
              type="tel"
              placeholder="Nomor Handphone"
              className={`border rounded-lg px-4 py-2 text-text-md font-semibold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
              value={phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              autoComplete="tel"
              disabled={loading}
            />
            {errors.phone && (
              <div className="text-xs text-red-500 mt-1">{errors.phone}</div>
            )}
          </div>
          <div>
            <label className="block text-text-sm font-bold mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`border rounded-lg px-4 py-2 text-text-md font-semibold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                <img
                  src={showPassword ? "/icons/eye-on.svg" : "/icons/eye-off.svg"}
                  alt={showPassword ? "Hide password" : "Show password"}
                  width={20}
                  height={20}
                />
              </button>
            </div>
            {errors.password && (
              <div className="text-xs text-red-500 mt-1">{errors.password}</div>
            )}
          </div>
          <div>
            <label className="block text-text-sm font-bold mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                className={`border rounded-lg px-4 py-2 text-text-md font-semibold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
                value={confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                disabled={loading}
              >
                <img
                  src={showConfirm ? "/icons/eye-on.svg" : "/icons/eye-off.svg"}
                  alt={showConfirm ? "Hide password" : "Show password"}
                  width={20}
                  height={20}
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="text-xs text-red-500 mt-1">{errors.confirmPassword}</div>
            )}
          </div>
          {formError && (
            <div className="text-xs text-red-500 mt-1 text-center">{formError}</div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-full font-bold text-md hover:bg-blue-700 transition w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Submit'}
          </button>
        </form>
        <div className="mt-6 text-center text-md font-semibold mx-auto">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
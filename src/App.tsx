import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Hello Library!</h1>
      <p className="text-lg text-gray-700 mb-2">
        Tailwind CSS is <span className="font-semibold text-green-600">working</span> 🎉
      </p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">
        Test Button
      </button>
    </div>
  );
}

function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Login Page</h2>
      {/* Form login akan dibuat di step berikutnya */}
    </div>
  );
}

function Register() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Register Page</h2>
      {/* Form register akan dibuat di step berikutnya */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
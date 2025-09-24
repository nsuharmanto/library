import React from 'react';

function App() {
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

export default App;
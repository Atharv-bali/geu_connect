import React from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user } = useAuth();
  const userAvatar = `https://ui-avatars.com/api/?name=${user?.fullName}&background=1e40af&color=fff`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-primary">GEU-Connect</h1>
        <input
          type="text"
          placeholder="Search students, professors, projects..."
          className="hidden md:block w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-3">
          <img
            src={userAvatar}
            alt={user?.fullName}
            className="w-10 h-10 rounded-full border-2 border-primary"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

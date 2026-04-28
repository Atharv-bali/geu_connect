import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Reputation Points', value: user?.reputationPoints || 0, icon: '⭐', color: 'bg-blue-100 text-blue-700' },
    { label: 'Active Projects', value: user?.activeProjects?.length || 0, icon: '💼', color: 'bg-green-100 text-green-700' },
    { label: 'Role', value: user?.role || 'Student', icon: '👤', color: 'bg-purple-100 text-purple-700' },
    { label: 'Skills', value: user?.skills?.length || 0, icon: '🎯', color: 'bg-yellow-100 text-yellow-700' }
  ];

  const recentActivity = [
    { action: 'Joined project', detail: 'AI-Powered Campus Navigation System', time: '2 hours ago' },
    { action: 'Earned badge', detail: 'Gold Contributor Badge', time: '1 day ago' },
    { action: 'Posted in forum', detail: 'React state management discussion', time: '2 days ago' },
    { action: 'Interview scheduled', detail: 'Research Assistant Position', time: '3 days ago' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName}! 👋</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your academic network today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`text-4xl ${stat.color} w-16 h-16 rounded-lg flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-gray-600 text-sm">{activity.detail}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/feed')}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition text-left flex items-center space-x-3"
            >
              <span>📝</span>
              <span>Create Post</span>
            </button>
            <button 
              onClick={() => navigate('/projects')}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-left flex items-center space-x-3"
            >
              <span>💼</span>
              <span>Browse Projects</span>
            </button>
            <button 
              onClick={() => navigate('/forum')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-left flex items-center space-x-3"
            >
              <span>💬</span>
              <span>Join Discussion</span>
            </button>
            <button 
              onClick={() => navigate('/interviews')}
              className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-left flex items-center space-x-3"
            >
              <span>📅</span>
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Reputation Progress</span>
              <span className="text-sm font-medium text-primary">{user?.reputationPoints || 0} / 1000 pts</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${((user?.reputationPoints || 0) / 1000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useState } from 'react';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProjectCard({ project, onRequestSent }) {
  const { user } = useAuth();
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const handleRequestToJoin = async () => {
    try {
      setRequesting(true);
      setError('');
      await projectAPI.requestToJoin(project._id, 'I would like to join this project');
      setRequested(true);
      if (onRequestSent) onRequestSent();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
      console.error('Error requesting to join:', err);
    } finally {
      setRequesting(false);
    }
  };

  const isOwner = project.user?._id === user?.id;
  const hasRequested = project.joinRequests?.some(req => req.user._id === user?.id) || requested;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
          {project.isResearchProject && (
            <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              🔬 Research Project
            </span>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4">{project.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-semibold mr-2">Posted by:</span>
          <span>{project.user?.fullName || 'Unknown'} ({project.user?.role || 'User'})</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-semibold mr-2">Created:</span>
          <span>{formatDate(project.createdAt)}</span>
        </div>
        {project.joinRequests && project.joinRequests.length > 0 && isOwner && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-semibold mr-2">Join Requests:</span>
            <span className="text-primary">{project.joinRequests.filter(r => r.status === 'pending').length} pending</span>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Tech Stack:</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack && project.techStack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      {project.status === 'Open' && !isOwner && (
        <button 
          onClick={handleRequestToJoin}
          disabled={requesting || hasRequested}
          className={`w-full px-4 py-2 rounded-lg transition font-medium ${
            hasRequested 
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-blue-700'
          }`}
        >
          {requesting ? 'Sending Request...' : hasRequested ? '✓ Request Sent' : 'Request to Join'}
        </button>
      )}

      {isOwner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <span className="font-semibold">Your Project</span>
          {project.joinRequests && project.joinRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="ml-2">• {project.joinRequests.filter(r => r.status === 'pending').length} new request(s)</span>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectCard;

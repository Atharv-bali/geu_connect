import React, { useState, useEffect } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { postAPI, authAPI } from '../services/api';

function Profile() {
  const { user, setUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setCurrentUser(response.data);
      // Update localStorage with fresh user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...storedUser, skills: response.data.skills };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Error fetching user data:', err);
      // Fallback to stored user
      setCurrentUser(user);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getFeed();
      const filteredPosts = response.data.filter(post => post.user?._id === user?.id);
      setUserPosts(filteredPosts);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileHeader user={currentUser} />

      {/* Skills Section */}
      {currentUser?.skills && currentUser.skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {currentUser.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            💡 Skills are automatically added from your projects
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Posts</h2>
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts yet. Share your first update!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

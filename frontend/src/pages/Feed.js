import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getFeed();
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (newPostContent.trim()) {
      try {
        setPosting(true);
        const response = await postAPI.createPost({ content: newPostContent });
        setPosts([response.data, ...posts]);
        setNewPostContent('');
        setError('');
      } catch (err) {
        setError('Failed to create post. Please try again.');
        console.error('Error creating post:', err);
      } finally {
        setPosting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Activity Feed</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your academic update..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="3"
              disabled={posting}
            />
            <div className="flex items-center justify-between mt-3">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Add Image</span>
              </button>
              <button
                onClick={handleCreatePost}
                disabled={posting || !newPostContent.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;

import React, { useState } from 'react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function PostCard({ post }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes?.some(like => like.user === user?.id) || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    try {
      await postAPI.toggleLike(post._id);
      if (liked) {
        setLikeCount(likeCount - 1);
      } else {
        setLikeCount(likeCount + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await postAPI.addComment(post._id, { text: newComment });
        console.log('Comment response:', response);
        setComments(response.data);
        setNewComment('');
      } catch (err) {
        console.error('Error adding comment:', err);
        console.error('Error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        alert('Failed to post comment: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const userName = post.user?.fullName || 'Unknown User';
  const userRole = post.user?.role || 'Student';
  const userAvatar = `https://ui-avatars.com/api/?name=${userName}&background=1e40af&color=fff`;
  const timestamp = formatTimestamp(post.createdAt);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition">
      <div className="flex items-start space-x-4">
        <img
          src={userAvatar}
          alt={userName}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{userName}</h3>
              <p className="text-sm text-gray-500">{userRole} • {timestamp}</p>
            </div>
          </div>
          
          <p className="mt-3 text-gray-700 leading-relaxed">{post.content}</p>
          
          {/* Display multiple images if available */}
          {post.images && post.images.length > 0 && (
            <div className={`mt-4 grid gap-2 ${
              post.images.length === 1 ? 'grid-cols-1' :
              post.images.length === 2 ? 'grid-cols-2' :
              post.images.length === 3 ? 'grid-cols-2' :
              'grid-cols-2'
            }`}>
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post content ${index + 1}`}
                  className={`rounded-lg w-full object-cover ${
                    post.images.length === 1 ? 'max-h-96' :
                    post.images.length === 3 && index === 0 ? 'col-span-2 max-h-64' :
                    'max-h-48'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Fallback to single imageURL for backward compatibility */}
          {(!post.images || post.images.length === 0) && post.imageURL && (
            <img
              src={post.imageURL}
              alt="Post content"
              className="mt-4 rounded-lg w-full object-cover max-h-96"
            />
          )}
          
          <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition ${
                liked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span className="font-medium">{likeCount}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">{comments.length}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="font-medium">Share</span>
            </button>
          </div>
          
          {showComments && (
            <div className="mt-4 space-y-4">
              {comments.map((comment, index) => {
                const commentUser = comment.user?.fullName || 'Unknown';
                const commentAvatar = `https://ui-avatars.com/api/?name=${commentUser}&background=1e40af&color=fff`;
                const commentTime = formatTimestamp(comment.date);
                
                return (
                  <div key={comment._id || index} className="flex space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={commentAvatar}
                      alt={commentUser}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{commentUser}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          comment.user?.role === 'Professor' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {comment.user?.role || 'User'}
                        </span>
                        <span className="text-xs text-gray-500">{commentTime}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;

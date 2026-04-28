import React, { useState, useEffect } from 'react';
import { forumAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Forum() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedThread, setExpandedThread] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const response = await forumAPI.getAllThreads();
      setThreads(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load forum threads');
      console.error('Error fetching threads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const questionData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      const response = await forumAPI.askQuestion(questionData);
      setThreads([response.data.question, ...threads]);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', tags: '' });
      setError('');
    } catch (err) {
      setError('Failed to post question');
      console.error('Error posting question:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleSubmitAnswer = async (threadId) => {
    if (!answerText.trim()) return;
    
    try {
      setSubmittingAnswer(true);
      await forumAPI.answerQuestion(threadId, { text: answerText });
      // Refresh threads to show new answer
      await fetchThreads();
      setAnswerText('');
      setError('');
    } catch (err) {
      setError('Failed to post answer');
      console.error('Error posting answer:', err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const toggleThread = (threadId) => {
    setExpandedThread(expandedThread === threadId ? null : threadId);
    setAnswerText('');
  };

  const formatDate = (timestamp) => {
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading forum threads...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
          <p className="text-gray-600 mt-2">Engage in academic discussions with your community</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + Ask Question
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {threads.length > 0 ? (
        <div className="space-y-4">
          {threads.map((thread) => (
            <div key={thread._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{thread.title}</h3>
                <p className="text-gray-700 mb-4">{thread.description}</p>
                
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-medium">{thread.user?.fullName || 'Unknown'}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      thread.user?.role === 'Professor' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {thread.user?.role || 'User'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(thread.createdAt)}</span>
                  </div>
                  
                  <button 
                    onClick={() => toggleThread(thread._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">
                      {thread.answers?.length || 0} {thread.answers?.length === 1 ? 'Answer' : 'Answers'}
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${expandedThread === thread._id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Answers Section */}
              {expandedThread === thread._id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {thread.answers?.length || 0} {thread.answers?.length === 1 ? 'Answer' : 'Answers'}
                  </h4>
                  
                  {/* Existing Answers */}
                  {thread.answers && thread.answers.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {thread.answers.map((answer, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                              {answer.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold text-gray-900">
                                  {answer.user?.fullName || 'Unknown User'}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  answer.user?.role === 'Professor' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {answer.user?.role || 'User'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(answer.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-700">{answer.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mb-6">No answers yet. Be the first to answer!</p>
                  )}

                  {/* Answer Form */}
                  <div className="bg-white rounded-lg p-4 border-2 border-primary">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows="4"
                      disabled={submittingAnswer}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleSubmitAnswer(thread._id)}
                        disabled={submittingAnswer || !answerText.trim()}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingAnswer ? 'Posting...' : 'Post Answer'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Questions Yet</h3>
          <p className="text-gray-600 mb-6">Be the first to ask a question and start a discussion!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Ask Your First Question
          </button>
        </div>
      )}

      {/* Create Question Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ask a Question</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAskQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Question Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="What's your question?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={creating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide more details about your question..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="6"
                    required
                    disabled={creating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="javascript, react, database"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={creating}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={creating}
                  >
                    {creating ? 'Posting...' : 'Post Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Forum;

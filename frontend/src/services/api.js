import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Post endpoints
export const postAPI = {
  createPost: (postData) => api.post('/posts', postData),
  getFeed: () => api.get('/posts'),
  toggleLike: (postId) => api.put(`/posts/like/${postId}`),
  addComment: (postId, commentData) => api.post(`/posts/${postId}/comment`, commentData),
};

// Project endpoints
export const projectAPI = {
  getAllProjects: () => api.get('/projects'),
  getMyProjects: () => api.get('/projects/my'),
  createProject: (projectData) => api.post('/projects', projectData),
  requestToJoin: (projectId, message) => api.post(`/projects/${projectId}/join`, { message }),
};

// Forum endpoints
export const forumAPI = {
  getAllThreads: () => api.get('/forums'),
  askQuestion: (questionData) => api.post('/forums/ask', questionData),
  answerQuestion: (questionId, answerData) => api.post(`/forums/answers/${questionId}`, answerData),
};

// Interview endpoints
export const interviewAPI = {
  getUserInterviews: () => api.get('/interviews'),
  scheduleInterview: (interviewData) => api.post('/interviews', interviewData),
};

export default api;

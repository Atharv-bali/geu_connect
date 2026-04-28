import React, { useState, useEffect } from 'react';
import { interviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Interviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [formData, setFormData] = useState({
    interviewerId: '',
    title: '',
    type: 'Technical Interview',
    date: '',
    time: '',
    meetingLink: ''
  });
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getUserInterviews();
      setInterviews(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load interviews');
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      setScheduling(true);
      const response = await interviewAPI.scheduleInterview(formData);
      setInterviews([response.data, ...interviews]);
      setShowScheduleModal(false);
      setFormData({
        interviewerId: '',
        title: '',
        type: 'Technical Interview',
        date: '',
        time: '',
        meetingLink: ''
      });
      setError('');
    } catch (err) {
      setError('Failed to schedule interview');
      console.error('Error scheduling interview:', err);
    } finally {
      setScheduling(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  const upcomingInterviews = interviews.filter(i => isUpcoming(i.date) && i.status === 'Scheduled');
  const pastInterviews = interviews.filter(i => !isUpcoming(i.date) || i.status === 'Completed');

  const InterviewCard = ({ interview }) => {
    const upcoming = isUpcoming(interview.date) && interview.status === 'Scheduled';
    const isStudent = interview.student?._id === user?.id;
    const otherPerson = isStudent ? interview.interviewer : interview.student;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{interview.title}</h3>
            <p className="text-gray-600 mt-1">{interview.type}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            upcoming
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {upcoming ? 'Upcoming' : interview.status}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm">
              <span className="font-semibold">{isStudent ? 'Interviewer' : 'Student'}:</span> {otherPerson?.fullName || 'Unknown'} ({otherPerson?.role || 'User'})
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">
              <span className="font-semibold">Date:</span> {formatDate(interview.date)}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">
              <span className="font-semibold">Time:</span> {interview.time}
            </span>
          </div>
        </div>

        {upcoming && interview.meetingLink && (
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-2 bg-primary text-white text-center rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Join Meeting
          </a>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading interviews...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600 mt-2">Manage your academic interviews and meetings</p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + Schedule Interview
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Upcoming Interviews */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Interviews</h2>
        {upcomingInterviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingInterviews.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Interviews</h3>
            <p className="text-gray-600 mb-6">Schedule an interview to get started!</p>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Schedule Interview
            </button>
          </div>
        )}
      </div>

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Interviews</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pastInterviews.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Schedule Interview</h2>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interviewer ID * (User ID from database)
                  </label>
                  <input
                    type="text"
                    value={formData.interviewerId}
                    onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
                    placeholder="Enter interviewer's user ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={scheduling}
                  />
                  <p className="text-xs text-gray-500 mt-1">Note: In production, this would be a user search/select</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interview Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Research Assistant Position"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={scheduling}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={scheduling}
                  >
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="Research Discussion">Research Discussion</option>
                    <option value="Project Review">Project Review</option>
                    <option value="Academic Counseling">Academic Counseling</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      disabled={scheduling}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      disabled={scheduling}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meeting Link *
                  </label>
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={scheduling}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    disabled={scheduling}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={scheduling}
                  >
                    {scheduling ? 'Scheduling...' : 'Schedule Interview'}
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

export default Interviews;

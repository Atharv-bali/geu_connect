import React from 'react';

function ProfileHeader({ user }) {
  const userAvatar = `https://ui-avatars.com/api/?name=${user?.fullName}&background=1e40af&color=fff&size=128`;
  const reputationPoints = user?.reputationPoints || 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start space-x-6">
        <img
          src={userAvatar}
          alt={user?.fullName}
          className="w-24 h-24 rounded-full border-4 border-primary"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-gray-600">{user?.role}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            <div>
              <span className="font-semibold text-primary">{reputationPoints}</span>
              <span className="text-gray-600"> Reputation Points</span>
            </div>
            <div className="text-gray-400">•</div>
            <div>
              <span className="font-semibold text-primary">{user?.activeProjects?.length || 0}</span>
              <span className="text-gray-600"> Active Projects</span>
            </div>
          </div>
          
          {user?.skills && user.skills.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;

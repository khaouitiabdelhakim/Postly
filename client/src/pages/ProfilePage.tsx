import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Calendar, Mail, User } from 'lucide-react';
import { format } from 'date-fns';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM do, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="card p-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold text-3xl">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">Member since {formatDate(user.creationDate)}</p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              {/* Birthday */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Birthday</p>
                  <p className="text-gray-900">{formatDate(user.birthday)}</p>
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">0</p>
                  <p className="text-sm text-gray-600">Posts Created</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-600">Images Uploaded</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.floor((new Date().getTime() - new Date(user.creationDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-gray-600">Days Since Joining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

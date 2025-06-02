import { useState, useEffect } from 'react';
import { CpuIcon, ServerIcon, ClockIcon, UsersIcon, TrendingUpIcon, AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ResourceUsageChart from './components/ResourceUsageChart';
import ResourceStatusCard from './components/ResourceStatusCard';
import RecentRequestsTable from './components/RecentRequestsTable';

// Mock data
const mockUserGPUs = [
  { id: '1', name: 'NVIDIA RTX 4090', memory: '24GB', status: 'active', expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
  { id: '2', name: 'NVIDIA A100', memory: '80GB', status: 'active', expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
];

const mockRequests = [
  { id: '101', gpuType: 'NVIDIA RTX 4090', requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'approved', duration: '7 days' },
  { id: '102', gpuType: 'NVIDIA A100', requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'approved', duration: '14 days' },
  { id: '103', gpuType: 'NVIDIA T4', requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'pending', duration: '30 days' },
];

const mockGpuAvailability = {
  total: 48,
  inUse: 32,
  available: 16,
  models: [
    { name: 'NVIDIA RTX 4090', total: 16, available: 5 },
    { name: 'NVIDIA A100', total: 8, available: 3 },
    { name: 'NVIDIA V100', total: 16, available: 6 },
    { name: 'NVIDIA T4', total: 8, available: 2 },
  ],
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [userGPUs, setUserGPUs] = useState(mockUserGPUs);
  const [recentRequests, setRecentRequests] = useState(mockRequests);
  const [gpuAvailability, setGpuAvailability] = useState(mockGpuAvailability);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/request"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Request new resources
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            <CpuIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active GPUs</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{userGPUs.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
            <ServerIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available GPUs</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{gpuAvailability.available}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
            <TrendingUpIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Usage Rate</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {Math.round((gpuAvailability.inUse / gpuAvailability.total) * 100)}%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
            <ClockIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {recentRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {userGPUs.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Your Active Resources</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userGPUs.map((gpu) => (
                <ResourceStatusCard key={gpu.id} resource={gpu} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircleIcon size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Active Resources</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any active GPU resources at the moment.</p>
          <Link
            to="/request"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Request Resources
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Resource Usage</h2>
          </div>
          <div className="p-6">
            <ResourceUsageChart />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Requests</h2>
            <Link
              to="/history"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <RecentRequestsTable requests={recentRequests} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">GPU Availability</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gpuAvailability.models.map((model, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{model.name}</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Available:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{model.available}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{model.total}</span>
                </div>
                <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${(model.available / model.total) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-right text-gray-500 dark:text-gray-400">
                  {Math.round((model.available / model.total) * 100)}% available
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
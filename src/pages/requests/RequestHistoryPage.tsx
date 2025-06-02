import { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  CpuIcon, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  AlertCircle,
  DownloadIcon 
} from 'lucide-react';

// Mock data for request history
const mockRequests = [
  {
    id: '101',
    gpuType: 'NVIDIA RTX 4090',
    quantity: 1,
    requestedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    status: 'completed',
    projectName: 'Computer Vision Research',
    researchField: 'Computer Vision',
  },
  {
    id: '102',
    gpuType: 'NVIDIA A100',
    quantity: 2,
    requestedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'active',
    projectName: 'NLP Model Training',
    researchField: 'Natural Language Processing',
  },
  {
    id: '103',
    gpuType: 'NVIDIA T4',
    quantity: 1,
    requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    startDate: null,
    endDate: null,
    status: 'pending',
    projectName: 'Reinforcement Learning Experiment',
    researchField: 'Reinforcement Learning',
  },
  {
    id: '104',
    gpuType: 'NVIDIA V100',
    quantity: 1,
    requestedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    startDate: null,
    endDate: null,
    status: 'rejected',
    projectName: 'Data Analysis Pipeline',
    researchField: 'Data Analysis',
    rejectionReason: 'Insufficient resources available for requested time period.'
  },
  {
    id: '105',
    gpuType: 'AMD MI250X',
    quantity: 1,
    requestedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    startDate: null,
    endDate: null,
    status: 'cancelled',
    projectName: 'Scientific Simulation',
    researchField: 'Scientific Simulation',
  },
  {
    id: '106',
    gpuType: 'NVIDIA RTX 4090',
    quantity: 2,
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    startDate: null,
    endDate: null,
    status: 'pending',
    projectName: 'Image Generation Model',
    researchField: 'Generative AI',
  },
];

const RequestHistoryPage = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [filteredRequests, setFilteredRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    timeFrame: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // Simulate API loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter requests based on search term and filters
  useEffect(() => {
    let filtered = requests;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        request => 
          request.gpuType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.id.includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(request => request.status === filters.status);
    }

    // Apply time frame filter
    if (filters.timeFrame !== 'all') {
      const now = new Date();
      if (filters.timeFrame === 'last7days') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(request => request.requestedAt >= sevenDaysAgo);
      } else if (filters.timeFrame === 'last30days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(request => request.requestedAt >= thirtyDaysAgo);
      } else if (filters.timeFrame === 'last90days') {
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(request => request.requestedAt >= ninetyDaysAgo);
      }
    }

    setFilteredRequests(filtered);
  }, [searchTerm, filters, requests]);

  const handleCancelRequest = (id: string) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, status: 'cancelled' } : request
      )
    );
  };

  const handleRequestSelection = (id: string) => {
    setSelectedRequest(selectedRequest === id ? null : id);
  };

  // Function to get status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'cancelled':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

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
        <h1 className="text-2xl font-bold">Request History</h1>
        <a
          href="#"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export History
        </a>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
        
        {showFilters && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="timeFrame" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Frame
              </label>
              <select
                id="timeFrame"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={filters.timeFrame}
                onChange={(e) => setFilters({ ...filters, timeFrame: e.target.value })}
              >
                <option value="all">All Time</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID & Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resources
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <React.Fragment key={request.id}>
                    <tr
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                        selectedRequest === request.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                      }`}
                      onClick={() => handleRequestSelection(request.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          #{request.id}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {request.requestedAt.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {request.projectName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {request.researchField}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                          <CpuIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-1" />
                          {request.gpuType}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Quantity: {request.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                            request.status
                          )}`}
                        >
                          {request.status === 'active' && <Clock className="h-3 w-3 mr-1" />}
                          {request.status === 'completed' && <Check className="h-3 w-3 mr-1" />}
                          {request.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                          {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        
                        {request.status === 'active' && request.endDate && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Expires: {request.endDate.toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {request.status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelRequest(request.id);
                            }}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            Cancel
                          </button>
                        )}
                        {request.status === 'active' && (
                          <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                            Extend
                          </button>
                        )}
                      </td>
                    </tr>
                    {selectedRequest === request.id && (
                      <tr className="bg-indigo-50 dark:bg-indigo-900/10">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            <h3 className="font-medium mb-2">Request Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Request Date</p>
                                <p>{request.requestedAt.toLocaleDateString()}</p>
                              </div>
                              
                              {request.startDate && (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</p>
                                  <p>{request.startDate.toLocaleDateString()}</p>
                                </div>
                              )}
                              
                              {request.endDate && (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</p>
                                  <p>{request.endDate.toLocaleDateString()}</p>
                                </div>
                              )}
                            </div>
                            
                            {request.status === 'rejected' && request.rejectionReason && (
                              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                <div className="flex items-start">
                                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-red-800 dark:text-red-300">Rejection Reason</p>
                                    <p className="text-sm text-red-700 dark:text-red-400">{request.rejectionReason}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex space-x-3 mt-4">
                              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                View Details
                              </button>
                              
                              {(request.status === 'completed' || request.status === 'active') && (
                                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                  <DownloadIcon className="h-3 w-3 mr-1" />
                                  Download Usage Report
                                </button>
                              )}
                              
                              {request.status === 'completed' && (
                                <button className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                  Request Similar Resources
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No requests found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestHistoryPage;
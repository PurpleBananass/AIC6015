import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, CpuIcon, Server, SlidersHorizontal } from 'lucide-react';

// Mock data for GPU resources
const mockGpuResources = [
  {
    id: '1',
    name: 'NVIDIA RTX 4090',
    memory: '24GB',
    cores: 16384,
    clockSpeed: '2.52 GHz',
    powerDraw: '450W',
    available: 5,
    total: 16,
    location: 'Rack A1',
  },
  {
    id: '2',
    name: 'NVIDIA A100',
    memory: '80GB',
    cores: 6912,
    clockSpeed: '1.41 GHz',
    powerDraw: '400W',
    available: 3,
    total: 8,
    location: 'Rack B2',
  },
  {
    id: '3',
    name: 'NVIDIA V100',
    memory: '32GB',
    cores: 5120,
    clockSpeed: '1.53 GHz',
    powerDraw: '300W',
    available: 6,
    total: 16,
    location: 'Rack C1',
  },
  {
    id: '4',
    name: 'NVIDIA T4',
    memory: '16GB',
    cores: 2560,
    clockSpeed: '1.59 GHz',
    powerDraw: '70W',
    available: 2,
    total: 8,
    location: 'Rack D3',
  },
  {
    id: '5',
    name: 'AMD Radeon Pro VII',
    memory: '16GB',
    cores: 3840,
    clockSpeed: '1.7 GHz',
    powerDraw: '250W',
    available: 4,
    total: 8,
    location: 'Rack A2',
  },
  {
    id: '6',
    name: 'AMD MI250X',
    memory: '128GB',
    cores: 14080,
    clockSpeed: '1.7 GHz',
    powerDraw: '560W',
    available: 1,
    total: 4,
    location: 'Rack B3',
  }
];

const GpuResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    manufacturer: 'all',
    minMemory: 0,
    showOnlyAvailable: false,
  });
  const [resources, setResources] = useState(mockGpuResources);
  const [filteredResources, setFilteredResources] = useState(mockGpuResources);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Simulate API loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter resources based on search term and filters
  useEffect(() => {
    let filtered = resources;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        resource => resource.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply manufacturer filter
    if (filters.manufacturer !== 'all') {
      filtered = filtered.filter(
        resource => resource.name.toLowerCase().includes(filters.manufacturer.toLowerCase())
      );
    }

    // Apply memory filter
    if (filters.minMemory > 0) {
      filtered = filtered.filter(
        resource => parseInt(resource.memory) >= filters.minMemory
      );
    }

    // Apply availability filter
    if (filters.showOnlyAvailable) {
      filtered = filtered.filter(resource => resource.available > 0);
    }

    setFilteredResources(filtered);
  }, [searchTerm, filters, resources]);

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
        <h1 className="text-2xl font-bold">GPU Resources</h1>
        <Link
          to="/request"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Request resources
        </Link>
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
              placeholder="Search GPU resources..."
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
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manufacturer
              </label>
              <select
                id="manufacturer"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={filters.manufacturer}
                onChange={(e) => setFilters({ ...filters, manufacturer: e.target.value })}
              >
                <option value="all">All Manufacturers</option>
                <option value="nvidia">NVIDIA</option>
                <option value="amd">AMD</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="memory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Memory
              </label>
              <select
                id="memory"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={filters.minMemory}
                onChange={(e) => setFilters({ ...filters, minMemory: parseInt(e.target.value) })}
              >
                <option value="0">Any Memory</option>
                <option value="16">16GB+</option>
                <option value="24">24GB+</option>
                <option value="32">32GB+</option>
                <option value="80">80GB+</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="available"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                checked={filters.showOnlyAvailable}
                onChange={(e) => setFilters({ ...filters, showOnlyAvailable: e.target.checked })}
              />
              <label htmlFor="available" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Show only available resources
              </label>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  GPU Model
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Memory
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cores
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Clock Speed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Power
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Availability
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CpuIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                        <div className="font-medium text-gray-900 dark:text-gray-100">{resource.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {resource.memory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {resource.cores.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {resource.clockSpeed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {resource.powerDraw}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {resource.available} / {resource.total} available
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-1">
                        <div
                          className={`h-full rounded-full ${
                            resource.available === 0
                              ? 'bg-red-500'
                              : resource.available < resource.total / 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(resource.available / resource.total) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-1" />
                        {resource.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/request?gpu=${resource.id}`}
                        className={`text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 ${
                          resource.available === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={(e) => {
                          if (resource.available === 0) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {resource.available > 0 ? 'Request' : 'Unavailable'}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No resources found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <SlidersHorizontal className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Comparison Chart
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Feature
                </th>
                {filteredResources.slice(0, 4).map((resource) => (
                  <th key={resource.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {resource.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Memory
                </td>
                {filteredResources.slice(0, 4).map((resource) => (
                  <td key={`${resource.id}-memory`} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {resource.memory}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  CUDA Cores
                </td>
                {filteredResources.slice(0, 4).map((resource) => (
                  <td key={`${resource.id}-cores`} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {resource.cores.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Clock Speed
                </td>
                {filteredResources.slice(0, 4).map((resource) => (
                  <td key={`${resource.id}-clock`} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {resource.clockSpeed}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Power Draw
                </td>
                {filteredResources.slice(0, 4).map((resource) => (
                  <td key={`${resource.id}-power`} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {resource.powerDraw}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Availability
                </td>
                {filteredResources.slice(0, 4).map((resource) => (
                  <td key={`${resource.id}-avail`} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {resource.available} / {resource.total}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GpuResourcesPage;
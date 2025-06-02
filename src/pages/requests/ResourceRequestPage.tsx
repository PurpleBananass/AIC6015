import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, Info, Check, HelpCircle, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for GPU models
const mockGpuModels = [
  { id: '1', name: 'NVIDIA RTX 4090', memory: '24GB' },
  { id: '2', name: 'NVIDIA A100', memory: '80GB' },
  { id: '3', name: 'NVIDIA V100', memory: '32GB' },
  { id: '4', name: 'NVIDIA T4', memory: '16GB' },
  { id: '5', name: 'AMD Radeon Pro VII', memory: '16GB' },
  { id: '6', name: 'AMD MI250X', memory: '128GB' },
];

// Mock data for research fields
const researchFields = [
  'Computer Vision',
  'Natural Language Processing',
  'Reinforcement Learning',
  'Generative AI',
  'Computational Biology',
  'Scientific Simulation',
  'Data Analysis',
  'Other',
];

const ResourceRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedGpuId = queryParams.get('gpu');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    gpuModel: preselectedGpuId || '',
    quantity: 1,
    duration: 7,
    researchField: '',
    projectName: '',
    projectDescription: '',
    agreeToTerms: false,
  });

  // Simulate API loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else if (name === 'quantity' || name === 'duration') {
      const numValue = parseInt(value);
      setFormData({ ...formData, [name]: isNaN(numValue) ? '' : numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.gpuModel) {
      toast.error('Please select a GPU model');
      return;
    }
    
    if (!formData.researchField) {
      toast.error('Please select a research field');
      return;
    }
    
    if (!formData.projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    
    if (!formData.projectDescription.trim()) {
      toast.error('Please provide a project description');
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Resource request submitted successfully!');
      navigate('/history');
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedGpu = mockGpuModels.find(gpu => gpu.id === formData.gpuModel);

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
        <h1 className="text-2xl font-bold">Request GPU Resources</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Resource Request Form
            </h2>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="gpuModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GPU Model <span className="text-red-500">*</span>
                </label>
                <select
                  id="gpuModel"
                  name="gpuModel"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.gpuModel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select GPU Model</option>
                  {mockGpuModels.map((gpu) => (
                    <option key={gpu.id} value={gpu.id}>
                      {gpu.name} ({gpu.memory})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    min="1"
                    max="4"
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Maximum 4 GPUs per request
                </p>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (days) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    min="1"
                    max="30"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Maximum 30 days per request
                </p>
              </div>
              
              <div>
                <label htmlFor="researchField" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Research Field <span className="text-red-500">*</span>
                </label>
                <select
                  id="researchField"
                  name="researchField"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.researchField}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Research Field</option>
                  {researchFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="projectName"
                  id="projectName"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Deep Learning for Medical Imaging"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  rows={5}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Describe your project and why you need these GPU resources..."
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Provide details about your project goals, computational requirements, and expected outcomes
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="font-medium text-gray-700 dark:text-gray-300">
                    I agree to the <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">terms and conditions</a> <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    By submitting this request, you agree to use the resources responsibly and comply with the usage policies.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {selectedGpu && (
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    Request Summary
                  </h3>
                  <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
                    You're requesting {formData.quantity} {selectedGpu.name} ({selectedGpu.memory}) GPU
                    {formData.quantity > 1 ? 's' : ''} for {formData.duration} day
                    {formData.duration > 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">How long does approval typically take?</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Most requests are reviewed and processed within 24-48 hours during business days. 
              Urgent requests can be marked as such and may be expedited.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Can I extend my resource allocation time?</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yes, you can request an extension before your allocation expires. Extensions are granted based on resource availability and project needs.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">What happens if I don't use all my allocated time?</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Unused resources can be released back to the pool for others to use. This helps maintain efficient resource utilization across all projects.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Are there usage limits or quotas?</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yes, depending on your role and department, there may be monthly or yearly quota limitations. 
              Check with your administrator for specific details about your allocation limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceRequestPage;
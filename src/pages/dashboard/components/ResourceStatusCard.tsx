import { Cpu, Clock, AlertTriangle } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  memory: string;
  status: 'active' | 'pending' | 'expired';
  expiresAt: Date;
}

interface ResourceStatusCardProps {
  resource: Resource;
}

const ResourceStatusCard = ({ resource }: ResourceStatusCardProps) => {
  // Calculate days remaining
  const now = new Date();
  const daysRemaining = Math.ceil((resource.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine warning level based on days remaining
  let warningLevel = 'normal';
  if (daysRemaining <= 1) {
    warningLevel = 'critical';
  } else if (daysRemaining <= 3) {
    warningLevel = 'warning';
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Cpu className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{resource.name}</h3>
        </div>
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium
          ${resource.status === 'active' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
            : resource.status === 'pending'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
          }`}
        >
          {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Memory:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{resource.memory}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Expires:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {resource.expiresAt.toLocaleDateString()}
          </span>
        </div>
        
        <div className={`flex items-center justify-between text-sm mt-3 p-2 rounded-md
          ${warningLevel === 'critical'
            ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            : warningLevel === 'warning'
              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
              : 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300'
          }`}
        >
          {warningLevel !== 'normal' && (
            <AlertTriangle size={16} className="mr-1" />
          )}
          <Clock size={16} className="mr-1" />
          <span>
            {daysRemaining <= 0 
              ? 'Expires today!' 
              : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`}
          </span>
        </div>
      </div>
      
      <div className="mt-5 flex space-x-2">
        <button className="flex-1 text-xs px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
          Extend Time
        </button>
        <button className="flex-1 text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-600/30 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
};

export default ResourceStatusCard;
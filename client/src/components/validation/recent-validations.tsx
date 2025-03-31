import { useQuery } from "@tanstack/react-query";
import { Validation } from "@/types";

interface RecentValidationsProps {
  projectId?: number;
}

const RecentValidations: React.FC<RecentValidationsProps> = ({ projectId = 1 }) => {
  const { data: validations = [] } = useQuery<Validation[]>({
    queryKey: [`/api/projects/${projectId}/validations`],
  });

  // Format date to relative time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minutes ago`;
      }
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffInDays / 30)} months ago`;
    }
  };

  // If there are no validations, or all validations are in-progress, display placeholder
  if (validations.length === 0 || !validations.some(v => v.status === 'complete')) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="border-b border-neutral-200 px-6 py-4">
          <h3 className="font-medium">Recent Validations</h3>
        </div>
        <div className="p-6 text-center text-neutral-600">
          <p>No completed validations yet.</p>
          <p className="text-sm mt-2">Start a new validation to see results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className="border-b border-neutral-200 px-6 py-4">
        <h3 className="font-medium">Recent Validations</h3>
      </div>
      
      <div className="divide-y divide-neutral-200">
        {validations
          .filter(validation => validation.status === 'complete')
          .slice(0, 3)
          .map(validation => (
            <div key={validation.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">Project Validation #{validation.id}</h4>
                  <p className="text-neutral-600 text-sm mt-1">
                    Last updated: {formatTimeAgo(validation.completedAt || validation.startedAt)}
                  </p>
                  
                  <div className="flex items-center mt-3">
                    <div className="bg-neutral-100 rounded-full h-1 w-32 mr-3">
                      <div 
                        className="bg-green-600 h-1 rounded-full" 
                        style={{ width: `${validation.complianceScore || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {validation.complianceScore || 0}% Compliance
                    </span>
                  </div>
                </div>
                
                <div>
                  <button className="text-primary hover:text-primary/90 font-medium">
                    View Report
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentValidations;

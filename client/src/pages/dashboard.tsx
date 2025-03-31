import { useState } from "react";
import { Button } from "@/components/ui/button";
import ValidationWorkflow from "@/components/validation/validation-workflow";
import RecentValidations from "@/components/validation/recent-validations";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [showValidationWorkflow, setShowValidationWorkflow] = useState(false);

  const handleStartNewValidation = () => {
    setShowValidationWorkflow(true);
  };

  const handleValidationComplete = () => {
    setShowValidationWorkflow(false);
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">SRS & Figma Validation</h1>
            <p className="text-neutral-600 mt-1">
              Compare your SRS documents with Figma designs to identify inconsistencies
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="flex items-center" 
              onClick={handleStartNewValidation}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>New Validation</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Validation Workflow */}
      {showValidationWorkflow && (
        <ValidationWorkflow 
          projectId={1} 
          onComplete={handleValidationComplete} 
        />
      )}

      {/* Recent Validations */}
      <RecentValidations projectId={1} />
    </>
  );
};

export default Dashboard;

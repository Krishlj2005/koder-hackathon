import { useState } from "react";
import DocumentUploadStep from "./document-upload-step";
import FigmaConnectionStep from "./figma-connection-step";
import CompareValidateStep from "./compare-validate-step";
import TestCasesStep from "./test-cases-step";
import { useToast } from "@/hooks/use-toast";

interface ValidationWorkflowProps {
  projectId?: number;
  onComplete?: () => void;
}

const ValidationWorkflow: React.FC<ValidationWorkflowProps> = ({ 
  projectId = 1,  // Default to project ID 1 for demo
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationId, setValidationId] = useState<number | null>(null);
  const { toast } = useToast();

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleContinueToFigma = () => {
    goToStep(2);
  };

  const handleBackToUpload = () => {
    goToStep(1);
  };

  const handleContinueToCompare = () => {
    goToStep(3);
  };

  const handleBackToFigma = () => {
    goToStep(2);
  };

  const handleContinueToTestCases = (id: number) => {
    setValidationId(id);
    goToStep(4);
  };

  const handleBackToCompare = () => {
    goToStep(3);
  };

  const handleFinishValidation = () => {
    toast({
      title: "Validation complete",
      description: "Your validation has been completed successfully.",
    });
    if (onComplete) {
      onComplete();
    }
    // Reset steps for a new validation
    setCurrentStep(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden mb-8">
      <div className="border-b border-neutral-200">
        <div className="flex">
          <StepIndicator 
            number={1} 
            title="Upload Documents" 
            isActive={currentStep === 1} 
            isComplete={currentStep > 1} 
          />
          <StepIndicator 
            number={2} 
            title="Connect Figma" 
            isActive={currentStep === 2} 
            isComplete={currentStep > 2} 
          />
          <StepIndicator 
            number={3} 
            title="Compare & Validate" 
            isActive={currentStep === 3} 
            isComplete={currentStep > 3} 
          />
          <StepIndicator 
            number={4} 
            title="Test Cases" 
            isActive={currentStep === 4} 
            isComplete={currentStep > 4} 
          />
        </div>
      </div>
      
      <div className="p-6">
        {currentStep === 1 && (
          <DocumentUploadStep 
            projectId={projectId} 
            onContinue={handleContinueToFigma} 
          />
        )}
        
        {currentStep === 2 && (
          <FigmaConnectionStep 
            projectId={projectId} 
            onContinue={handleContinueToCompare} 
            onBack={handleBackToUpload} 
          />
        )}
        
        {currentStep === 3 && (
          <CompareValidateStep 
            projectId={projectId} 
            onContinue={handleContinueToTestCases} 
            onBack={handleBackToFigma} 
          />
        )}
        
        {currentStep === 4 && validationId && (
          <TestCasesStep 
            validationId={validationId} 
            onBack={handleBackToCompare} 
            onFinish={handleFinishValidation} 
          />
        )}
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  number: number;
  title: string;
  isActive: boolean;
  isComplete: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  number, 
  title, 
  isActive, 
  isComplete 
}) => {
  let circleClassName = "w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ";
  let textClassName = "";
  
  if (isActive) {
    circleClassName += "bg-primary text-white";
    textClassName = "font-semibold border-b-2 border-primary text-primary";
  } else if (isComplete) {
    circleClassName += "bg-primary text-white";
    textClassName = "text-neutral-600";
  } else {
    circleClassName += "bg-neutral-200 text-neutral-600";
    textClassName = "text-neutral-600";
  }
  
  return (
    <div className={`flex-1 px-4 py-3 flex items-center ${textClassName}`}>
      <div className={circleClassName}>{number}</div>
      <span>{title}</span>
    </div>
  );
};

export default ValidationWorkflow;

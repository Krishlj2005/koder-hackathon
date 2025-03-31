import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Validation } from "@/types";
import { Check, CheckCircle, Info, Loader2 } from "lucide-react";

interface CompareValidateStepProps {
  projectId: number;
  onContinue: (validationId: number) => void;
  onBack: () => void;
}

const CompareValidateStep: React.FC<CompareValidateStepProps> = ({ 
  projectId, 
  onContinue, 
  onBack 
}) => {
  const [comparisonStatus, setComparisonStatus] = useState<"" | "in-progress" | "complete">("");
  const [comparisonProgress, setComparisonProgress] = useState(0);
  const [validationId, setValidationId] = useState<number | null>(null);
  const [validationResults, setValidationResults] = useState<any | null>(null);
  const { toast } = useToast();

  // Mutation for starting validation
  const startValidationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/validations`, {
        status: 'in-progress'
      });
      return response.json() as Promise<Validation>;
    },
    onSuccess: (data) => {
      setValidationId(data.id);
      setComparisonStatus("in-progress");
      simulateComparisonProgress(data.id);
    },
    onError: (error) => {
      toast({
        title: "Failed to start validation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating validation
  const updateValidationMutation = useMutation({
    mutationFn: async (data: { id: number, status: string, complianceScore?: number }) => {
      const response = await apiRequest('PATCH', `/api/validations/${data.id}`, {
        status: data.status,
        ...(data.complianceScore && { complianceScore: data.complianceScore })
      });
      return response.json() as Promise<Validation>;
    },
    onSuccess: (data) => {
      if (data.results) {
        setValidationResults(data.results);
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to update validation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mock function to simulate comparison progress
  const simulateComparisonProgress = (id: number) => {
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 3; // Random increment between 3-7%
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(intervalId);
        setComparisonProgress(progress);
        setComparisonStatus("complete");
        
        // Update validation to complete status
        updateValidationMutation.mutate({
          id,
          status: "complete"
        });
      } else {
        setComparisonProgress(progress);
      }
    }, 500);

    return () => clearInterval(intervalId);
  };

  const handleStartComparison = () => {
    startValidationMutation.mutate();
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-6">Compare & Validate</h3>
      
      {comparisonStatus === "" && (
        <div className="border border-neutral-200 rounded p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-medium">Start Comparison</h4>
              <p className="text-neutral-600 mt-1">Compare your SRS documents against Figma designs</p>
            </div>
            <Button
              onClick={handleStartComparison}
              disabled={startValidationMutation.isPending}
            >
              {startValidationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start"
              )}
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-neutral-600">
              <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
              <span>2 Documents ready for comparison</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
              <span>Figma design connected</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <Info className="mr-3 h-5 w-5 text-primary" />
              <span>Analysis may take a few minutes depending on document size</span>
            </div>
          </div>
        </div>
      )}
      
      {comparisonStatus === "in-progress" && (
        <div className="border border-neutral-200 rounded p-6 mb-6">
          <h4 className="font-medium mb-4">Comparison in Progress</h4>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Analyzing documents...</span>
              <span>{comparisonProgress}%</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${comparisonProgress}%` }}
              />
            </div>
          </div>
          
          <div className="bg-neutral-50 p-3 rounded text-sm">
            <div className="flex items-start">
              <Loader2 className="mr-3 mt-1 text-primary h-5 w-5 animate-spin" />
              <div>
                <p>Currently processing: <span className="font-medium">User flow requirements against design screens</span></p>
                <p className="text-neutral-600 mt-1">Please don't close this window</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {comparisonStatus === "complete" && (
        <div className="border border-neutral-200 rounded p-6 mb-6">
          <div className="flex items-center text-green-600 mb-6">
            <CheckCircle className="text-xl mr-3 h-6 w-6" />
            <h4 className="font-medium">Comparison Complete</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-neutral-200 rounded p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-primary">87%</div>
              <div className="text-neutral-600 text-sm">Overall Compliance</div>
            </div>
            <div className="bg-white border border-neutral-200 rounded p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-green-600">23</div>
              <div className="text-neutral-600 text-sm">Compliant Elements</div>
            </div>
            <div className="bg-white border border-neutral-200 rounded p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-red-600">4</div>
              <div className="text-neutral-600 text-sm">Inconsistencies</div>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded p-4">
            <h5 className="font-medium mb-3">Detected Inconsistencies</h5>
            <div className="space-y-3">
              <div className="bg-white border border-neutral-200 rounded p-3">
                <div className="flex justify-between">
                  <p className="font-medium">Login Form Field Validation</p>
                  <span className="text-red-600 text-sm">Missing</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">SRS specifies email validation messaging that is not present in the design</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded p-3">
                <div className="flex justify-between">
                  <p className="font-medium">Product Filter Options</p>
                  <span className="text-amber-600 text-sm">Partial</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">SRS specifies 5 filter categories, design only shows 3</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded p-3">
                <div className="flex justify-between">
                  <p className="font-medium">Checkout Process Steps</p>
                  <span className="text-red-600 text-sm">Mismatch</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">SRS specifies 4-step checkout, design shows 3-step process</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={() => validationId && onContinue(validationId)}
          disabled={comparisonStatus !== "complete" || !validationId}
        >
          Generate Test Cases
        </Button>
      </div>
    </div>
  );
};

export default CompareValidateStep;

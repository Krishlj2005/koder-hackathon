import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TestCase } from "@/types";
import { FileText, FileBarChart, FilePenLine, Filter, Download, Check } from "lucide-react";

interface TestCasesStepProps {
  validationId: number;
  onBack: () => void;
  onFinish: () => void;
}

const TestCasesStep: React.FC<TestCasesStepProps> = ({ 
  validationId, 
  onBack,
  onFinish
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Fetch test cases
  const { 
    data: testCases = [], 
    isLoading,
    refetch
  } = useQuery<TestCase[]>({
    queryKey: [`/api/validations/${validationId}/test-cases`],
  });

  // Mutation for generating test cases
  const generateTestCasesMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest(
        'POST', 
        `/api/validations/${validationId}/test-cases/generate`,
        {}
      );
      return response.json() as Promise<TestCase[]>;
    },
    onSuccess: () => {
      setIsGenerating(false);
      toast({
        title: "Test cases generated",
        description: "Test cases have been generated successfully.",
      });
      refetch();
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Failed to generate test cases",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for exporting test cases
  const exportTestCasesMutation = useMutation({
    mutationFn: async (format: string) => {
      const response = await apiRequest(
        'POST', 
        `/api/validations/${validationId}/test-cases/export`,
        { format }
      );
      return response.json();
    },
    onSuccess: (data) => {
      // In a real app, this would trigger a file download
      toast({
        title: "Export successful",
        description: `Test cases have been exported as ${data.format.toUpperCase()}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to export test cases",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate test cases automatically when the component mounts
  useEffect(() => {
    if (testCases.length === 0 && !isLoading && !isGenerating) {
      generateTestCasesMutation.mutate();
    }
  }, [isLoading]);

  const handleExport = (format: 'xlsx' | 'csv' | 'pdf') => {
    exportTestCasesMutation.mutate(format);
  };

  // Get the severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">High</span>
        );
      case 'medium':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-600">Medium</span>
        );
      case 'low':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">Low</span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{severity}</span>
        );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-6">Test Cases</h3>
      
      <div className="bg-white border border-neutral-200 rounded overflow-hidden mb-6">
        <div className="bg-neutral-100 p-4 flex justify-between items-center">
          <h4 className="font-medium">Generated Test Cases</h4>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading || isGenerating ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-neutral-600">
                  {isGenerating ? "Generating test cases..." : "Loading test cases..."}
                </p>
              </div>
            </div>
          ) : testCases.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-neutral-600 mb-4">No test cases have been generated yet.</p>
              <Button onClick={() => generateTestCasesMutation.mutate()}>
                Generate Test Cases
              </Button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Test Case</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {testCases.map((testCase) => (
                  <tr key={testCase.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{testCase.testCaseId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{testCase.name}</td>
                    <td className="px-6 py-4 text-sm">{testCase.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{testCase.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getSeverityBadge(testCase.severity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{testCase.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <div className="bg-neutral-50 border border-neutral-200 rounded p-4 mb-6">
        <h4 className="font-medium mb-3">Export Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-white border border-neutral-200 rounded p-4 hover:border-primary cursor-pointer transition-colors"
            onClick={() => handleExport('xlsx')}
          >
            <div className="flex items-center">
              <FileBarChart className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium">Excel (.xlsx)</p>
                <p className="text-sm text-neutral-600">Full data export</p>
              </div>
            </div>
          </div>
          <div 
            className="bg-white border border-neutral-200 rounded p-4 hover:border-primary cursor-pointer transition-colors"
            onClick={() => handleExport('csv')}
          >
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-primary mr-3" />
              <div>
                <p className="font-medium">CSV</p>
                <p className="text-sm text-neutral-600">Simple data format</p>
              </div>
            </div>
          </div>
          <div 
            className="bg-white border border-neutral-200 rounded p-4 hover:border-primary cursor-pointer transition-colors"
            onClick={() => handleExport('pdf')}
          >
            <div className="flex items-center">
              <FilePenLine className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <p className="font-medium">PDF Report</p>
                <p className="text-sm text-neutral-600">Formatted report</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={onFinish}
        >
          <Check className="mr-2 h-4 w-4" />
          <span>Finish</span>
        </Button>
      </div>
    </div>
  );
};

export default TestCasesStep;

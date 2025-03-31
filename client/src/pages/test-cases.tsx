import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TestCase } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { 
  FileDown, 
  RotateCcw, 
  BarChart2, 
  PieChart as PieChartIcon, 
  Filter, 
  Download, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  AlertOctagon,
  Lightbulb 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TestCases() {
  const validationId = 1; // This would typically come from route params
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [chartType, setChartType] = useState<"bar" | "pie">("pie");
  const [exportFormat, setExportFormat] = useState<string>("xlsx");

  // Fetch validation data
  const { data: validation } = useQuery({
    queryKey: [`/api/validations/${validationId}`],
  });

  // Fetch test cases
  const { 
    data: testCases = [], 
    isLoading: isLoadingTestCases,
    isError: isTestCasesError,
  } = useQuery<TestCase[]>({
    queryKey: [`/api/validations/${validationId}/test-cases`],
  });

  // Generate test cases mutation
  const generateTestCasesMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/validations/${validationId}/test-cases/generate`, {});
    },
    onSuccess: async () => {
      toast({
        title: "Test cases generated",
        description: "Test cases have been generated successfully",
      });
      await queryClient.invalidateQueries({ queryKey: [`/api/validations/${validationId}/test-cases`] });
    },
    onError: (error) => {
      toast({
        title: "Failed to generate test cases",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Export test cases mutation
  const exportTestCasesMutation = useMutation({
    mutationFn: async (format: string) => {
      return apiRequest('POST', `/api/validations/${validationId}/test-cases/export`, { format });
    },
    onSuccess: async (data: any) => {
      toast({
        title: "Export successful",
        description: `Test cases have been exported to ${exportFormat} format`,
      });
      // Handle download here if needed
      if (data && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      }
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Prepare chart data
  const severityChartData = testCases.reduce((acc, testCase) => {
    const severityItem = acc.find(item => item.name === testCase.severity);
    if (severityItem) {
      severityItem.value += 1;
    } else {
      acc.push({ name: testCase.severity, value: 1 });
    }
    return acc;
  }, [] as Array<{ name: string, value: number }>);

  const statusChartData = testCases.reduce((acc, testCase) => {
    const statusItem = acc.find(item => item.name === testCase.status);
    if (statusItem) {
      statusItem.value += 1;
    } else {
      acc.push({ name: testCase.status, value: 1 });
    }
    return acc;
  }, [] as Array<{ name: string, value: number }>);

  const typeChartData = testCases.reduce((acc, testCase) => {
    const typeItem = acc.find(item => item.name === testCase.type);
    if (typeItem) {
      typeItem.value += 1;
    } else {
      acc.push({ name: testCase.type, value: 1 });
    }
    return acc;
  }, [] as Array<{ name: string, value: number }>);

  // Define colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const handleExport = () => {
    exportTestCasesMutation.mutate(exportFormat);
  };

  const handleGenerateTestCases = () => {
    generateTestCasesMutation.mutate();
  };

  // Render functions for tabs
  const renderTestCaseItem = (testCase: TestCase) => (
    <AccordionItem key={testCase.id} value={testCase.id.toString()}>
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 text-left">
          <div className="flex items-center gap-3">
            {testCase.status === 'Passed' ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : testCase.status === 'Failed' ? (
              <X className="h-5 w-5 text-red-600" />
            ) : (
              <Clock className="h-5 w-5 text-amber-600" />
            )}
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{testCase.testCaseId}</span>
                {testCase.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-8 md:ml-0">
            <Badge variant="outline" className="rounded-full capitalize">
              {testCase.type}
            </Badge>
            <Badge className={
              testCase.severity === 'High'
                ? 'bg-red-100 text-red-800 hover:bg-red-100'
                : testCase.severity === 'Medium'
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                  : 'bg-green-100 text-green-800 hover:bg-green-100'
            }>
              {testCase.severity}
            </Badge>
            <Badge className={
              testCase.status === 'Failed'
                ? 'bg-red-100 text-red-800 hover:bg-red-100'
                : testCase.status === 'Passed'
                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
            }>
              {testCase.status}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-6 pb-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Test Description
            </h4>
            <p className="text-sm text-muted-foreground">
              {testCase.description || "No description available."}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-blue-600" />
              Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <p className="w-28 font-medium">Requirement:</p>
                <p className="text-muted-foreground">{testCase.requirement || "Not specified"}</p>
              </div>
              <div className="flex items-start">
                <p className="w-28 font-medium">Design Element:</p>
                <p className="text-muted-foreground">{testCase.designElement || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            Recommendation
          </h4>
          <p className="text-sm text-muted-foreground">
            {testCase.status === 'Failed' 
              ? `Update the Figma design to ensure ${testCase.name.toLowerCase()} matches the SRS requirements.`
              : testCase.status === 'In Progress' 
                ? `Review both SRS and Figma design to ensure ${testCase.name.toLowerCase()} is fully implemented.`
                : `Test passed. The Figma design correctly implements ${testCase.name.toLowerCase()}.`
            }
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Test Cases</h1>
          <p className="text-muted-foreground">
            Generated test cases based on SRS and Figma validation
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={testCases.length > 0 ? "outline" : "default"}
            onClick={handleGenerateTestCases} 
            disabled={generateTestCasesMutation.isPending}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {testCases.length > 0 ? "Regenerate Test Cases" : "Generate Test Cases"}
          </Button>
        </div>
      </div>

      {isLoadingTestCases ? (
        <Card>
          <CardContent className="pt-6">
            <div className="h-8 w-1/3 bg-muted rounded animate-pulse mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : testCases.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No Test Cases Generated Yet</h3>
            <p className="text-muted-foreground mb-6">
              Generate test cases based on your SRS-Figma validation results
            </p>
            <Button 
              onClick={handleGenerateTestCases}
              disabled={generateTestCasesMutation.isPending}
            >
              Generate Test Cases
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Test Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testCases.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Passing Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (testCases.filter(tc => tc.status === "Passed").length / testCases.length) * 100
                  )}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  High Severity Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {testCases.filter(tc => tc.severity === "High").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Test Cases by Severity</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant={chartType === "pie" ? "default" : "outline"}
                      onClick={() => setChartType("pie")}
                      className="h-8 w-8 p-0"
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={chartType === "bar" ? "default" : "outline"}
                      onClick={() => setChartType("bar")}
                      className="h-8 w-8 p-0"
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  {chartType === "pie" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={severityChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {severityChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={severityChartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Count" fill="#8884d8">
                          {severityChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Test Cases by Status</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant={chartType === "pie" ? "default" : "outline"}
                      onClick={() => setChartType("pie")}
                      className="h-8 w-8 p-0"
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={chartType === "bar" ? "default" : "outline"}
                      onClick={() => setChartType("bar")}
                      className="h-8 w-8 p-0"
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  {chartType === "pie" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statusChartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Count" fill="#8884d8">
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Cases List with Tabs */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Test Case Results</CardTitle>
                  <CardDescription>
                    Comparison of SRS requirements and Figma design elements
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={exportFormat}
                    onValueChange={setExportFormat}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    disabled={exportTestCasesMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="px-0 py-0">
              <Tabs defaultValue="all" className="w-full">
                <div className="border-b px-6">
                  <TabsList className="h-12">
                    <TabsTrigger value="all" className="data-[state=active]:bg-background">All Cases ({testCases.length})</TabsTrigger>
                    <TabsTrigger value="passed" className="data-[state=active]:bg-background">Passed ({testCases.filter(tc => tc.status === 'Passed').length})</TabsTrigger>
                    <TabsTrigger value="failed" className="data-[state=active]:bg-background">Failed ({testCases.filter(tc => tc.status === 'Failed').length})</TabsTrigger>
                    <TabsTrigger value="inprogress" className="data-[state=active]:bg-background">In Progress ({testCases.filter(tc => tc.status === 'In Progress').length})</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="space-y-0 p-0">
                  <Accordion type="multiple" className="w-full">
                    {testCases.map(renderTestCaseItem)}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="passed" className="space-y-0 p-0">
                  <Accordion type="multiple" className="w-full">
                    {testCases.filter(tc => tc.status === 'Passed').map(renderTestCaseItem)}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="failed" className="space-y-0 p-0">
                  <Accordion type="multiple" className="w-full">
                    {testCases.filter(tc => tc.status === 'Failed').map(renderTestCaseItem)}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="inprogress" className="space-y-0 p-0">
                  <Accordion type="multiple" className="w-full">
                    {testCases.filter(tc => tc.status === 'In Progress').map(renderTestCaseItem)}
                  </Accordion>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
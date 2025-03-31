import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
import { FileDown, RotateCcw, BarChart2, PieChart as PieChartIcon } from "lucide-react";

export default function TestCases() {
  const validationId = 1; // This would typically come from route params
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useState<string | null>(null);
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
          <Select
            value={exportFormat}
            onValueChange={(value) => setExportFormat(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="csv">CSV (.csv)</SelectItem>
              <SelectItem value="pdf">PDF (.pdf)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleExport}
            disabled={testCases.length === 0 || exportTestCasesMutation.isPending}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button 
            variant={testCases.length > 0 ? "outline" : "default"}
            onClick={handleGenerateTestCases} 
            disabled={generateTestCasesMutation.isPending}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {testCases.length > 0 ? "Regenerate" : "Generate Test Cases"}
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

          <Card>
            <CardHeader>
              <CardTitle>All Test Cases</CardTitle>
              <CardDescription>
                List of all generated test cases from validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Design Element</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell className="font-mono">{testCase.testCaseId}</TableCell>
                      <TableCell>{testCase.name}</TableCell>
                      <TableCell>{testCase.type}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${testCase.severity === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : testCase.severity === 'Medium' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {testCase.severity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${testCase.status === 'Failed' 
                            ? 'bg-red-100 text-red-800' 
                            : testCase.status === 'Passed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {testCase.status}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {testCase.requirement || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {testCase.designElement || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
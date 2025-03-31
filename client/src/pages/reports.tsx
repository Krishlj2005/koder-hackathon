import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Cell
} from "recharts";

export default function Reports() {
  // Mocked data for demonstration purposes
  const projectData = [
    { name: "E-commerce Dashboard", validations: 5, documents: 3, testCases: 45, compliance: 87 },
    { name: "Mobile Banking App", validations: 3, documents: 2, testCases: 28, compliance: 92 },
    { name: "HR Management System", validations: 4, documents: 4, testCases: 32, compliance: 78 },
    { name: "Social Media Platform", validations: 2, documents: 2, testCases: 18, compliance: 65 },
    { name: "Travel Booking System", validations: 6, documents: 5, testCases: 52, compliance: 85 },
  ];

  const complianceData = [
    { name: "UI Elements", compliance: 92 },
    { name: "Navigation", compliance: 87 },
    { name: "Forms", compliance: 76 },
    { name: "Content", compliance: 89 },
    { name: "Responsiveness", compliance: 82 },
  ];

  const testCaseStatusData = [
    { name: "Passed", value: 68 },
    { name: "Failed", value: 12 },
    { name: "Blocked", value: 8 },
    { name: "Not Run", value: 12 },
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280'];

  const testTypeData = [
    { month: 'Jan', UI: 12, Functional: 8, Integration: 5 },
    { month: 'Feb', UI: 15, Functional: 10, Integration: 6 },
    { month: 'Mar', UI: 18, Functional: 12, Integration: 8 },
    { month: 'Apr', UI: 14, Functional: 9, Integration: 7 },
    { month: 'May', UI: 20, Functional: 15, Integration: 10 },
    { month: 'Jun', UI: 22, Functional: 17, Integration: 12 },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          View analytics and insights from your SRS-Figma validation process
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="testCases">Test Cases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <CardDescription>
                  Active validation projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  +2 since last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Validations
                </CardTitle>
                <CardDescription>
                  SRS-Figma validations run
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20</div>
                <p className="text-xs text-muted-foreground">
                  +8 since last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Compliance Score
                </CardTitle>
                <CardDescription>
                  Overall design compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84%</div>
                <p className="text-xs text-muted-foreground">
                  +3% since last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                Validation metrics across all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={projectData}
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
                  <Legend />
                  <Bar dataKey="testCases" name="Test Cases" fill="#8884d8" />
                  <Bar dataKey="compliance" name="Compliance %" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Design Compliance by Category</CardTitle>
              <CardDescription>
                How well Figma designs match requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={complianceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="compliance" 
                    name="Compliance Score (%)" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testCases" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Case Status</CardTitle>
                <CardDescription>
                  Distribution of test case statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={testCaseStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {testCaseStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Case Types Over Time</CardTitle>
                <CardDescription>
                  Monthly breakdown by test type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={testTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="UI" name="UI Tests" stackId="a" fill="#8884d8" />
                    <Bar dataKey="Functional" name="Functional Tests" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="Integration" name="Integration Tests" stackId="a" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
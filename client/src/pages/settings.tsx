import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

const userProfileSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
});

const apiSchema = z.object({
  figmaToken: z.string().min(32, {
    message: "Figma API token should be at least 32 characters.",
  }),
});

type UserProfileValues = z.infer<typeof userProfileSchema>;
type ApiValues = z.infer<typeof apiSchema>;

export default function Settings() {
  const { toast } = useToast();

  // User profile form
  const profileForm = useForm<UserProfileValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      displayName: "John Doe",
      email: "john@example.com",
      company: "Acme Inc.",
      jobTitle: "UI/UX Designer",
    },
  });

  // API settings form
  const apiForm = useForm<ApiValues>({
    resolver: zodResolver(apiSchema),
    defaultValues: {
      figmaToken: "figd_X...masked...",
    },
  });

  function onProfileSubmit(data: UserProfileValues) {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    console.log(data);
  }

  function onApiSubmit(data: ApiValues) {
    toast({
      title: "API settings updated",
      description: "Your API settings have been saved successfully.",
    });
    console.log(data);
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and configuration
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your email address for notifications.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your organization or company name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Your job title" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your position or role.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Save Profile</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage integration with external services like Figma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...apiForm}>
                <form onSubmit={apiForm.handleSubmit(onApiSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={apiForm.control}
                      name="figmaToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Figma API Token</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your Figma API token"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your personal access token for the Figma API.
                            <a 
                              href="https://www.figma.com/developers/api#access-tokens" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary ml-1 hover:underline"
                            >
                              Learn how to get one
                            </a>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center p-4 bg-primary/5 rounded-lg">
                      <div className="mr-4 bg-green-100 p-2 rounded-full">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Figma Connected</h4>
                        <p className="text-sm text-muted-foreground">
                          Your Figma account is successfully connected
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Update API Settings</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Validation Completed</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive an email when a validation process completes
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Test Cases Generated</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive an email when new test cases are generated
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Project Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about project changes and updates
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">All Activity</h4>
                      <p className="text-sm text-muted-foreground">
                        Show notifications for all activity in your projects
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">System Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about system updates and maintenance
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Notification Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
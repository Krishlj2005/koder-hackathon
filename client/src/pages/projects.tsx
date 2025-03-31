import { useQuery } from "@tanstack/react-query";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, FolderOpen, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Projects() {
  // Fetch projects data
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your SRS documentation and Figma design validation projects
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-muted/30">
                <div className="h-6 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <div className="h-4 w-1/3 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  {project.name}
                </CardTitle>
                <CardDescription>
                  {project.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created on {formatDate(project.createdAt)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-primary/10 rounded-md p-2 text-center">
                    <div className="font-medium">Documents</div>
                    <div className="text-lg">3</div>
                  </div>
                  <div className="bg-green-100 rounded-md p-2 text-center">
                    <div className="font-medium">Validations</div>
                    <div className="text-lg">2</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <span className="text-sm text-muted-foreground">
                  Updated {formatDate(project.updatedAt)}
                </span>
                <Link href={`/projects/${project.id}`}>
                  <Button size="sm" variant="ghost" className="group-hover:bg-primary/10 rounded-full w-8 h-8 p-0">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
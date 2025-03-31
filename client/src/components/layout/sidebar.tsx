import { BookOpen, FileText, HelpCircle, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Project } from "@/types";

const Sidebar = () => {
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 p-4 hidden md:block">
      <div className="mb-6">
        <h2 className="text-xs uppercase text-neutral-600 font-semibold tracking-wider mb-3">
          Recent Projects
        </h2>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="text-sm">
              <Link 
                href={`/projects/${project.id}`}
                className={`flex items-center p-2 rounded ${project.name === 'Mobile Banking App' ? 'bg-neutral-100' : 'hover:bg-neutral-100'}`}
              >
                <FileText className="text-primary h-4 w-4 mr-3" />
                <span>{project.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-xs uppercase text-neutral-600 font-semibold tracking-wider mb-3">
          Resources
        </h2>
        <ul className="space-y-1 text-sm">
          <li>
            <a href="#" className="flex items-center p-2 rounded hover:bg-neutral-100">
              <BookOpen className="h-4 w-4 mr-3 text-neutral-600" />
              Documentation
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded hover:bg-neutral-100">
              <Video className="h-4 w-4 mr-3 text-neutral-600" />
              Tutorials
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded hover:bg-neutral-100">
              <HelpCircle className="h-4 w-4 mr-3 text-neutral-600" />
              Help Center
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

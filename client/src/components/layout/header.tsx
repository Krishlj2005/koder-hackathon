import { Bell, ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "wouter";

const Header = () => {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-primary">SRS & Figma Validator</h1>
        <div className="hidden md:flex space-x-6 text-sm">
          <Link href="/">
            <a className="text-primary font-medium">Dashboard</a>
          </Link>
          <Link href="/projects">
            <a className="text-neutral-600 hover:text-primary">Projects</a>
          </Link>
          <Link href="/reports">
            <a className="text-neutral-600 hover:text-primary">Reports</a>
          </Link>
          <Link href="/figma-test">
            <a className="text-neutral-600 hover:text-primary">Figma Test</a>
          </Link>
          <Link href="/settings">
            <a className="text-neutral-600 hover:text-primary">Settings</a>
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-neutral-600 hover:text-primary">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-neutral-600 hover:text-primary">
          <HelpCircle className="h-5 w-5" />
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
              alt="User profile" 
              className="w-8 h-8 object-cover"
            />
          </div>
          <span className="ml-2 text-sm font-medium hidden md:inline">John Doe</span>
          <ChevronDown className="ml-2 h-4 w-4 text-neutral-600" />
        </div>
      </div>
    </header>
  );
};

export default Header;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";
import FigmaTestPage from "@/pages/figma-test";
import NotFound from "@/pages/not-found";
import Projects from "@/pages/projects";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import TestCases from "@/pages/test-cases";
import AppLayout from "@/components/layout/app-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/projects" component={Projects} />
      <Route path="/reports" component={Reports} />
      <Route path="/figma-test" component={FigmaTestPage} />
      <Route path="/settings" component={Settings} />
      <Route path="/test-cases" component={TestCases} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Router />
      </AppLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

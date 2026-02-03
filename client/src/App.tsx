import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";

import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import OrganizationsPage from "@/pages/organizations";
import OrganizationNewPage from "@/pages/organization-new";
import OrganizationDetailPage from "@/pages/organization-detail";
import AssessmentsPage from "@/pages/assessments";
import AssessmentPage from "@/pages/assessment";
import SubcontractorPage from "@/pages/subcontractor";
import ActionsPage from "@/pages/actions";
import ActionNewPage from "@/pages/action-new";
import DocumentsPage from "@/pages/documents";
import CommentsPage from "@/pages/comments";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 p-3 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <Route path="/" component={DashboardPage} />
              <Route path="/organizations" component={OrganizationsPage} />
              <Route path="/organizations/new" component={OrganizationNewPage} />
              <Route path="/organizations/:id" component={OrganizationDetailPage} />
              <Route path="/organizations/:id/actions/new" component={ActionNewPage} />
              <Route path="/assessments" component={AssessmentsPage} />
              <Route path="/assessments/:id" component={AssessmentPage} />
              <Route path="/assessments/:id/subcontractor" component={SubcontractorPage} />
              <Route path="/actions" component={ActionsPage} />
              <Route path="/documents" component={DocumentsPage} />
              <Route path="/comments" component={CommentsPage} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <AuthenticatedRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

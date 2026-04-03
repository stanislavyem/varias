import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, FileCheck, Users, BarChart3, ClipboardList, Shield } from "lucide-react";
import logoImg from "@assets/RiskCtrl_Pro_1775234611757.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={logoImg} alt="RiskCtrlPro" className="h-9 w-auto object-contain" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">Features</a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-benefits">Benefits</a>
            </div>
            <a href="/api/login">
              <Button data-testid="button-login">Sign In</Button>
            </a>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight">
                  From Risk Insight
                  <span className="block text-primary">to Action</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  RiskCtrlPro streamlines your risk assessment process with a comprehensive platform. 
                  Evaluate safety, workers' compensation, and fleet risks with precision scoring.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="/api/login">
                  <Button size="lg" className="gap-2" data-testid="button-get-started">
                    Get Started
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  <span>20 Assessment Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>3 Risk Pillars</span>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
              <Card className="relative overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                      <p className="text-4xl font-bold text-primary">87.5</p>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Safety Pillar</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-green-500 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Workers' Comp</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[78%] bg-amber-500 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fleet</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">Comprehensive Risk Management</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides everything you need to assess, track, and manage insurance risks.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Risk Assessments</h3>
                <p className="text-muted-foreground">
                  Complete 20-question assessments across Safety, Workers' Comp, and Fleet pillars with precise scoring.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Score Analytics</h3>
                <p className="text-muted-foreground">
                  Real-time scoring with pillar breakdowns and overall risk ratings from High Risk to Strong/Low Risk.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Action Management</h3>
                <p className="text-muted-foreground">
                  Create, assign, and track action items with priority rankings based on risk severity.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Subcontractor Scoring</h3>
                <p className="text-muted-foreground">
                  Evaluate subcontractor risk with dedicated controls for safety training and insurance verification.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Document Management</h3>
                <p className="text-muted-foreground">
                  Upload and organize safety programs, COIs, OSHA logs, and incident reports by category.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Role-Based Access</h3>
                <p className="text-muted-foreground">
                  Secure multi-tenant platform with dedicated views for Carriers, Agents, and Insured organizations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Start Assessing Risk Today</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join insurance professionals who trust RiskCtrlPro for comprehensive risk assessment and management.
          </p>
          <a href="/api/login">
            <Button size="lg" data-testid="button-cta-bottom">
              Get Started Free
            </Button>
          </a>
        </div>
      </section>

      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img src={logoImg} alt="RiskCtrlPro" className="h-7 w-auto object-contain" />
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RiskCtrlPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SignedIn, SignedOut, ClerkLoading } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";

function Router() {
  return (
    <Switch>
      <Route path="/">
        {/* If the user is SIGNED IN, show the Home page */}
        <SignedIn>
          <Home />
        </SignedIn>

        {/* If the user is SIGNED OUT, show the Landing page */}
        <SignedOut>
          <Landing />
        </SignedOut>

        {/* While Clerk is checking the session, show a loader */}
        <ClerkLoading>
          <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </ClerkLoading>
      </Route>

      {/* Keep these for direct navigation */}
      <Route path="/landing" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
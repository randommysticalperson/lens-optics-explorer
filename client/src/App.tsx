import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ConvergingLens from "./pages/ConvergingLens";
import ConcaveLens from "./pages/ConcaveLens";
import AsphericLens from "./pages/AsphericLens";
import ThinLensEquation from "./pages/ThinLensEquation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/converging" component={ConvergingLens} />
      <Route path="/concave" component={ConcaveLens} />
      <Route path="/aspheric" component={AsphericLens} />
      <Route path="/equation" component={ThinLensEquation} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

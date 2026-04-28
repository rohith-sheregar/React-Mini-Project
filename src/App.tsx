import { Component, type ReactNode, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import ScrollProgressBar from "./components/ScrollProgressBar";
import Home from "./pages/Home";
import ThreeLoader from "./components/ThreeLoader";

/**
 * Design Philosophy: Minimalist Scientific Precision
 * - Swiss Modernism aesthetic with data visualization focus
 * - Clean typography hierarchy, generous whitespace
 * - Teal accent used sparingly for critical elements
 * - Smooth, professional animations (no bounce)
 */

// Proper React class-based Error Boundary
interface ErrorBoundaryState { hasError: boolean; }
class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error("App Error:", error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <p>Something went wrong. Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  // When loading, we want to hide scrollbars to prevent scrolling down during the loader
  const appStyle = isAppLoaded ? {} : { height: '100vh', overflow: 'hidden' };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          {!isAppLoaded && (
            <ThreeLoader onLoadComplete={() => setIsAppLoaded(true)} minDisplayTime={3500} />
          )}
          
          <div style={appStyle}>
            <Toaster />
            <ScrollProgressBar />
            <Navbar />
            <Home />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

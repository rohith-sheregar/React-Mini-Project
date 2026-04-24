import HeroSection from '../sections/HeroSection';
import ScrollyStory from '../scenes/ScrollyStory';
import OverviewSection from '../sections/OverviewSection';
import PipelineSection from '../sections/PipelineSection';
import ResultsSection from '../sections/ResultsSection';
import TeamSection from '../sections/TeamSection';
import ContactSection from '../sections/ContactSection';

/**
 * Home Page
 * Design: Minimalist Scientific Precision
 * - Full-screen sections with smooth scroll
 * - Professional animations and transitions
 * - Research-grade aesthetic suitable for university defense
 */

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <ScrollyStory />
      <OverviewSection />
      <PipelineSection />
      <ResultsSection />
      <TeamSection />
      <ContactSection />
    </main>
  );
}

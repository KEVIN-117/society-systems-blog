import { Navbar } from "@/components/organisms/Navbar";
import { Hero } from "@/components/organisms/Hero";
import { AboutSection } from "@/components/organisms/AboutSection";
import { ArticleGrid } from "@/components/organisms/ArticleGrid";
import { Footer } from "@/components/organisms/Footer";

export default function Home() {
  return (
    <>
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <ArticleGrid />
      </main>
      <Footer />
    </>
  );
}

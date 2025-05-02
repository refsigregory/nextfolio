import AboutMe from "@/components/AboutMe";
import BlogPreview from "@/components/BlogPreview";
import CompanySlider from "@/components/CompanySlider";
import ExperienceSection from "@/components/Experience";
import Showcase from "@/components/Showcase";

export default function Home() {
  return (
    <div>
      <AboutMe />
      <Showcase />
      <ExperienceSection />
      <BlogPreview />
      <CompanySlider />
    </div>
  );
}

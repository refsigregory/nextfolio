import AboutMe from "@/components/AboutMe";
import BlogPreview from "@/components/BlogPreview";
import CompanySlider from "@/components/CompanySlider";
import ContactFooter from "@/components/Contact";
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
      <ContactFooter />
    </div>
  );
}

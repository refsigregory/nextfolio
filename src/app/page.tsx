import AboutMe from "@/components/AboutMe";
import BlogPreview from "@/components/BlogPreview";
import CompanySlider from "@/components/CompanySlider";
import ContactFooter from "@/components/Contact";
import ExperienceSection from "@/components/Experience";
import Showcase from "@/components/Showcase";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <AboutMe />
      <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading projects...</div>}>
        <Showcase />
      </Suspense>
      <ExperienceSection />
      <BlogPreview />
      <CompanySlider />
      <ContactFooter />
    </div>
  );
}

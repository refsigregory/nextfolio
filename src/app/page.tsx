import AboutMe from '@/components/AboutMe';
import BlogPreview from '@/components/BlogPreview';
import ContactFooter from '@/components/Contact';
import ContentSheet from '@/components/ContentSheet';
import Reveal from '@/components/Reveal';
import ExperienceSection from '@/components/Experience';
import Header from '@/components/Header';
import Showcase from '@/components/Showcase';
import { getExperienceStats } from '@/lib/experience';
import { getJobs } from '@/lib/jobs';
import { getPosts } from '@/lib/posts';
import { getAllProjects } from '@/lib/projects';

export default async function Home() {
  const [projects, jobs, stats] = await Promise.all([getAllProjects(), getJobs(), getExperienceStats()]);
  const posts = getPosts();

  return (
    <>
      <Header />
      <main>
        {/* Sticky hero; the content card below peeks in, then opens up over it on scroll. */}
        <AboutMe projectCount={projects.length} since={stats.since} latestEmployer={jobs[0]?.name} />
        <ContentSheet>
          <Showcase projects={projects} />
          <Reveal>
            <ExperienceSection jobs={jobs} stats={stats} />
          </Reveal>
          <Reveal>
            <BlogPreview posts={posts} />
          </Reveal>
        </ContentSheet>
      </main>
      <div className="relative z-10">
        <ContactFooter />
      </div>
    </>
  );
}

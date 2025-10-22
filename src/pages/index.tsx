import Link from 'next/link';
import HomeHero from '../components/HomeHero';
import projects from '../data/projects';

export default function Home() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* HERO */}
      <HomeHero />

      {/* ABOUT */}
      <section id="about" className="mt-20 scroll-mt-24">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          I’m an Electrical & Computer Engineer pivoting into full‑stack
          development. I love designing and building performant, intuitive
          web apps capable of solving real‑world problems. My strengths span
          system‑level thinking, modern web frameworks, and collaborative
          engineering practices.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          I focus on React/Next.js, TypeScript, Node.js, and PostgreSQL.
          I enjoy crafting both the architecture and the user experience.
        </p>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="mt-24 scroll-mt-24">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">Projects</h2>

        <div className="space-y-6">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg 
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Link href={`/projects/${p.slug}`} className="block mb-3">
                <h3 className="text-xl font-bold mb-1 text-accent-coral hover:underline">
                  {p.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {p.description}
                </p>
                <p className="text-sm text-gray-500">
                  Tech: {p.tech.join(', ')}
                </p>
              </Link>

              {/* ACTION LINKS */}
              <div className="flex gap-4 flex-wrap mt-4">
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded-md font-semibold 
                               text-black bg-accent-gradient shadow-sm
                               hover:brightness-110 transition"
                  >
                    Live Demo →
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded-md font-semibold 
                               border-2 border-accent-coral 
                               text-accent-coral hover:bg-accent-coral hover:text-white
                               transition"
                  >
                    Repository →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mt-24 mb-20 text-center scroll-mt-24">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Let’s Connect
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          I’m currently{' '}
          <span className="text-green-600 dark:text-green-400 font-semibold">
            open to full‑time roles
          </span>{' '}
          — software engineering and full‑stack development positions.
        </p>

        <div className="space-x-6">
          <a
            href="mailto:zkarem12@gmail.com"
            className="text-accent-coral underline hover:opacity-80"
          >
            zkarem12@gmail.com
          </a>
          <a
            href="https://github.com/ZahraaSadeqProd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-coral underline hover:opacity-80"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/zahraa-sadeq-460199145/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-coral underline hover:opacity-80"
          >
            LinkedIn
          </a>
        </div>

        <div className="mt-10">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 font-semibold text-black rounded-md shadow-md 
                       bg-accent-gradient hover:brightness-105"
          >
            View My Resume
          </a>
        </div>
      </section>
    </main>
  );
}
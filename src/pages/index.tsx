import Link from "next/link";
import HomeHero from "../components/HomeHero";
import projects from "../data/projects";

export default function Home() {
  return (
    <main className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
      {/* HERO */}
      <HomeHero />

      {/* ABOUT */}
      <section id="about" className="mt-16 sm:mt-20 scroll-mt-24">
        <h2 className="text-xl sm:text-3xl font-semibold mb-4 text-center sm:text-left">
          About Me
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
          I'm an Electrical & Computer Engineer pivoting into full-stack
          development. I love designing and building performant, intuitive web
          apps capable of solving real-world problems. My strengths span
          system-level thinking, modern web frameworks, and collaborative
          engineering practices.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
          I focus on Angular, Node.js, React, Next.js, MongoDB, and PostgreSQL.
          I enjoy crafting both architecture and user experience.
        </p>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="mt-20 scroll-mt-24">
        <h2 className="text-xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
          Projects
        </h2>

        <div className="flex flex-col gap-6">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="border border-gray-200 dark:border-gray-700 p-5 sm:p-6 rounded-lg 
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Link href={`/projects/${p.slug}`} className="block mb-3">
                <h3 className="text-lg sm:text-xl font-bold mb-1 text-accent-coral hover:underline">
                  {p.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base">
                  {p.description}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Tech: {p.tech.join(", ")}
                </p>
              </Link>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3 sm:mt-4">
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-md font-semibold 
                               text-black
                               
                               bg-accent-gradient shadow-sm
                               hover:brightness-110 transition"
                  >
                    Live Demo
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-md font-semibold border-2 
                               border-accent-coral
                               text-accent-coral 
                               hover:text-white
                               hover:bg-accent-coral
                               dark:hover:bg-accent-coral 
                                transition-all duration-300"
                  >
                    Repository
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="mt-20 mb-16 sm:mb-20 text-center scroll-mt-24"
      >
        <h2 className="text-xl sm:text-3xl font-semibold mb-4">
          Let’s Connect
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-base sm:text-lg">
          I’m currently{" "}
          <span className="text-green-600 dark:text-green-400 font-semibold">
            open to full‑time roles
          </span>{" "}
          — software engineering and full‑stack development positions.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:space-x-6">
          <a
            href="mailto:zkarem12@gmail.com"
            className="text-accent-coral underline hover:opacity-80"
          >
            zkarem12@gmail.com
          </a>
          <a
            href="https://github.com/yourgithub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-coral underline hover:opacity-80"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/yourlinkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-coral underline hover:opacity-80"
          >
            LinkedIn
          </a>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 font-semibold text-black rounded-md shadow-md 
                       bg-accent-gradient hover:brightness-105 w-full sm:w-auto text-center"
          >
            View My Resume
          </a>
        </div>
      </section>
    </main>
  );
}

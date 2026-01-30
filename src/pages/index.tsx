import Link from "next/link";
import HomeHero from "../components/HomeHero";
import projects from "../data/projects";

export default function Home() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
      {/* HERO */}
      <HomeHero />

      {/* ABOUT */}
      <section id="about" className="mt-16 sm:mt-24 scroll-mt-24">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center sm:text-left
                       text-gray-900 dark:text-white"
        >
          About Me
        </h2>
        <div
          className="bg-gradient-to-br from-white/95 via-primary-50/30 to-tertiary-50/40
                        dark:from-surface-dark-elevated dark:via-surface-dark-elevated dark:to-surface-dark-elevated
                        rounded-2xl p-6 sm:p-8
                        border border-primary-200/60 dark:border-gray-700/50
                        shadow-md shadow-primary-100/50 dark:shadow-none backdrop-blur-sm"
        >
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
            I&apos;m an Electrical &amp; Computer Engineer pivoting into
            full-stack development. I love designing and building performant,
            intuitive web apps capable of solving real-world problems. My
            strengths span system-level thinking, modern web frameworks, and
            collaborative engineering practices.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
            I focus on Angular, Node.js, React, Next.js, MongoDB, and
            PostgreSQL. I enjoy crafting both architecture and user experience.
          </p>
        </div>
      </section>

      {/* EDUCATION & CERTIFICATIONS */}
      <section id="education" className="mt-16 sm:mt-24 scroll-mt-24">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center sm:text-left
                       text-gray-900 dark:text-white"
        >
          Education &amp; Certifications
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="bg-gradient-to-br from-white/95 via-primary-50/30 to-secondary-50/30
                          dark:from-surface-dark-elevated dark:via-surface-dark-elevated dark:to-surface-dark-elevated
                          rounded-2xl p-6 sm:p-8
                          border border-primary-200/60 dark:border-gray-700/50
                          shadow-md shadow-primary-100/40 dark:shadow-none backdrop-blur-sm"
          >
            <h3 className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400 mb-3">
              Education
            </h3>
            <div className="space-y-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  B.S. Electrical &amp; Computer Engineering
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  University of Arizona • 2015 – 2020
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                  GPA: 3.4/4.0
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  M.S. Electrical &amp; Computer Engineering
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  University of Arizona • 2020 – 2022
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                  GPA: 3.8/4.0
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-white/95 via-tertiary-50/30 to-primary-50/30
                          dark:from-surface-dark-elevated dark:via-surface-dark-elevated dark:to-surface-dark-elevated
                          rounded-2xl p-6 sm:p-8
                          border border-primary-200/60 dark:border-gray-700/50
                          shadow-md shadow-primary-100/40 dark:shadow-none backdrop-blur-sm"
          >
            <h3 className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              Certifications
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-base text-gray-900 dark:text-white">
                    Full-Stack Web Development
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    IBM • 2026
                  </p>
                </div>
                <a
                  href="https://drive.google.com/file/d/1dRZhtPOu6FPOyfk1Yw_S85MbLP8ePIrr/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary-600 dark:text-primary-300
                       bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full whitespace-nowrap
                       hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                >
                  View
                </a>
              </li>
              <li className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-base text-gray-900 dark:text-white">
                    Mastering Angular Development
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Coursera - Edureka • 2026
                  </p>
                </div>
                <a
                  href="https://drive.google.com/file/d/1pmTgRkBsmgjvi6lfu48TqrsnMGtJmDdc/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary-600 dark:text-primary-300
                       bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full whitespace-nowrap
                       hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                >
                  View
                </a>
              </li>
              <li className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-base text-gray-900 dark:text-white">
                    The Complete Node.js Course
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mosh • 2025
                  </p>
                </div>
                <a
                  href="https://drive.google.com/file/d/1ZNdYi9P3K68fqoGE3HjrWvYXDDOtqBVW/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary-600 dark:text-primary-300
                       bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full whitespace-nowrap
                       hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                >
                  View
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* WORK EXPERIENCE */}
      <section id="experience" className="mt-16 sm:mt-24 scroll-mt-24">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center sm:text-left
                       text-gray-900 dark:text-white"
        >
          Work Experience
        </h2>
        <div className="space-y-6">
          <div
            className="bg-gradient-to-br from-white/95 via-tertiary-50/30 to-primary-50/30
                          dark:from-surface-dark-elevated dark:via-surface-dark-elevated dark:to-surface-dark-elevated
                          rounded-2xl p-6 sm:p-8
                          border border-primary-200/60 dark:border-gray-700/50
                          shadow-md shadow-primary-100/40 dark:shadow-none backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">
                Software Engineer - II
              </h3>
              <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Raytheon • 2020 – 2025
              </span>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              
            </p>
            <ul className="mt-4 list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-300 space-y-2">
              <li>
                Led in-depth root cause analysis and resolution of complex
                system failures and test anomalies observed during
                Software-in-the-Loop and Hardware-in-the-Loop testing of
                multi-processor embedded systems (PPC and DSP architectures)
                operating within a VxWorks / RTOS environment.
              </li>
              <li>
                Developed embedded C/C++ software components for both PPC
                (running VxWorks) and DSP architectures.
              </li>
              <li>
                Designed, developed, and executed automated unit and
                module-level tests for mission-critical embedded C/C++ software
                using Google Test and GMock in Linux development environments.
              </li>
              <li>
                Collaborated effectively within an Agile development framework,
                supported development teams in reproducing test environments and
                coverage results, and conducted software peer reviews.
              </li>
              <li>
                Authored and reviewed technical documentation, including test
                procedures, test environment details, Problem Reports, and
                analysis reports.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="mt-16 sm:mt-24 scroll-mt-24">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center sm:text-left
                       text-gray-900 dark:text-white"
        >
          Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="border border-primary-200/60 dark:border-gray-700/50 p-5 sm:p-6 rounded-2xl 
                         bg-gradient-to-br from-white/95 to-primary-50/30 dark:from-surface-dark-elevated dark:to-surface-dark-elevated
                         hover:border-primary-400 dark:hover:border-primary-500/50
                         shadow-sm shadow-primary-100/40 dark:shadow-none
                         hover:shadow-lg hover:shadow-primary-200/60 dark:hover:shadow-primary-500/10
                         transition-all duration-300
                         flex flex-col backdrop-blur-sm"
            >
              <Link
                href={`/projects/${p.slug}`}
                className="block mb-4 flex-grow"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-primary-500 dark:text-primary-400 hover:underline">
                  {p.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm sm:text-base line-clamp-2">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tech.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 rounded-full 
                                 bg-primary-50 dark:bg-primary-900/20 
                                 text-primary-600 dark:text-primary-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {p.tech.length > 4 && (
                    <span className="text-xs px-2 py-1 text-gray-500">
                      +{p.tech.length - 4} more
                    </span>
                  )}
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-primary-100/50 dark:border-gray-700/50">
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2.5 rounded-lg font-semibold 
                               text-white text-sm
                               bg-accent-gradient
                               shadow-sm hover:shadow-md hover:opacity-90 
                               transition-all"
                  >
                    Live Demo
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2.5 rounded-lg font-semibold border-2 
                               border-primary-500 text-sm
                               text-primary-600 dark:text-primary-300
                               bg-white/80 dark:bg-primary-500/10
                               hover:bg-primary-500 hover:text-white hover:border-primary-500
                               dark:hover:bg-primary-400 dark:hover:text-gray-900 dark:hover:border-primary-400
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
        className="mt-16 sm:mt-24 mb-8 sm:mb-12 scroll-mt-24"
      >
        <div
          className="bg-gradient-to-br from-primary-100/60 via-white/90 to-secondary-100/50 
                        dark:from-surface-dark-elevated dark:via-surface-dark dark:to-surface-dark-elevated 
                        rounded-2xl p-8 sm:p-12 text-center
                        border border-primary-200/70 dark:border-gray-700/50
                        backdrop-blur-sm shadow-md shadow-primary-100/40 dark:shadow-none"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Let&apos;s Connect
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-base sm:text-lg max-w-2xl mx-auto">
            I&apos;m currently{" "}
            <span className="text-success dark:text-emerald-400 font-semibold">
              open to full-time roles
            </span>{" "}
            — software engineering and full-stack development positions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-8">
            <a
              href="mailto:zkarem12@gmail.com"
              className="flex items-center gap-2 text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              zkarem12@gmail.com
            </a>
            <a
              href="https://github.com/ZahraaSadeqProd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/zahraa-sadeq-460199145/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>

          <a
            href="https://drive.google.com/file/d/1GWC3OAR8ZIWbXhyxW_b27A5-9GU8FHAj/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white 
                       rounded-lg shadow-lg bg-gradient-to-r from-primary-500 to-primary-400
                       hover:shadow-xl hover:from-primary-600 hover:to-primary-500 transition-all"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View My Resume
          </a>
        </div>
      </section>
    </main>
  );
}

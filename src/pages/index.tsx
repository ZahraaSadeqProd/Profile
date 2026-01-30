import Link from "next/link";
import HomeHero from "../components/HomeHero";
import projects from "../data/projects";

export default function Home() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
      {/* HERO */}
      <HomeHero />

      {/* ABOUT */}
      <section id="about" className="py-12 sm:py-16 scroll-mt-24">
        <h2 className="section-title">About Me</h2>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="pro-card p-6 sm:p-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-3">
                I&apos;m an Electrical &amp; Computer Engineer with a Master&apos;s degree, 
                transitioning into full-stack development. I specialize in building performant, 
                intuitive web applications that solve real-world problems.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                My background in systems engineering gives me a unique perspective on architecture 
                and scalability. I focus on modern technologies including Angular, React, Next.js, 
                Node.js, and cloud platforms.
              </p>
            </div>
          </div>
          <div>
            <div className="pro-card p-6 sm:p-8 h-full">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                Core Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Angular', 'React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS'].map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="py-12 sm:py-16 scroll-mt-24">
        <h2 className="section-title">Education</h2>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase tracking-wide">
          Degrees
        </h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="pro-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="timeline-dot mt-1.5 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  M.S. Electrical &amp; Computer Engineering
                </h3>
                <p className="text-pink-600 dark:text-pink-400 font-medium mt-1">
                  University of Arizona
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  2020 – 2022 • GPA: 3.8/4.0
                </p>
              </div>
            </div>
          </div>
          <div className="pro-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="timeline-dot mt-1.5 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  B.S. Electrical &amp; Computer Engineering
                </h3>
                <p className="text-pink-600 dark:text-pink-400 font-medium mt-1">
                  University of Arizona
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  2015 – 2020 • GPA: 3.4/4.0
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Certifications */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase tracking-wide">
          Certifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Full-Stack Web Development', org: 'IBM', year: '2026', url: 'https://drive.google.com/file/d/1dRZhtPOu6FPOyfk1Yw_S85MbLP8ePIrr/view?usp=sharing' },
            { name: 'Mastering Angular Development', org: 'Coursera - Edureka', year: '2026', url: 'https://drive.google.com/file/d/1pmTgRkBsmgjvi6lfu48TqrsnMGtJmDdc/view?usp=sharing' },
            { name: 'The Complete Node.js Course', org: 'Mosh', year: '2025', url: 'https://drive.google.com/file/d/1ZNdYi9P3K68fqoGE3HjrWvYXDDOtqBVW/view?usp=sharing' },
          ].map((cert) => (
            <a
              key={cert.name}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pro-card p-4 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors text-sm">
                    {cert.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {cert.org} • {cert.year}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* WORK EXPERIENCE */}
      <section id="experience" className="py-12 sm:py-16 scroll-mt-24">
        <h2 className="section-title">Experience</h2>
        <div className="mt-8">
          <div className="pro-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Software Engineer II
                </h3>
                <p className="text-pink-600 dark:text-pink-400 font-medium mt-1">
                  Raytheon
                </p>
              </div>
              <span className="inline-flex items-center px-4 py-1.5 rounded-lg 
                               bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20
                               text-xs font-medium text-pink-700 dark:text-pink-300 whitespace-nowrap">
                2020 – 2025
              </span>
            </div>
            <ul className="space-y-2.5">
              {[
                'Led root cause analysis and resolution of complex system failures during Software-in-the-Loop and Hardware-in-the-Loop testing of multi-processor embedded systems (PPC and DSP architectures) in VxWorks/RTOS environments.',
                'Developed embedded C/C++ software components for both PPC (VxWorks) and DSP architectures.',
                'Designed and executed automated unit and module-level tests for mission-critical embedded C/C++ software using Google Test and GMock in Linux environments.',
                'Collaborated within Agile development frameworks, supported test environment reproduction, and conducted software peer reviews.',
                'Authored and reviewed technical documentation including test procedures, Problem Reports, and analysis reports.',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-12 sm:py-16 scroll-mt-24">
        <h2 className="section-title">Projects</h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <div key={p.slug} className="pro-card p-6 flex flex-col">
              <Link href={`/projects/${p.slug}`} className="block mb-3 flex-grow group">
                <h3 className="text-base font-bold text-gray-900 dark:text-white 
                               group-hover:text-pink-600 dark:group-hover:text-pink-400 
                               transition-colors mb-2">
                  {p.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 4).map((tech) => (
                    <span key={tech} className="tech-tag text-xs">{tech}</span>
                  ))}
                  {p.tech.length > 4 && (
                    <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                      +{p.tech.length - 4}
                    </span>
                  )}
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="flex gap-2.5 mt-auto pt-4 border-t border-pink-200/30 dark:border-pink-700/20">
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-primary text-xs py-2 justify-center"
                  >
                    Live Demo
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-secondary text-xs py-2 justify-center"
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
      <section id="contact" className="py-12 sm:py-16 scroll-mt-24">
        <div className="pro-card p-8 sm:p-12 text-center bg-gradient-to-br from-white to-pink-50/50 dark:from-slate-800 dark:to-pink-900/10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Let&apos;s Work Together
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2 text-base max-w-2xl mx-auto font-medium">
            I&apos;m currently{" "}
            <span className="text-pink-600 dark:text-pink-400">
              open to new opportunities
            </span>
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto text-sm">
            Looking for software engineering and full-stack development positions. 
            Feel free to reach out if you think we&apos;d be a good match!
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <a
              href="mailto:zkarem12@gmail.com"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm
                         bg-pink-100 dark:bg-pink-900/20
                         text-pink-700 dark:text-pink-300
                         hover:bg-pink-200 dark:hover:bg-pink-900/30
                         transition-all duration-200 border border-pink-300 dark:border-pink-700/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              zkarem12@gmail.com
            </a>
            <a
              href="https://github.com/ZahraaSadeqProd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm
                         bg-pink-100 dark:bg-pink-900/20
                         text-pink-700 dark:text-pink-300
                         hover:bg-pink-200 dark:hover:bg-pink-900/30
                         transition-all duration-200 border border-pink-300 dark:border-pink-700/30"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" 
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/zahraa-sadeq-460199145/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm
                         bg-pink-100 dark:bg-pink-900/20
                         text-pink-700 dark:text-pink-300
                         hover:bg-pink-200 dark:hover:bg-pink-900/30
                         transition-all duration-200 border border-pink-300 dark:border-pink-700/30"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>

          <a
            href="https://drive.google.com/file/d/1GWC3OAR8ZIWbXhyxW_b27A5-9GU8FHAj/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-primary text-base px-8 py-3.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View My Resume
          </a>
        </div>
      </section>
    </main>
  );
}

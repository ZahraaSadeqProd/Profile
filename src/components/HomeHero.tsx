export default function HomeHero() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="text-center sm:text-left">
        {/* Status badge */}
        <div className="flex justify-center sm:justify-start mb-4">
          <span
            className="inline-flex items-center gap-2 text-xs sm:text-sm
                       text-success dark:text-emerald-400
                       bg-success-light dark:bg-emerald-900/40
                       px-3 py-1.5 rounded-full font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Open to Work
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold 
                       text-gray-900 dark:text-white mb-4 sm:mb-6"
        >
          Hi, I&apos;m{" "}
          <span className="bg-clip-text text-transparent bg-accent-gradient">
            Zahraa
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 
                      max-w-2xl mx-auto sm:mx-0 mb-6 sm:mb-8 leading-relaxed"
        >
          A Software Engineer passionate about building{" "}
          <span className="text-primary-500 dark:text-primary-400 font-medium">
            fullstack
          </span>{" "}
          web applications
        </p>

        {/* Description */}
        <p
          className="text-base sm:text-lg text-gray-500 dark:text-gray-400 
                      max-w-xl mx-auto sm:mx-0 mb-8 sm:mb-10 leading-relaxed"
        >
          I craft web experiences using modern frameworks like Angular, React,
          Next.js, and Node.js.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <a
            href="mailto:zkarem12@gmail.com"
            className="relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 
                       font-semibold text-white rounded-lg
                       shadow-lg hover:shadow-xl
                       focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-primary-500
                       transition-all duration-300 group overflow-hidden"
          >
            <span
              className="absolute inset-0 bg-accent-gradient
                         hover:opacity-90 transition-all duration-300"
            ></span>
            <span className="relative z-10 flex items-center gap-2">
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
              Contact Me
            </span>
          </a>

          <a
            href="https://drive.google.com/file/d/1aXriT1BCm5DMpi05Hcbj8HWuX7D7GeXx/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4
                       rounded-lg border-2 border-primary-500
                       text-primary-600 dark:text-primary-300 font-semibold
                       bg-white/80 dark:bg-primary-500/10
                       hover:bg-primary-500 hover:text-white hover:border-primary-500
                       dark:hover:bg-primary-400 dark:hover:text-gray-900 dark:hover:border-primary-400
                       shadow-sm hover:shadow-md
                       transition-all duration-300"
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
            View Resume
          </a>
        </div>

        {/* Social links */}
        <div className="flex gap-4 justify-center sm:justify-start mt-6 sm:mt-8">
          <a
            href="https://github.com/ZahraaSadeqProd"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/80 dark:bg-surface-dark-elevated 
                       border border-primary-100/50 dark:border-gray-700/50
                       hover:bg-primary-100 dark:hover:bg-primary-900/30 
                       text-gray-600 dark:text-gray-300
                       hover:text-primary-500 dark:hover:text-primary-400
                       shadow-sm hover:shadow-md
                       transition-all duration-300"
            aria-label="GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/zahraa-sadeq-460199145/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/80 dark:bg-surface-dark-elevated 
                       border border-primary-100/50 dark:border-gray-700/50
                       hover:bg-primary-100 dark:hover:bg-primary-900/30 
                       text-gray-600 dark:text-gray-300
                       hover:text-primary-500 dark:hover:text-primary-400
                       shadow-sm hover:shadow-md
                       transition-all duration-300"
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="mailto:zkarem12@gmail.com"
            className="p-3 rounded-full bg-white/80 dark:bg-surface-dark-elevated 
                       border border-primary-100/50 dark:border-gray-700/50
                       hover:bg-primary-100 dark:hover:bg-primary-900/30 
                       text-gray-600 dark:text-gray-300
                       hover:text-primary-500 dark:hover:text-primary-400
                       shadow-sm hover:shadow-md
                       transition-all duration-300"
            aria-label="Email"
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
          </a>
        </div>
      </div>
    </section>
  );
}

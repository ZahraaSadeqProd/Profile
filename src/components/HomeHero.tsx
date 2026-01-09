export default function HomeHero() {
  return (
    <section
      className="flex flex-col sm:flex-row justify-between items-center
                 mt-12 px-6 space-y-6 sm:space-y-0"
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-4xl font-bold">Hi, I’m Zahraa</h1>
          <span
            className="inline-flex items-center gap-2 text-sm
                       text-green-700 dark:text-green-400
                       bg-green-100 dark:bg-green-900/40
                       px-3 py-1 rounded-full font-medium"
          >
            🟢 Open to Work
          </span>
        </div>

        <p className="max-w-md text-gray-700 dark:text-gray-300 leading-relaxed">
          I am a Software Engineer interested in fullstack development.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap">
        <a
          href="mailto:zkarem12@gmail.com"
          className="relative inline-flex items-center justify-center px-6 py-3 
                    font-semibold text-black rounded-lg
                    border-2 border-transparent
                    shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-accent-coral dark:focus:ring-accent-peach 
                    hover:border-accent-coral
                    transition-all duration-300 group overflow-hidden"
        >
          <span
            className="absolute inset-0 bg-accent-gradient opacity-90
                      group-hover:opacity-100 transition-opacity duration-300"
          ></span>
          <span
            className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-0
                      group-hover:opacity-30 transition-opacity duration-500"
          ></span>
          <span className="relative z-10">Contact Me</span>
        </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3
                       rounded-lg border-2 border-accent-coral
                       text-accent-coral font-semibold
                       hover:text-white hover:bg-accent-coral 
                       dark:hover:bg-accent-coral 
                       transition-all duration-300"
          >
            View Resume
          </a>
        </div>
      </div>
    </section>
  );
}
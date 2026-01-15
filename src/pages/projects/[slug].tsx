import { useRouter } from 'next/router';
import Link from 'next/link';
import projects from '../../data/projects';

export default function ProjectPage() {
  const { query } = useRouter();
  const project = projects.find((p) => p.slug === query.slug);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl mx-auto">
      {/* Back button */}
      <Link 
        href="/#projects" 
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 
                   hover:text-primary-500 dark:hover:text-primary-400 
                   transition-colors mb-8"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </Link>

      {/* Project header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {project.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Technologies */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Technologies Used
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span 
              key={tech}
              className="px-3 py-1.5 rounded-full text-sm font-medium
                         bg-primary-50 dark:bg-primary-900/20 
                         text-primary-600 dark:text-primary-300
                         border border-primary-100 dark:border-primary-800/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold 
                       bg-gradient-to-r from-primary-500 to-primary-400 text-white 
                       shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-500 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Live Demo
          </a>
        ) : (
          <div className="inline-flex items-center px-6 py-3 rounded-lg 
                          bg-surface-light dark:bg-surface-dark-elevated text-gray-500 dark:text-gray-400">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demo coming soon
          </div>
        )}

        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg 
                       border-2 border-primary-500
                       font-semibold text-primary-600 dark:text-primary-300
                       bg-white/80 dark:bg-primary-500/10
                       hover:bg-primary-500 hover:border-primary-500 hover:text-white
                       dark:hover:bg-primary-400 dark:hover:text-gray-900 dark:hover:border-primary-400
                       transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" 
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View Repository
          </a>
        )}
      </div>
    </main>
  );
}
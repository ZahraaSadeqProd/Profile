import { useRouter } from 'next/router';
import projects from '../../data/projects';

export default function ProjectPage() {
  const { query } = useRouter();
  const project = projects.find((p) => p.slug === query.slug);

  if (!project) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading project details...
      </p>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {project.description}
      </p>

      <p className="text-sm text-gray-500 mb-8">
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          Technologies:
        </span>{' '}
        {project.tech.join(', ')}
      </p>

      <div className="flex gap-6 flex-wrap">
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-md font-semibold 
                       bg-accent-gradient text-black 
                       shadow hover:brightness-110 transition"
          >
           View Live Demo
          </a>
        ) : (
          <p className="text-gray-500 italic">Demo coming soon.</p>
        )}

        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-md 
                       border-2 border-accent-coral 
                       font-semibold text-accent-coral
                       hover:bg-accent-coral hover:text-white 
                       transition"
          >
           View Repository
          </a>
        )}
      </div>
    </main>
  );
}
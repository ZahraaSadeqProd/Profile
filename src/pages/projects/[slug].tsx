import { useRouter } from 'next/router';
import projects from '../../data/projects';

export default function ProjectPage() {
  const { query } = useRouter();
  const project = projects.find((p) => p.slug === query.slug);

  if (!project) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-700 mb-6">{project.description}</p>

      <p className="text-sm text-gray-500 mb-4">
        Technologies: {project.tech.join(', ')}
      </p>

      {project.demoUrl ? (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Live Demo
        </a>
      ) : (
        <p className="text-gray-500 italic">Demo coming soon.</p>
      )}
    </main>
  );
}
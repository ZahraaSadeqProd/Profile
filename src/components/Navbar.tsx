'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
        <nav
        className="flex justify-between items-center p-4 
                    border-b border-gray-200 dark:border-gray-700 
                    bg-gray-100 dark:bg-bgDark/70 
                    backdrop-blur-md sticky top-0 z-50"
        >
      {/* Left side: logo + name */}
<Link href="/" className="flex items-center gap-2 font-semibold text-lg">
  <Image
    src="/logo.svg"
    alt="Z logo"
    width={36}
    height={36}
    className="rounded [filter:drop-shadow(1px_1px_0px_rgba(0,0,0,0.45))] 
               dark:[filter:drop-shadow(1px_1px_0px_rgba(255,255,255,0.25))]"
  />

  <span
    className="bg-clip-text text-transparent bg-accent-gradient
               [text-shadow:_1px_1px_0px_rgba(0,0,0,0.45)]
               dark:[text-shadow:_1px_1px_0px_rgba(255,255,255,0.25)]"
  >
    Zahraa Sadeq
  </span>
</Link>

      {/* Right side: navigation links */}
      <div className="flex gap-4 items-center text-sm sm:text-base">
        <Link href="/#about" className="hover:text-accent-coral">
          About
        </Link>
        <Link href="/#projects" className="hover:text-accent-coral">
          Projects
        </Link>
        <Link href="/#contact" className="hover:text-accent-coral">
          Contact
        </Link>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="decoration-2 hover:text-accent-coral"
        >
          Resume
        </a>

        {/* Theme toggle button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
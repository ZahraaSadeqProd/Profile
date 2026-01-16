'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const navLinks = [
    { href: '/#about', label: 'About' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#contact', label: 'Contact' },
  ];

  // Theme toggle button component to avoid repetition
  const ThemeToggle = () => (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="relative rounded-full p-2 hover:bg-primary-50 dark:hover:bg-surface-dark-elevated 
                 transition-colors duration-200"
    >
      {mounted ? (
        resolvedTheme === 'dark' ? (
          <svg className="w-5 h-5 text-secondary-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )
      ) : (
        <div className="w-5 h-5" />
      )}
    </button>
  );

  return (
    <nav
      className="border-b border-primary-200/60 dark:border-gray-700/50 
                 bg-white/85 dark:bg-surface-dark/90 
                 backdrop-blur-md sticky top-0 z-50
                 shadow-sm shadow-primary-100/30 dark:shadow-none"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: logo + name */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <Image
              src="/logo.svg"
              alt="Z logo"
              width={36}
              height={36}
              className="rounded"
            />
            <span
              className="bg-clip-text text-transparent bg-accent-gradient
                         font-bold"
            >
              Zahraa Sadeq
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 
                           dark:hover:text-primary-400 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://drive.google.com/file/d/1aXriT1BCm5DMpi05Hcbj8HWuX7D7GeXx/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 
                         dark:hover:text-primary-400 transition-colors font-medium"
            >
              Resume
            </a>

            {/* Theme toggle button */}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="rounded-lg p-2 hover:bg-primary-50 dark:hover:bg-surface-dark-elevated transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/80 dark:border-gray-700/50 
                        bg-white dark:bg-surface-dark">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-gray-600 dark:text-gray-300 
                           hover:bg-primary-50 dark:hover:bg-surface-dark-elevated 
                           hover:text-primary-500 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://drive.google.com/file/d/1aXriT1BCm5DMpi05Hcbj8HWuX7D7GeXx/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-gray-600 dark:text-gray-300 
                         hover:bg-primary-50 dark:hover:bg-surface-dark-elevated 
                         hover:text-primary-500 transition-colors font-medium"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
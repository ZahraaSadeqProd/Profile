'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#about', label: 'About' },
    { href: '/#experience', label: 'Experience' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#contact', label: 'Contact' },
  ];

  // Theme toggle button component
  const ThemeToggle = () => (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="relative rounded-lg p-2.5 
                 hover:bg-gray-100 dark:hover:bg-slate-700
                 transition-colors duration-200"
    >
      {mounted ? (
        resolvedTheme === 'dark' ? (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
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
      className={`sticky top-0 z-50 transition-all duration-300
                 ${scrolled 
                   ? 'bg-white dark:bg-[#141219] shadow-lg border-b border-pink-200/50 dark:border-pink-700/30' 
                   : 'bg-transparent'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Image
                src="/logo.svg"
                alt="Z logo"
                width={36}
                height={36}
                className="rounded transition-all duration-300 group-hover:scale-110 filter drop-shadow-sm"
              />
            </div>
            <span className="text-gradient font-bold text-lg tracking-tight hidden sm:inline">
              Zahraa Sadeq
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium
                           text-gray-600 dark:text-gray-400 
                           hover:text-pink-600 dark:hover:text-pink-400
                           hover:bg-pink-50 dark:hover:bg-pink-900/10
                           transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://drive.google.com/file/d/1GWC3OAR8ZIWbXhyxW_b27A5-9GU8FHAj/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold
                         text-white bg-gradient-to-r from-pink-500 to-rose-500
                         hover:from-pink-600 hover:to-rose-600
                         shadow-md hover:shadow-lg
                         transition-all duration-200"
            >
              Resume
            </a>
            <div className="ml-2 border-l border-pink-200 dark:border-pink-700/30 pl-3">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="rounded-lg p-2 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors"
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
        <div className="md:hidden bg-white dark:bg-[#141219] border-t border-pink-200/50 dark:border-pink-700/30">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 rounded-lg text-gray-600 dark:text-gray-400 
                           hover:bg-pink-50 dark:hover:bg-pink-900/10 
                           hover:text-pink-700 dark:hover:text-pink-300
                           transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://drive.google.com/file/d/1GWC3OAR8ZIWbXhyxW_b27A5-9GU8FHAj/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 mt-2 rounded-lg text-center font-semibold
                         text-white bg-gradient-to-r from-pink-500 to-rose-500"
            >
              View Resume
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
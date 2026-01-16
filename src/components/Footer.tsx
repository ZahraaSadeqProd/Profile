export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-primary-200/60 dark:border-gray-700/50 
                       bg-gradient-to-r from-primary-50/50 via-white/80 to-tertiary-50/40
                       dark:from-surface-dark-elevated dark:via-surface-dark-elevated dark:to-surface-dark-elevated
                       mt-16 backdrop-blur-sm shadow-inner shadow-primary-50/50 dark:shadow-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left side - branding */}
          <div className="text-center sm:text-left">
            <p className="text-base font-bold bg-clip-text text-transparent bg-accent-gradient">
              Zahraa Sadeq
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Software Engineer • Fullstack Developer
            </p>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
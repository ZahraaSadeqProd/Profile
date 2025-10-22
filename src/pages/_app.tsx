import Head from 'next/head';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThemeProvider from '../components/ThemeProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <title>Zahraa Sadeq | Software Engineer</title>
      </Head>
      <div className="bg-bgLight text-textLight dark:bg-bgDark dark:text-textDark min-h-screen transition-colors duration-300">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
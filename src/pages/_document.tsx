import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="48x48" />
        <link rel="icon" href="/icon.svg?v=3" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
        <meta name="application-name" content="Zahraa Sadeq" />
        <meta name="author" content="Zahraa Sadeq" />
        <meta name="theme-color" content="#efe9dc" />
        <meta property="og:site_name" content="Zahraa Sadeq" />
        <meta property="og:type" content="website" />
        <link rel="preload" href="/fonts/geist-mono-500.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo.svg" />
        <meta name="application-name" content="Zahraa Sadeq" />
        <meta name="author" content="Zahraa Sadeq" />
        <meta
          name="description"
          content="Portfolio of Zahraa Sadeq – Software Engineer."
        />
        <meta name="theme-color" content="#f67f77" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
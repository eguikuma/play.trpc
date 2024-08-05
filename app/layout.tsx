import type { Metadata, Viewport } from "next";

import {
  ColorSchemeScript,
  createTheme,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";

import { TrpcProvider } from "@/providers";

import "../styles/globals.css";
import "@mantine/core/styles.css";

const theme = createTheme({
  fontFamily: "Verdana, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: { fontFamily: "Greycliff CF, sans-serif" },
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <TrpcProvider>
          <MantineProvider theme={theme} defaultColorScheme="light">
            {children}
          </MantineProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}

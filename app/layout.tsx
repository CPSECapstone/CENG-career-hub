import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const FigTree = Figtree({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CENG Career Hub",
  description: "A central hub for career opportunities for Cal Poly students",
};

/* The Root Layout for all pages will be defined here:
   may include a navbar, footer, etc. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={FigTree.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

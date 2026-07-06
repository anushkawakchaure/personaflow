import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import LayoutContent from "@/components/LayoutContent";
import CommandPalette from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "PersonaFlow | Ecommerce Personalization",
  description: "Classify shoppers in real‑time with a rules engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-bg text-text-primary antialiased transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <StoreProvider>
              <CommandPalette />
              <LayoutContent>{children}</LayoutContent>
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

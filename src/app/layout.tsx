import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import LayoutShell from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
  title: "ResPlug - Student Accommodation Marketplace",
  description:
    "Find your perfect student accommodation. Browse verified listings near your campus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}

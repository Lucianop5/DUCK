import type { Metadata } from "next";
import { Archivo, Doto } from "next/font/google";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const doto = Doto({
  subsets: ["latin"],
  variable: "--font-doto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DUCK — Cada gasto pequeño suma",
    template: "%s · DUCK",
  },
  description:
    "Anota tus gastos en segundos, ponle presupuesto a tus categorías y mira el mes completo sin planillas. Hecho en Chile, en pesos.",
  applicationName: "DUCK",
  authors: [{ name: "DUCK" }],
  openGraph: {
    title: "DUCK",
    description:
      "Los gastos pequeños, sumados, pesan. Anótalos en segundos y mira el mes completo sin planillas.",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("font-sans", archivo.variable, doto.variable)}
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

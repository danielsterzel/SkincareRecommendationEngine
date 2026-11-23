import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider/provider";
import { AppToaster } from "./components/AppToaster";
import { Plus_Jakarta_Sans } from 'next/font/google'


export const metadata: Metadata = {
  title: "Aurelia",
  description: "Skincare Optimized for you",
};


const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext']
})

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.className} h-full antialiased scroll-smooth`}>
      <body className="relative isolate flex min-h-full flex-col bg-offwhite text-charcoal">
        <Providers>
          {children}
          <AppToaster />
        </Providers>
      </body>
    </html>
  );
}
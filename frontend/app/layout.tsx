
import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Using Outfit for a modern look
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "College Notes Sharing",
  description: "Share and discover college resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
              <div className="container mx-auto">
                © {new Date().getFullYear()} CollegeNotes. Built for students.
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

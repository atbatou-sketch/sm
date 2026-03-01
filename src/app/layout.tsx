import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Management",
  description: "A complete student management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold">Student Management System</h1>
            <p className="text-blue-100">Manage your students efficiently</p>
          </div>
        </header>
        <main className="max-w-6xl mx-auto">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center mt-8">
          <p>&copy; 2026 Student Management System. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}

'use client';

import "./globals.css";
import StudentForm from '@/components/StudentForm';
import StudentList from '@/components/StudentList';

export default function Home() {
  return (
    <div className="py-8">
      <StudentForm onSuccess={() => {
        // Reload the page to refresh student list
        window.location.reload();
      }} />
      <StudentList />
    </div>
  );
}

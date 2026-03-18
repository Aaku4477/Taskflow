import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'TaskFlow — Task Management',
  description: 'A beautiful, efficient task management system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1d1f2b',
              color: '#e2e4ef',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#6172f5', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}

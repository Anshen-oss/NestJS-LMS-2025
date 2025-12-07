import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner'; // 👈 NOUVEAU
import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'LMS Platform',
  description: 'Learning Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <Providers>
          {children}
           <ShadcnToaster /> {/* Pour les anciens toasts Shadcn */}
            <SonnerToaster /> {/* 👈 NOUVEAU : Pour Sonner */}
        </Providers>
         </ThemeProvider>
      </body>
    </html>
  );
}

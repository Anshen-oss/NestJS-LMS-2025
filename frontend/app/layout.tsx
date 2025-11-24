import { ThemeProvider } from '@/components/ui/theme-provider';
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
        </Providers>
         </ThemeProvider>
      </body>
    </html>
  );
}

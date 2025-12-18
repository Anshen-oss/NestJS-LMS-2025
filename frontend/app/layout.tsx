import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
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
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#8b5cf6', // Purple
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          borderRadius: '0.5rem',
        },
        elements: {
          card: 'shadow-xl',
          formButtonPrimary: 'bg-purple-600 hover:bg-purple-700',
          footerActionLink: 'text-purple-600 hover:text-purple-700',
        },
      }}
       localization={{
        signIn: {
          start: {
            title: 'Connexion à Anshen LMS',
            subtitle: 'Bienvenue ! Connectez-vous pour continuer',
          },
        },
      }}
    >
       <html lang="fr" className="light">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
        <Providers>
          {children}
           <ShadcnToaster /> {/* Pour les anciens toasts Shadcn */}
            <SonnerToaster />
        </Providers>
         </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>

  );
}

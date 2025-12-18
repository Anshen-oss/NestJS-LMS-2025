import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/courses(.*)',
  '/api/webhook/clerk',
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  // Si l'utilisateur vient de s'inscrire et n'a pas de rôle
  if (userId && !sessionClaims?.metadata?.role && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth-redirect', request.url));
  }

  // Protéger les routes non publiques
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

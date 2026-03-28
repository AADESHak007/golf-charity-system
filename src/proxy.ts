import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  const pathname = request.nextUrl.pathname;
  logger.info(`Proxy: ${request.method} ${pathname}`, { hasUser: !!user });
  
  const protectedRoutes = ['/dashboard', '/api/auth/me', '/api/scores', '/api/draw', '/api/subscriptions'];
  const adminRoutes = ['/admin', '/api/admin'];
  const pricingRoute = '/pricing';

  const isAdminPath = adminRoutes.some(path => pathname.startsWith(path));
  const isProtectedPath = protectedRoutes.some(path => pathname.startsWith(path));
  const isPricingPath = pathname.startsWith(pricingRoute);

  // Fetch role for authenticated users to handle redirects
  let userRole: string | null = null;
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    userRole = userData?.role || null;
  }

  // 1. Admin Redirection Logic: Redirect Admins away from Player-only pages
  if (user && userRole === 'ADMIN') {
    if (isPricingPath || isProtectedPath) {
      if (isApiRoute) return response; // Allow API access but redirect UI
      // Don't redirect if it's an API route that might be shared (unlikely here but safe)
      if (!isApiRoute) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  // 2. Access Control: Protect Admin routes
  if (isAdminPath) {
    if (!user) {
      if (isApiRoute) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    if (userRole !== 'ADMIN') {
      if (isApiRoute) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 3. Access Control: Protect Player routes
  if (!user && isProtectedPath) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

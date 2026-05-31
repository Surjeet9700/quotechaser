 
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  
  if (!supabaseResponse) {
    return NextResponse.next({ request });
  }

  const { pathname } = request.nextUrl;
  
  // Protect routes starting with /dashboard, /quotes, /templates, /settings, /quote
  const protectedRoutes = [
    "/dashboard",
    "/quotes",
    "/templates",
    "/settings",
    "/quote",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    // Redirect unauthenticated users trying to access protected routes to login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Optionally redirect authenticated users away from /login
  if (pathname.startsWith("/login") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Verificar se o usuário está autenticado
  const isAuthenticated = request.cookies.has("ancora_auth")
  const url = request.nextUrl.clone()

  // Rotas protegidas que requerem autenticação
  const protectedRoutes = ["/dashboard"]

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ["/auth/login"]

  // Verificar se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some(
    (route) => url.pathname === route || url.pathname.startsWith(`${route}/`),
  )

  // Verificar se a rota atual é pública
  const isPublicRoute = publicRoutes.some((route) => url.pathname === route || url.pathname.startsWith(`${route}/`))

  // Redirecionar para login se tentar acessar rota protegida sem autenticação
  if (isProtectedRoute && !isAuthenticated) {
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Redirecionar para dashboard se tentar acessar rota pública já estando autenticado
  if (isPublicRoute && isAuthenticated) {
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Rotas que o middleware deve verificar
    "/dashboard/:path*",
    "/auth/:path*",
  ],
}

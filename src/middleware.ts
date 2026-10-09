import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renova a sessão do Supabase e protege /app e /admin.
 *
 * Roda SÓ nas rotas da plataforma (veja `matcher` no fim). A landing não
 * passa por aqui, então continua estática e rápida.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next(); // Supabase ainda não configurado

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  // Importante: chamar logo no início, antes de qualquer outra lógica.
  const { data } = await supabase.auth.getClaims();
  const logado = Boolean(data?.claims?.sub);

  const { pathname, search } = request.nextUrl;
  const protegida = pathname === "/app" || pathname.startsWith("/app/") ||
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (protegida && !logado) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/entrar";
    destino.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(destino);
  }

  if (pathname === "/entrar" && logado) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/app";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/entrar", "/definir-senha", "/sem-acesso"],
};

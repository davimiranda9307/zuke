"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/admin", rotulo: "Visão geral" },
  { href: "/admin/lojas", rotulo: "Lojas" },
  { href: "/admin/membros", rotulo: "Membros" },
  { href: "/admin/webhooks", rotulo: "Webhooks" },
  { href: "/admin/feedbacks", rotulo: "Feedbacks" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none]">
      {ITENS.map((item) => {
        const ativo = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
              ativo ? "bg-fg text-bg" : "text-muted hover:text-fg"
            }`}
          >
            {item.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}

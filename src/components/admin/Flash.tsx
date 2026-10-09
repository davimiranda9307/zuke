/** Mensagem de resultado das ações do admin (vem em ?ok= ou ?erro= na URL). */
export function Flash({ ok, erro }: { ok?: string; erro?: string }) {
  if (erro) return <p className="alert-erro" role="alert">{erro}</p>;
  if (ok) return <p className="alert-ok" role="status">{ok}</p>;
  return null;
}

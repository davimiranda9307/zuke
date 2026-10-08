/**
 * Números de autoridade da curadoria (ex.: lojas visitadas, fornecedores
 * conferidos, faixas cobertas).
 *
 * ESCONDIDA DE PROPÓSITO até você ter números REAIS. Nada de inventar.
 * Preencha o array abaixo e a faixa de números aparece sozinha (fundo escuro).
 */
type Stat = { value: string; label: string };

const stats: Stat[] = [
  // { value: "+300", label: "lojas visitadas no Brás" },
  // { value: "10", label: "faixas de preço cobertas" },
  // { value: "100%", label: "da curadoria conferida de perto" },
];

export function AuthorityStats() {
  if (stats.length === 0) return null;

  return (
    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-bg/10 bg-bg/5 p-5 text-center"
        >
          <p className="font-display text-3xl font-extrabold text-accent sm:text-4xl">
            {stat.value}
          </p>
          <p className="mt-1 text-sm text-bg/60">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

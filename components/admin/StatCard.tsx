interface StatCardProps {
  label: string;
  value: number;
  accent?: boolean;
}

export default function StatCard({ label, value, accent = false }: StatCardProps) {
  return (
    <div className="bg-white border border-stone-grey/20 rounded-lg px-5 py-4">
      <p className="font-body text-xs uppercase tracking-wide text-text-soft/70 mb-1">{label}</p>
      <p className={`font-display text-3xl ${accent ? "text-brick-red" : "text-charcoal-roof"}`}>
        {value}
      </p>
    </div>
  );
}

export default function InsuranceStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon size={18} className="text-primary" />
          </div>
          <div>
            <p className="md:text-base text-[14px] font-bold text-text leading-tight">{value}</p>
            <p className="md:text-xs text-[10px] text-text-soft">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

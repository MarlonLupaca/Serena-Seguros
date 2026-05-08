'use client';

export default function PlaceholderPendiente({ titulo, descripcion, icon: Icon }) {
  return (
    <div className="py-12 flex flex-col items-center text-center gap-3 px-6">
      <div className="w-16 h-16 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
        {Icon ? <Icon size={32} className="text-text-soft" /> : null}
      </div>
      <p className="text-base font-bold text-text">{titulo}</p>
      <p className="text-sm text-text-soft max-w-md leading-relaxed">
        {descripcion ||
          'Esta vista está prevista para una fase posterior. La base de datos aún no tiene la tabla correspondiente, por lo que el módulo se queda como UI pendiente de conectar.'}
      </p>
    </div>
  );
}

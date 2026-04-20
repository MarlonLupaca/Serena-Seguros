import { MdKeyboardArrowDown, MdCheck } from 'react-icons/md';

export default function InsuranceTabs({ activeTab, setActiveTab, dropdownOpen, setDropdownOpen, allTabs }) {
  return (
    <div className="relative">
      {/* Desktop: scroll horizontal */}
      <div className="hidden lg:flex gap-2 overflow-x-hidden pb-1">
        {allTabs.map((s) => {
          const active = activeTab === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`text-[12px] flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold transition-all whitespace-nowrap border ${
                active
                  ? s.accentBg
                    ? `${s.accentBg} ${s.accentText} border-transparent`
                    : 'bg-primary/10 text-primary border-transparent'
                  : 'bg-transparent border-border text-text-soft hover:text-text'
              }`}
            >
              {Icon && <Icon size={14} />}
              {s.tab}
            </button>
          );
        })}
      </div>

      {/* Móvil: 3 tabs visibles + botón "Más" */}
      <div className="lg:hidden flex gap-2">
        {allTabs.slice(0, 3).map((s) => {
          const active = activeTab === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap border ${
                active
                  ? s.accentBg
                    ? `${s.accentBg} ${s.accentText} border-transparent`
                    : 'bg-primary/10 text-primary border-transparent'
                  : 'bg-transparent border-border text-text-soft hover:text-text'
              }`}
            >
              {Icon && <Icon size={14} />}
              {s.tab}
            </button>
          );
        })}

        {/* Botón "Más" */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap border ${
              allTabs.slice(3).some((s) => s.id === activeTab)
                ? 'bg-primary/10 text-primary border-transparent'
                : 'bg-transparent border-border text-text-soft hover:text-text'
            }`}
          >
            {allTabs.slice(3).some((s) => s.id === activeTab) ? allTabs.find((s) => s.id === activeTab)?.tab : 'Más'}
            <MdKeyboardArrowDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-2 left-[-110%] bg-bg border border-border rounded-2xl overflow-hidden z-50 shadow-lg min-w-40">
              {allTabs.slice(3).map((s) => {
                const active = activeTab === s.id;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveTab(s.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors border-b border-border last:border-0 ${
                      active ? `${s.accentText ?? 'text-primary'} bg-primary/5` : 'text-text-soft hover:bg-bg-soft'
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    {s.tab}
                    {active && <MdCheck size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

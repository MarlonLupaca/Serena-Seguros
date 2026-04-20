'use client';

import { useState } from 'react';
import { seguros, ALL_TABS, stats } from './data';
import SeguroCard from './SeguroCard';
import InsuranceStats from './InsuranceStats';
import InsuranceTabs from './InsuranceTabs';
import InsuranceCTA from './InsuranceCTA';

export default function VerSeguros() {
  const [activeTab, setActiveTab] = useState('todos');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = activeTab === 'todos' ? seguros : seguros.filter((s) => s.id === activeTab);

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      {/* Header */}
      <div className="py-5">
        <p className="text-xl font-bold text-text">Ver seguros</p>
        <p className="text-sm text-balance text-text-soft mt-0.5">
          Explora nuestros planes, compara coberturas y cotiza en minutos.
        </p>
      </div>

      <div className="flex-1 w-full py-8 flex flex-col gap-8">
        {/* Stats */}
        <InsuranceStats stats={stats} />

        {/* Tabs */}
        <InsuranceTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          allTabs={ALL_TABS}
        />

        {/* Grid de cards */}
        <div
          className={`grid gap-5 ${filtered.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}
        >
          {filtered.map((s) => (
            <SeguroCard key={s.id} seguro={s} />
          ))}
        </div>

        {/* CTA asesor */}
        <InsuranceCTA />
      </div>
    </div>
  );
}

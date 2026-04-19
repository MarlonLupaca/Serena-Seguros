import AppHeaderAdmin from './componentsAdmin/AppHeaderAdmin';
import SidebarAdmin from './componentsAdmin/SidebarAdmin';

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR */}
      <div className="p-3 h-screen">
        <SidebarAdmin />
      </div>

      {/* CONTENIDO */}
      <main className="w-full overflow-y-auto">
        <AppHeaderAdmin />
        {children}
      </main>
    </div>
  );
}

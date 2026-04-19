import AppHeaderAdmin from './componentsAdmin/AppHeaderAdmin';
import SidebarAdmin from './componentsAdmin/SidebarAdmin';

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR */}
      <div className="h-screen lg:p-3">
        <SidebarAdmin />
      </div>

      {/* CONTENIDO */}
      <main className="w-full overflow-y-auto">
        <AppHeaderAdmin />
        <div className="px-8">{children}</div>
      </main>
    </div>
  );
}

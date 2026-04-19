import AppHeaderEmployee from './componentsEmployee/AppHeaderEmployee';
import SidebarEmployee from './componentsEmployee/SidebarEmployee';

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR */}
      <div className="p-3 h-screen">
        <SidebarEmployee />
      </div>

      {/* CONTENIDO */}
      <main className="w-full overflow-y-auto">
        <AppHeaderEmployee />
        <div className="px-8">{children}</div>
      </main>
    </div>
  );
}

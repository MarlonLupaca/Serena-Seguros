import AppHeader from './componentsClient/AppHeader';
import Sidebar from './componentsClient/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR */}
      <div className="p-3 h-screen">
        <Sidebar />
      </div>

      {/* CONTENIDO */}
      <main className="w-full overflow-y-auto">
        <AppHeader />
        {children}
      </main>
    </div>
  );
}

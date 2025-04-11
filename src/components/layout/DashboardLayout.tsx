
import { NavbarAvatar } from "@/components/Navbar";  
import { Sidebar } from "@/components/Sidebar"; 

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Client Chronicle</h1>
          <div className="flex items-center">
            <NavbarAvatar />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

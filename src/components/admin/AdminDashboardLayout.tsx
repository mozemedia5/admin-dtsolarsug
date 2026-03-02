import { useState, useEffect } from 'react';
import { logout, onAuthStateChange, getAdminUser, type AdminUser } from '@/lib/authService';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  MessageSquare, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

export default function AdminDashboardLayout({ 
  children, 
  currentPage, 
  onPageChange,
  onLogout 
}: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const admin = await getAdminUser(user.uid);
        setAdminUser(admin);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
    { name: 'Products', icon: Package, page: 'products' },
    { name: 'Promotions', icon: Tag, page: 'promotions' },
    { name: 'Reviews', icon: MessageSquare, page: 'reviews' },
  ];

  // Only show admin management for super admin
  if (adminUser?.role === 'super_admin') {
    navigation.push({ name: 'Admin Users', icon: Users, page: 'admins' });
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-300"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </Button>
            <h1 className="text-xl font-bold text-white">DT Solars Admin</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{adminUser?.displayName}</p>
              <p className="text-xs text-slate-400 capitalize">{adminUser?.role?.replace('_', ' ')}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="p-4 space-y-2 mt-16 lg:mt-0">
            {navigation.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onPageChange(item.page);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  currentPage === item.page
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

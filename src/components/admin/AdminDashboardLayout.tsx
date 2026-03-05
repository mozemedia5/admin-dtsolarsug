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
  X,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const admin = await getAdminUser(user.uid);
        setAdminUser(admin);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
    { name: 'Products', icon: Package, page: 'products' },
    { name: 'Promotions', icon: Tag, page: 'promotions' },
    { name: 'Reviews', icon: MessageSquare, page: 'reviews' },
    { name: 'Pre-Orders', icon: ShoppingCart, page: 'pre-orders' },
  ];

  // Only show admin management for super admin
  if (adminUser?.isSuperAdmin) {
    navigation.push({ name: 'Admin Users', icon: Users, page: 'admins' });
  }

  const adminRole = adminUser?.isSuperAdmin ? 'Super Administrator' : 'Administrator';

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
            {/* Admin name — visible on ALL screen sizes */}
            <div className="text-right">
              <p className="text-sm font-medium text-white leading-tight">
                {adminUser?.name || 'Admin'}
              </p>
              <p className="text-xs text-slate-400 leading-tight hidden sm:block">{adminRole}</p>
              {/* Role shown on mobile as a small badge under the name */}
              <p className="text-[10px] text-orange-400 leading-tight sm:hidden font-medium">
                {adminUser?.isSuperAdmin ? 'Super Admin' : 'Admin'}
              </p>
            </div>

            {/* Avatar circle with initial */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {(adminUser?.name || 'A').charAt(0).toUpperCase()}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLogoutDialogOpen(true)}
              className="text-slate-300 hover:text-white hover:bg-red-900/30 px-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
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
          {/* Mobile sidebar header showing user info */}
          <div className="lg:hidden px-4 py-4 border-b border-slate-800 mt-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                {(adminUser?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{adminUser?.name || 'Admin'}</p>
                <p className="text-xs text-orange-400">{adminRole}</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2 lg:mt-0">
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

            {/* Mobile logout button inside sidebar */}
            <div className="pt-4 border-t border-slate-800 lg:hidden">
              <button
                onClick={() => { setSidebarOpen(false); setLogoutDialogOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
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
        <main className="flex-1 p-6 min-w-0">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-1">
              Are you sure you want to log out of the admin panel?
            </DialogDescription>
          </DialogHeader>

          {/* Admin info in dialog */}
          <div className="flex items-center gap-3 bg-slate-800/60 rounded-lg p-3 my-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {(adminUser?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{adminUser?.name || 'Admin'}</p>
              <p className="text-xs text-orange-400">{adminRole}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={() => setLogoutDialogOpen(false)}
              disabled={loggingOut}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogoutConfirm}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging out...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Yes, Logout
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

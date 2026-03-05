import { useState, useEffect } from 'react';
import { onAuthStateChange } from '@/lib/authService';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminPromotions from '@/pages/AdminPromotions';
import AdminReviews from '@/pages/AdminReviews';
import AdminUsers from '@/pages/AdminUsers';
import AdminPreOrders from '@/pages/AdminPreOrders';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import { Loader2 } from 'lucide-react';

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'promotions':
        return <AdminPromotions />;
      case 'reviews':
        return <AdminReviews />;
      case 'pre-orders':
        return <AdminPreOrders />;
      case 'admins':
        return <AdminUsers />;
      default:
        return <AdminDashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminDashboardLayout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminDashboardLayout>
  );
}

export default AdminApp;

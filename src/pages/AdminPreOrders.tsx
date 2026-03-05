import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { getAdminUser } from '@/lib/authService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Loader2,
  MapPin,
  Phone,
  User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { branches } from '@/data/branches';
import type { PreOrder } from '@/types';

export default function AdminPreOrders() {
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminBranch, setAdminBranch] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const adminData = await getAdminUser(user.uid);
      if (adminData) {
        setAdminBranch(adminData.branch || null);
        setIsSuperAdmin(adminData.isSuperAdmin);
        loadOrders(adminData.isSuperAdmin ? null : adminData.branch || null);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setLoading(false);
    }
  };

  const loadOrders = async (branchId: string | null) => {
    setLoading(true);
    try {
      let q;
      if (branchId) {
        q = query(
          collection(db, 'preorders'),
          where('branchId', '==', branchId),
          orderBy('date', 'desc')
        );
      } else {
        q = query(
          collection(db, 'preorders'),
          orderBy('date', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PreOrder));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: PreOrder['status']) => {
    try {
      await updateDoc(doc(db, 'preorders', orderId), {
        status: newStatus
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone.includes(searchTerm) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: PreOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'ready': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Pre-Order Management</h2>
          <p className="text-slate-400">
            {isSuperAdmin 
              ? 'Viewing all orders across all branches' 
              : `Viewing orders for ${branches.find(b => b.id === adminBranch)?.name || 'your branch'}`
            }
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by name, phone or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <Package className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-bold">{order.productName}</h3>
                          <Badge variant="outline" className="text-xs text-slate-400">
                            Qty: {order.quantity}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">Order ID: {order.id} • {new Date(order.date).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <User className="w-4 h-4 text-slate-500" />
                        {order.customerName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Phone className="w-4 h-4 text-slate-500" />
                        {order.customerPhone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {branches.find(b => b.id === order.branchId)?.name || order.branchId}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Badge className={`${getStatusColor(order.status)} border px-3 py-1 capitalize flex items-center gap-1.5`}>
                      {order.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      {order.status === 'ready' && <Package className="w-3.5 h-3.5" />}
                      {order.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {order.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                      {order.status}
                    </Badge>

                    <div className="flex items-center gap-2">
                      {order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateStatus(order.id, 'ready')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateStatus(order.id, 'completed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Complete
                        </Button>
                      )}
                      {(order.status === 'pending' || order.status === 'ready') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          className="border-red-900/50 text-red-400 hover:bg-red-950/30"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
            <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No pre-orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

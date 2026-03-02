import { useCallback } from 'react';
import type { PreOrder } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function usePreOrders() {
  const [preOrders, setPreOrders] = useLocalStorage<PreOrder[]>('dt-preorders', []);

  const addPreOrder = useCallback((preOrder: Omit<PreOrder, 'id' | 'date' | 'status'>) => {
    const newPreOrder: PreOrder = {
      ...preOrder,
      id: `PO-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'pending'
    };
    setPreOrders(prev => [newPreOrder, ...prev]);
    return newPreOrder;
  }, [setPreOrders]);

  const updatePreOrderStatus = useCallback((id: string, status: PreOrder['status']) => {
    setPreOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status } : order
      )
    );
  }, [setPreOrders]);

  const getPreOrdersByBranch = useCallback((branchId: string) => {
    return preOrders.filter(order => order.branchId === branchId);
  }, [preOrders]);

  const getPreOrdersByPhone = useCallback((phone: string) => {
    return preOrders.filter(order => order.customerPhone === phone);
  }, [preOrders]);

  return {
    preOrders,
    addPreOrder,
    updatePreOrderStatus,
    getPreOrdersByBranch,
    getPreOrdersByPhone
  };
}

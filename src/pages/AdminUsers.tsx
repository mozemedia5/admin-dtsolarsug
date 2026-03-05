import { useState, useEffect } from 'react';
import { getAllAdmins, createAdminUser, updateAdminStatus, type AdminUser } from '@/lib/authService';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Shield, ShieldOff, Users, Loader2, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { branches } from '@/data/branches';

export default function AdminUsers() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    branch: 'nansana'
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await getAllAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Error loading admins:', error);
      setError('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Not authenticated');

      await createAdminUser(
        formData.email,
        formData.password,
        formData.name,
        formData.branch,
        currentUser.uid
      );

      setSuccess('Admin user created successfully');
      await loadAdmins();
      resetForm();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create admin user');
    }
  };

  const handleToggleStatus = async (uid: string, currentStatus: boolean) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Not authenticated');

      await updateAdminStatus(uid, !currentStatus, currentUser.uid);
      await loadAdmins();
      setSuccess(`Admin user ${!currentStatus ? 'activated' : 'deactivated'}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      branch: 'nansana'
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin User Management</h2>
          <p className="text-slate-400">Manage administrator accounts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Administrator</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-slate-300">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-slate-300">Email Address</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

                <div>
                  <Label className="text-slate-300">Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                </div>

                <div>
                  <Label className="text-slate-300">Assigned Branch</Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(value) => setFormData({ ...formData, branch: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id} className="text-white">
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                  className="border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  Create Admin
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-950/50 border-red-900">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-950/50 border-green-900">
          <AlertDescription className="text-green-400">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <Card key={admin.uid} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    admin.isSuperAdmin
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-br from-orange-500 to-amber-500'
                  }`}>
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{admin.name}</CardTitle>
                    <p className="text-sm text-slate-400">{admin.email}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Role:</span>
                  <Badge 
                    variant="outline" 
                    className={admin.isSuperAdmin ? 'border-purple-500 text-purple-400' : ''}
                  >
                    {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Branch:</span>
                  <div className="flex items-center gap-1 text-slate-300 text-sm">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    {branches.find(b => b.id === admin.branch)?.name || 'Not assigned'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Status:</span>
                  {admin.isActiveAdmin ? (
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400">Inactive</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Created:</span>
                  <span className="text-slate-300 text-sm">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {!admin.isSuperAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(admin.uid, admin.isActiveAdmin)}
                    className="w-full mt-2 border-slate-700"
                  >
                    {admin.isActiveAdmin ? (
                      <>
                        <ShieldOff className="w-4 h-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {admins.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No admin users</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

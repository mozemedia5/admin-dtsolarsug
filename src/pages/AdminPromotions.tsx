import { useState, useEffect } from 'react';
import { 
  getAllPromotions, 
  createPromotion, 
  updatePromotion, 
  deletePromotion
} from '@/lib/dataService';
import type { Promotion } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Tag, Loader2, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageInput } from '@/components/admin/ImageInput';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    discount: '',
    validUntil: '',
    code: ''
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (error) {
      console.error('Error loading promotions:', error);
      setError('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, formData);
        setSuccess('Promotion updated successfully');
      } else {
        await createPromotion(formData);
        setSuccess('Promotion created successfully');
      }

      await loadPromotions();
      resetForm();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      image: promotion.image,
      discount: promotion.discount,
      validUntil: promotion.validUntil,
      code: promotion.code || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      await deletePromotion(id);
      await loadPromotions();
      setSuccess('Promotion deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      discount: '',
      validUntil: '',
      code: ''
    });
  };

  const isActive = (validUntil: string) => {
    return new Date(validUntil) > new Date();
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
          <h2 className="text-3xl font-bold text-white mb-2">Promotion Management</h2>
          <p className="text-slate-400">Manage banners and special offers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-slate-300">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., Summer Sale"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    rows={3}
                    placeholder="Enter promotion details..."
                    required
                  />
                </div>

                <div className="col-span-2">
                  <ImageInput
                    value={formData.image}
                    onChange={(value) => setFormData({ ...formData, image: value })}
                    label="Banner Image"
                    placeholder="https://example.com/banner.jpg or /images/banner.jpg"
                    required
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Discount Label</Label>
                  <Input
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., 15% OFF"
                    required
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Promo Code</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., PROMO15"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-slate-300">Valid Until</Label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
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
                  {editingPromotion ? 'Update' : 'Create'} Promotion
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
        {promotions.map((promotion) => (
          <Card key={promotion.id} className="bg-slate-900 border-slate-800 overflow-hidden">
            <div className="aspect-[21/9] w-full bg-slate-800 relative">
              <img 
                src={promotion.image} 
                alt={promotion.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x340?text=Promotion+Banner';
                }}
              />
              <div className="absolute top-2 right-2">
                {isActive(promotion.validUntil) ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Expired</Badge>
                )}
              </div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-white text-lg">{promotion.title}</CardTitle>
                <span className="text-orange-500 font-bold">{promotion.discount}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{promotion.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Code:
                  </span>
                  <Badge variant="outline" className="font-mono border-slate-700 text-slate-300">{promotion.code}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Valid Until:
                  </span>
                  <span className="text-slate-300">{new Date(promotion.validUntil).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(promotion)}
                  className="flex-1 border-slate-700 text-slate-300"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(promotion.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {promotions.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Tag className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No promotions yet</p>
            <p className="text-slate-500 text-sm">Create your first promotion to attract customers</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

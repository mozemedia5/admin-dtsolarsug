import { useState, useEffect, useRef } from 'react';
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadProductImage
} from '@/lib/dataService';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, Loader2, Star, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageInput } from '@/components/admin/ImageInput';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    inStock: true,
    features: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  // Auto-dismiss success after 4s
  useEffect(() => {
    if (success) {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(''), 4000);
    }
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, [success]);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Converts a base64 data URL to a Firebase Storage URL.
   * If the value is already an HTTPS URL, returns it unchanged (no re-upload needed).
   */
  const resolveImageUrl = async (imageValue: string, productId: string): Promise<string> => {
    if (!imageValue) return '';
    // Already an uploaded URL — return as-is (fast path, no upload needed)
    if (imageValue.startsWith('http')) return imageValue;
    // base64 / data URL — upload to Firebase Storage
    if (imageValue.startsWith('data:')) {
      const blob = await (await fetch(imageValue)).blob();
      const ext = blob.type === 'image/png' ? 'png' : 'jpg';
      const file = new File([blob], `product-${productId}-${Date.now()}.${ext}`, { type: blob.type });
      return await uploadProductImage(file, productId);
    }
    return imageValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.image) {
      setError('Please upload a product image.');
      return;
    }
    if (!formData.category) {
      setError('Please select a category.');
      return;
    }

    setSubmitting(true);
    try {
      // For existing products keep the same id; for new ones create a temp placeholder
      const storageId = editingProduct?.id || `new-${Date.now()}`;
      const imageUrl = await resolveImageUrl(formData.image, storageId);

      const productData: Omit<Product, 'id'> & { rating?: number; reviews?: number } = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category as Product['category'],
        image: imageUrl,
        images: [imageUrl],
        inStock: formData.inStock,
        features: formData.features
          .split('\n')
          .map(f => f.trim())
          .filter(f => f.length > 0),
        rating: editingProduct?.rating ?? 0,
        reviews: editingProduct?.reviews ?? 0,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        // Optimistic update — update local state immediately
        setProducts(prev =>
          prev.map(p => p.id === editingProduct.id ? { ...p, ...productData, id: editingProduct.id } : p)
        );
        setSuccess('✅ Product updated successfully!');
      } else {
        const newId = await createProduct(productData);
        // Append new product to local state immediately (no full reload)
        setProducts(prev => [...prev, { ...productData, id: newId }]);
        setSuccess('✅ Product created successfully!');
      }

      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Product save error:', err);
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      inStock: product.inStock,
      features: product.features?.join('\n') || ''
    });
    setError('');
    setSuccess('');
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      await deleteProduct(id);
      // Optimistic remove from local state
      setProducts(prev => prev.filter(p => p.id !== id));
      setSuccess('✅ Product deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setError('');
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      inStock: true,
      features: ''
    });
  };

  const categories = [
    { value: 'solar-kits', label: 'Solar Kits' },
    { value: 'batteries-inverters', label: 'Batteries & Inverters' },
    { value: 'cctv-cameras', label: 'CCTV Cameras' },
    { value: 'water-pumps', label: 'Water Pumps & Heaters' },
    { value: 'home-electronics', label: 'Home Electronics' }
  ];

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
          <h2 className="text-3xl font-bold text-white mb-2">Product Management</h2>
          <p className="text-slate-400">Manage your product catalog ({products.length} products)</p>
        </div>
        <Button
          onClick={() => { resetForm(); setDialogOpen(true); }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Product Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-900">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-slate-300">Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="e.g., 5KW Solar Kit"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label className="text-slate-300">Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  rows={3}
                  placeholder="Describe the product..."
                  required
                />
              </div>

              <div>
                <Label className="text-slate-300">Price (UGX) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="e.g., 1500000"
                  required
                />
              </div>

              <div>
                <Label className="text-slate-300">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <ImageInput
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  label="Product Image *"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-slate-300">Features (one per line)</Label>
                <Textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 accent-orange-500"
                />
                <Label htmlFor="inStock" className="text-slate-300 cursor-pointer">In Stock</Label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setDialogOpen(false); resetForm(); }}
                disabled={submitting}
                className="border-slate-700 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white min-w-[140px]"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  editingProduct ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {error && !dialogOpen && (
        <Alert variant="destructive" className="bg-red-950/50 border-red-900">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-2 text-red-300 hover:text-white"><X className="w-4 h-4" /></button>
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-950/50 border-green-900">
          <AlertDescription className="text-green-400 flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="ml-2 text-green-300 hover:text-white"><X className="w-4 h-4" /></button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="bg-slate-900 border-slate-800 overflow-hidden">
            <div className="aspect-video w-full bg-slate-800 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const currentSrc = target.src;
                  if (!currentSrc.includes('weserv.nl') && product.image && product.image.startsWith('http')) {
                    target.src = `https://images.weserv.nl/?url=${encodeURIComponent(product.image)}&output=jpg&q=80`;
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
              <div className="absolute top-2 right-2">
                {product.inStock ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">In Stock</Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Out of Stock</Badge>
                )}
              </div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-slate-500 capitalize">{product.category.replace('-', ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-bold">UGX {product.price.toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm line-clamp-2 mb-4">{product.description}</p>

              {(product.reviews !== undefined && product.reviews > 0) && (
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{product.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="text-slate-500">
                    {product.reviews} reviews
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                  className="flex-1 border-slate-700 text-slate-300 hover:border-orange-500/50 hover:text-orange-400"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
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

      {products.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No products found</p>
            <p className="text-slate-500 text-sm">Add your first product to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

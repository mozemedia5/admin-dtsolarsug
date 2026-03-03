import { useState, useEffect } from 'react';
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct
} from '@/lib/dataService';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, Loader2, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageInput } from '@/components/admin/ImageInput';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const productData: any = {
        ...formData,
        price: Number(formData.price),
        features: formData.features.split('\n').filter(f => f.trim()),
        images: [formData.image]
      };

      if (editingProduct) {
        // Keep existing rating and reviews when editing (managed by customer reviews)
        if (editingProduct.rating !== undefined) {
          productData.rating = editingProduct.rating;
        }
        if (editingProduct.reviews !== undefined) {
          productData.reviews = editingProduct.reviews;
        }
        await updateProduct(editingProduct.id, productData);
        setSuccess('Product updated successfully');
      } else {
        // Initialize rating and reviews for new products (will be updated by customer reviews)
        productData.rating = 0;
        productData.reviews = 0;
        await createProduct(productData);
        setSuccess('Product created successfully');
      }

      await loadProducts();
      resetForm();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
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
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      await loadProducts();
      setSuccess('Product deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
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
          <p className="text-slate-400">Manage your product catalog</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-slate-300">Product Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
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
                    required
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Price (UGX)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
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
                    label="Product Image"
                    placeholder="https://example.com/image.jpg or /images/product.jpg"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-slate-300">Features (one per line)</Label>
                  <Textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
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
                    className="w-4 h-4"
                  />
                  <Label htmlFor="inStock" className="text-slate-300">In Stock</Label>
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
                  {editingProduct ? 'Update' : 'Create'} Product
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
        {products.map((product) => (
          <Card key={product.id} className="bg-slate-900 border-slate-800 overflow-hidden">
            <div className="aspect-video w-full bg-slate-800 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Image';
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
              
              {(product.rating !== undefined && product.reviews !== undefined && product.reviews > 0) && (
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{product.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="text-slate-500">
                    {product.reviews || 0} reviews
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                  className="flex-1 border-slate-700 text-slate-300"
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

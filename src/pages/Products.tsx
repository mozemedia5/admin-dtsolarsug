import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Heart, 
  ShoppingCart,
  X,
  Sun,
  Shield,
  Droplets,
  Zap,
  Battery,
  Share2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useProducts, categoryLabels } from '@/hooks/useFirebaseData';
import type { Product } from '@/types';
import { ProductImage } from '@/components/shared/ProductImage';

interface ProductsProps {
  onPageChange: (page: string) => void;
}

const categories = [
  { id: 'all', label: 'All Products', icon: ShoppingCart },
  { id: 'solar-kits', label: 'Solar Kits', icon: Sun },
  { id: 'batteries-inverters', label: 'Batteries & Inverters', icon: Battery },
  { id: 'cctv-cameras', label: 'CCTV Cameras', icon: Shield },
  { id: 'water-pumps', label: 'Water Pumps', icon: Droplets },
  { id: 'home-electronics', label: 'Home Electronics', icon: Zap }
];

/**
 * Share a product using the Web Share API (native OS share sheet).
 * Falls back to copying the link if Web Share API is not available.
 */
async function shareProduct(product: Product): Promise<'shared' | 'copied' | 'error'> {
  const url = `${window.location.origin}${window.location.pathname}?product=${encodeURIComponent(product.id)}`;
  const shareData: ShareData = {
    title: `${product.name} — DT Solars Uganda`,
    text: `Check out this product: ${product.name}\n💰 UGX ${product.price.toLocaleString()}\n\n${product.description.slice(0, 120)}...`,
    url,
  };

  // Use native Web Share API if available (mobile Safari, Chrome for Android, etc.)
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return 'shared';
    } catch (err: any) {
      // User cancelled share — not an error
      if (err?.name === 'AbortError') return 'shared';
      return 'error';
    }
  }

  // Fallback: copy link to clipboard
  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    // Last resort: execCommand
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return 'copied';
  }
}

export function Products({ onPageChange }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [sharedProductId, setSharedProductId] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string>('');
  
  // Fetch products from Firebase
  const { products, loading, error } = useProducts();

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleShare = async (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSharedProductId(product.id);
    const result = await shareProduct(product);
    if (result === 'copied') {
      setShareFeedback('Link copied to clipboard!');
      setTimeout(() => {
        setSharedProductId(null);
        setShareFeedback('');
      }, 2500);
    } else {
      setTimeout(() => setSharedProductId(null), 1500);
    }
  };

  const formatPrice = (price: number) => {
    return `UGX ${price.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 pb-6">
        <div className="container mx-auto px-4 pt-6">
          <h1 className="text-2xl font-bold text-white mb-2">Our Products</h1>
          <p className="text-slate-400 text-sm">
            Browse our wide range of solar systems, CCTV cameras, and home electronics
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-lg mb-6">
            {error}. Please try again later.
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center text-slate-400 py-12">
            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading products...</p>
          </div>
        )}

        {/* Content - only show when not loading */}
        {!loading && (
          <>
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          
          {/* Mobile Category Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-slate-700 text-slate-300 sm:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-slate-900 border-slate-800">
              <SheetHeader>
                <SheetTitle className="text-white">Filter by Category</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Category Pills */}
        <div className="hidden sm:flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-400 text-sm">
            Showing {filteredProducts.length} products
          </p>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300"
            >
              <X className="w-3 h-3" />
              Clear filter
            </button>
          )}
        </div>

        {/* Clipboard feedback toast */}
        {shareFeedback && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-xl animate-fade-in">
            <Check className="w-4 h-4 text-green-400" />
            {shareFeedback}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id}
                className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-orange-500/50 transition-all"
              >
                {/* Product Image */}
                <div 
                  className="relative aspect-square bg-slate-700 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    fallbackIcon={
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center">
                        <ProductIcon category={product.category} />
                      </div>
                    }
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.rating >= 4.7 && (
                      <Badge className="bg-amber-500 text-white text-[10px]">
                        <Star className="w-3 h-3 mr-1" />
                        Top Rated
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge className="bg-red-500 text-white text-[10px]">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* Like + Share buttons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(product.id);
                      }}
                      className="w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center hover:bg-slate-900 transition-colors"
                      aria-label="Like product"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          likedProducts.has(product.id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-slate-400'
                        }`} 
                      />
                    </button>
                    <button
                      onClick={(e) => handleShare(product, e)}
                      className="w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center hover:bg-orange-500/80 transition-colors"
                      aria-label="Share product"
                      title="Share this product"
                    >
                      {sharedProductId === product.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Share2 className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">
                      {categoryLabels[product.category]}
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <CardContent className="p-3">
                  <h3 
                    className="font-medium text-white text-sm truncate cursor-pointer hover:text-orange-400 transition-colors"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-300">{product.rating}</span>
                    <span className="text-xs text-slate-600">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-orange-400 font-semibold text-xs sm:text-sm">{formatPrice(product.price)}</p>
                    <Button 
                      size="sm"
                      disabled={!product.inStock}
                      onClick={() => onPageChange('preorder')}
                      className="h-8 px-2 sm:px-3 bg-orange-500 hover:bg-orange-600 text-white text-xs"
                    >
                      <ShoppingCart className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Order</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-white font-medium mb-2">No products found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or filter</p>
          </div>
        )}
        </>
        )}
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl pr-8">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="aspect-square bg-slate-800 rounded-xl overflow-hidden">
                  <ProductImage
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full"
                    fallbackIcon={
                      <div className="w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl flex items-center justify-center">
                        <ProductIcon category={selectedProduct.category} className="w-16 h-16" />
                      </div>
                    }
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="border-orange-500/50 text-orange-400 mb-2">
                      {categoryLabels[selectedProduct.category]}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-slate-300">{selectedProduct.rating}</span>
                      <span className="text-slate-500">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>

                  <p className="text-2xl font-bold text-orange-400">
                    {formatPrice(selectedProduct.price)}
                  </p>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div>
                    <h4 className="font-medium text-white mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-400">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => {
                        setSelectedProduct(null);
                        onPageChange('preorder');
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Pre-Order Now
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => toggleLike(selectedProduct.id)}
                      className="border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50"
                      title="Like"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          likedProducts.has(selectedProduct.id) 
                            ? 'text-red-500 fill-red-500' 
                            : ''
                        }`} 
                      />
                    </Button>
                    {/* Share button in dialog */}
                    <Button
                      variant="outline"
                      onClick={() => handleShare(selectedProduct)}
                      className="border-slate-700 text-slate-400 hover:text-orange-400 hover:border-orange-500/50 relative"
                      title="Share this product"
                    >
                      {sharedProductId === selectedProduct.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Share feedback inside dialog */}
                  {shareFeedback && sharedProductId === selectedProduct.id && (
                    <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 border border-green-900/40 rounded-lg px-3 py-2">
                      <Check className="w-4 h-4" />
                      {shareFeedback}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductIcon({ category, className = 'w-10 h-10' }: { category: string; className?: string }) {
  switch (category) {
    case 'solar-kits':
      return <Sun className={`${className} text-orange-400`} />;
    case 'batteries-inverters':
      return <Battery className={`${className} text-yellow-400`} />;
    case 'cctv-cameras':
      return <Shield className={`${className} text-emerald-400`} />;
    case 'water-pumps':
      return <Droplets className={`${className} text-blue-400`} />;
    case 'home-electronics':
      return <Zap className={`${className} text-purple-400`} />;
    default:
      return <ShoppingCart className={`${className} text-slate-400`} />;
  }
}

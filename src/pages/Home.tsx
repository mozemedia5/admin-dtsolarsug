import { useEffect, useState, useCallback } from 'react';
import { 
  Sun, 
  Shield, 
  Zap, 
  Droplets, 
  ChevronRight, 
  Star,
  ArrowRight,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { promotions, getFeaturedProducts, branches } from '@/data';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface HomeProps {
  onPageChange: (page: string) => void;
}

export function Home({ onPageChange }: HomeProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const featuredProducts = getFeaturedProducts();
  const activePromotions = promotions;
  const mainBranch = branches.find(b => b.isMain) || branches[0];

  const formatPrice = (price: number) => {
    return `UGX ${price.toLocaleString()}`;
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/30">
                Uganda's #1 Solar & Security Provider
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Power Your Future with{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Clean Energy
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
                Premium solar systems, CCTV cameras, water pumps, and home electronics. 
                Serving Uganda with 4 branches across the country.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg"
                  onClick={() => onPageChange('products')}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                >
                  <ShoppingIcon className="w-5 h-5 mr-2" />
                  Browse Products
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => onPageChange('contact')}
                  className="border-slate-700 text-white hover:bg-slate-800"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">4+</p>
                  <p className="text-sm text-slate-500">Branches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">10K+</p>
                  <p className="text-sm text-slate-500">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">50+</p>
                  <p className="text-sm text-slate-500">Products</p>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-3xl transform rotate-6" />
                <div className="absolute inset-0 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30">
                        <Sun className="w-16 h-16 text-white" />
                      </div>
                      <div className="flex justify-center gap-4">
                        <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center">
                          <Shield className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center">
                          <Zap className="w-8 h-8 text-yellow-400" />
                        </div>
                        <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center">
                          <Droplets className="w-8 h-8 text-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Slider */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Latest Promotions</h2>
          <div className="flex gap-2">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {activePromotions.map((promo) => (
              <div key={promo.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden group cursor-pointer hover:border-orange-500/50 transition-all">
                  <div className="relative h-40 bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-red-500 text-white">{promo.discount}</Badge>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Star className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-1">{promo.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Valid until {new Date(promo.validUntil).toLocaleDateString()}
                      </span>
                      {promo.code && (
                        <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                          Code: {promo.code}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {activePromotions.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                selectedIndex === index 
                  ? 'w-6 bg-orange-500' 
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Products</h2>
            <p className="text-slate-400 text-sm">Our most popular items</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => onPageChange('products')}
            className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-orange-500/50 transition-all cursor-pointer"
              onClick={() => onPageChange('products')}
            >
              <div className="relative aspect-square bg-slate-700 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ProductIcon category={product.category} />
                </div>
                {product.rating >= 4.8 && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-amber-500 text-white text-[10px]">
                      <Star className="w-3 h-3 mr-1" />
                      Top Rated
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-white text-sm truncate">{product.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-slate-400">{product.rating}</span>
                  <span className="text-xs text-slate-600">({product.reviews})</span>
                </div>
                <p className="text-orange-400 font-semibold mt-1">{formatPrice(product.price)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">Our Services</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Sun, title: 'Solar Installation', desc: 'Complete setup' },
            { icon: Shield, title: 'CCTV Setup', desc: 'Security systems' },
            { icon: Droplets, title: 'Water Pumps', desc: 'Solar pumps' },
            { icon: Zap, title: 'Maintenance', desc: '24/7 support' }
          ].map((service, index) => (
            <Card 
              key={index} 
              className="bg-slate-800/50 border-slate-700 p-4 text-center hover:border-orange-500/50 transition-all cursor-pointer"
              onClick={() => onPageChange('services')}
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                <service.icon className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-medium text-white text-sm">{service.title}</h3>
              <p className="text-xs text-slate-400">{service.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 lg:p-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            Ready to Go Solar?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Contact us today for a free consultation and quote. Our experts are ready to help you find the perfect solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`https://wa.me/${mainBranch.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-white/90 w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </a>
            <a href={`tel:${mainBranch.phone}`}>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ShoppingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function ProductIcon({ category }: { category: string }) {
  switch (category) {
    case 'solar-kits':
      return <Sun className="w-10 h-10 text-orange-400" />;
    case 'cctv-cameras':
      return <Shield className="w-10 h-10 text-emerald-400" />;
    case 'water-pumps':
      return <Droplets className="w-10 h-10 text-blue-400" />;
    default:
      return <Zap className="w-10 h-10 text-yellow-400" />;
  }
}

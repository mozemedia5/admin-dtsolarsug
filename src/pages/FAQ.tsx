import { useState } from 'react';
import { 
  ChevronDown, 
  Search, 
  Sun, 
  Shield, 
  MapPin, 
  Package,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { faqs } from '@/data';

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'solar', label: 'Solar Systems', icon: Sun },
  { id: 'cctv', label: 'CCTV Cameras', icon: Shield },
  { id: 'branches', label: 'Branches', icon: MapPin },
  { id: 'orders', label: 'Orders & Delivery', icon: Package },
  { id: 'payment', label: 'Payments', icon: CreditCard }
];

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 pb-6">
        <div className="container mx-auto px-4 pt-6">
          <h1 className="text-2xl font-bold text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-sm">
            Find answers to common questions about our products and services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
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
        <p className="text-slate-400 text-sm mb-4">
          {filteredFAQs.length} question(s) found
        </p>

        {/* FAQ List */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <Card 
                key={faq.id}
                className={`bg-slate-800/50 border-slate-700 overflow-hidden transition-all ${
                  expandedId === faq.id ? 'border-orange-500/50' : ''
                }`}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      expandedId === faq.id 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      <CategoryIcon category={faq.category} />
                    </div>
                    <span className={`font-medium ${
                      expandedId === faq.id ? 'text-orange-400' : 'text-white'
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                      expandedId === faq.id ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {expandedId === faq.id && (
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="pl-11">
                      <div className="h-px bg-slate-700 mb-4" />
                      <p className="text-slate-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-white font-medium mb-2">No questions found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/30">
            <CardContent className="p-6 text-center">
              <HelpCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Still Need Help?</h2>
              <p className="text-slate-400 mb-4">
                Can't find what you're looking for? Contact us directly and we'll be happy to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="https://wa.me/256751800773"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Us
                </a>
                <a 
                  href="tel:+256751800773"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'solar':
      return <Sun className="w-4 h-4" />;
    case 'cctv':
      return <Shield className="w-4 h-4" />;
    case 'branches':
      return <MapPin className="w-4 h-4" />;
    case 'orders':
      return <Package className="w-4 h-4" />;
    case 'payment':
      return <CreditCard className="w-4 h-4" />;
    default:
      return <HelpCircle className="w-4 h-4" />;
  }
}

// Import missing icons
import { MessageCircle, Phone } from 'lucide-react';

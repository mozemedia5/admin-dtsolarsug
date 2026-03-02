import { 
  Home, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Package,
  MessageCircle
} from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onChatToggle: () => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'branches', label: 'Branches', icon: MapPin },
  { id: 'preorder', label: 'Pre-Order', icon: Package },
  { id: 'contact', label: 'Contact', icon: Phone }
];

export function BottomNav({ currentPage, onPageChange, onChatToggle }: BottomNavProps) {
  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={onChatToggle}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
          1
        </span>
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 lg:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-all ${
                  isActive 
                    ? 'text-orange-400' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-orange-500/20' : ''
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

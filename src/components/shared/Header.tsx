import { useState } from 'react';
import { Menu, X, Sun, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'products', label: 'Products' },
  { id: 'services', label: 'Services' },
  { id: 'branches', label: 'Branches' },
  { id: 'contact', label: 'Contact' },
  { id: 'preorder', label: 'Pre-Order' },
  { id: 'faq', label: 'FAQ' },
  { id: 'reviews', label: 'Reviews' }
];

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group"
        >
          <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
            <Sun className="w-5 h-5 text-white absolute" />
            <Shield className="w-3 h-3 text-white absolute bottom-1.5 right-1.5" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              DT Solars
            </span>
            <span className="block text-[10px] text-slate-400 -mt-0.5">& CCTV Cameras</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-slate-900 border-slate-800 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <span className="text-lg font-bold text-orange-400">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </Button>
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          currentPage === item.id
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t border-slate-800">
                <div className="text-center text-xs text-slate-500">
                  <p>DT Solars & CCTV Cameras</p>
                  <p>Uganda</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

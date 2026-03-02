import { useState, useEffect } from 'react';
import { Header, Footer, BottomNav, LiveChat } from '@/components/shared';
import { 
  Home, 
  About, 
  Products, 
  ServicesPage, 
  Branches, 
  Contact, 
  PreOrderPage, 
  FAQ, 
  ReviewsPage 
} from '@/pages';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'products':
        return <Products onPageChange={setCurrentPage} />;
      case 'services':
        return <ServicesPage onPageChange={setCurrentPage} />;
      case 'branches':
        return <Branches onPageChange={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      case 'preorder':
        return <PreOrderPage />;
      case 'faq':
        return <FAQ />;
      case 'reviews':
        return <ReviewsPage />;
      default:
        return <Home onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Install Banner */}
      {isInstallable && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 flex items-center justify-between">
          <p className="text-white text-sm">Install DT Solars app for a better experience</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsInstallable(false)}
              className="text-white/80 hover:text-white text-sm"
            >
              Dismiss
            </button>
            <button 
              onClick={handleInstall}
              className="bg-white text-orange-600 px-3 py-1 rounded text-sm font-medium hover:bg-white/90"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        {renderPage()}
      </main>

      {/* Footer */}
      <div className="hidden lg:block">
        <Footer onPageChange={setCurrentPage} />
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onChatToggle={() => setIsChatOpen(true)}
      />

      {/* Live Chat */}
      <LiveChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

export default App;

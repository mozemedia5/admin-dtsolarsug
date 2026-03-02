import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  MessageCircle,
  Sun
} from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'products', label: 'Products' },
    { id: 'services', label: 'Services' },
    { id: 'branches', label: 'Branches' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'faq', label: 'FAQ' }
  ];

  const services = [
    'Solar Installation',
    'CCTV Installation',
    'Water Pump Setup',
    'Maintenance',
    'Energy Consultation',
    'Delivery Services'
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-orange-400">DT Solars</span>
                <span className="block text-[10px] text-slate-400">& CCTV Cameras</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Uganda's leading provider of solar systems, CCTV cameras, water pumps, 
              batteries, and home electronics. Powering homes and businesses with 
              clean, reliable energy solutions.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/dtsolars" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/dtsolars" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-pink-600 hover:text-white transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/dtsolars" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/256751800773" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-green-600 hover:text-white transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onPageChange(link.id)}
                    className="text-slate-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-slate-400 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-slate-400 text-sm">
                  <p>Nansana, Wakiso, Uganda</p>
                  <p className="text-xs text-slate-500">(Main Branch)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a href="tel:+256751800773" className="text-slate-400 text-sm hover:text-orange-400 transition-colors">
                  +256 751 800 773
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a href="mailto:dtsolarsug@gmail.com" className="text-slate-400 text-sm hover:text-orange-400 transition-colors">
                  dtsolarsug@gmail.com
                </a>
              </div>
              <div className="pt-2">
                <p className="text-slate-500 text-xs">Working Hours:</p>
                <p className="text-slate-400 text-sm">Mon-Fri: 8AM - 6PM</p>
                <p className="text-slate-400 text-sm">Sat: 9AM - 4PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            {currentYear} DT Solars & CCTV Cameras. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <button className="text-slate-500 hover:text-orange-400 transition-colors">
              Privacy Policy
            </button>
            <button className="text-slate-500 hover:text-orange-400 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

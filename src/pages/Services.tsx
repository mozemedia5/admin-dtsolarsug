import { 
  Sun, 
  Shield, 
  Droplets, 
  Wrench, 
  Lightbulb, 
  Truck,
  CheckCircle2,
  ArrowRight,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { services } from '@/data';

interface ServicesProps {
  onPageChange: (page: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Sun,
  Shield,
  Droplets,
  Wrench,
  Lightbulb,
  Truck
};

export function ServicesPage({ onPageChange }: ServicesProps) {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="absolute inset-0 bg-[url('/images/services-pattern.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full mb-6">
              <Wrench className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-400">Our Services</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Professional{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Installation
              </span>{' '}
              & Support
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              From site assessment to installation and maintenance, our expert team 
              provides end-to-end services for all your solar and security needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Sun;
            return (
              <Card 
                key={service.id}
                className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-orange-500/50 transition-all"
              >
                <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Our Process</h2>
          <p className="text-slate-400">How we deliver excellence from start to finish</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Consultation', desc: 'Free assessment of your needs' },
            { step: '02', title: 'Design', desc: 'Custom solution tailored for you' },
            { step: '03', title: 'Installation', desc: 'Professional setup by experts' },
            { step: '04', title: 'Support', desc: 'Ongoing maintenance & warranty' }
          ].map((item, index) => (
            <div key={index} className="relative">
              <Card className="bg-slate-800/50 border-slate-700 h-full">
                <CardContent className="p-5">
                  <span className="text-4xl font-bold text-orange-500/30">{item.step}</span>
                  <h3 className="font-semibold text-white mt-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </CardContent>
              </Card>
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-700">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Why Choose DT Solars?
              </h2>
              <div className="space-y-4">
                {[
                  'Certified technicians with years of experience',
                  'Genuine products from trusted manufacturers',
                  'Comprehensive warranties on all installations',
                  '24/7 customer support and emergency services',
                  'Competitive pricing with flexible payment options',
                  'Nationwide service coverage with 4 branches'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '99%', label: 'Customer Satisfaction' },
                { value: '7+', label: 'Years Experience' },
                { value: '5K+', label: 'Installations' },
                { value: '24/7', label: 'Support Available' }
              ].map((stat, index) => (
                <div key={index} className="bg-slate-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-orange-400">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 lg:p-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            Need Professional Installation?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Contact us today for a free site assessment and quote. Our experts are ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onPageChange('contact')}
              className="bg-white text-orange-600 hover:bg-white/90"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => onPageChange('branches')}
              className="border-white text-white hover:bg-white/10"
            >
              Find Nearest Branch
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { 
  Sun, 
  Shield, 
  Target, 
  Eye, 
  Heart, 
  Award,
  Users,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function About() {
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize customer satisfaction in everything we do, ensuring quality service and support.'
    },
    {
      icon: Award,
      title: 'Quality Products',
      description: 'We source only genuine, high-quality products from trusted manufacturers worldwide.'
    },
    {
      icon: CheckCircle2,
      title: 'Integrity',
      description: 'We operate with honesty and transparency in all our business dealings.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'We are committed to empowering Ugandan communities with sustainable energy solutions.'
    }
  ];

  const milestones = [
    { year: '2018', event: 'DT Solars founded in Nansana' },
    { year: '2019', event: 'Expanded to CCTV cameras and security systems' },
    { year: '2020', event: 'Opened Masaka branch' },
    { year: '2021', event: 'Added water pumps and solar heaters' },
    { year: '2022', event: 'Opened Nakifuma branch in Mukono' },
    { year: '2023', event: 'Launched Kayunga/Bbaale branch' },
    { year: '2024', event: 'Served over 10,000 customers' },
    { year: '2025', event: 'Launched mobile app and PWA' }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="absolute inset-0 bg-[url('/images/about-pattern.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full mb-6">
              <Sun className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-400">About DT Solars</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Powering Uganda's{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Future
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Since 2018, DT Solars & CCTV Cameras has been at the forefront of providing 
              sustainable energy solutions and security systems to homes and businesses across Uganda. 
              With 4 branches and a team of dedicated professionals, we are committed to delivering 
              quality products and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed">
                To provide affordable, reliable, and sustainable energy solutions that empower 
                Ugandan households and businesses while contributing to environmental conservation. 
                We aim to make clean energy accessible to every corner of Uganda.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Our Vision</h2>
              <p className="text-slate-400 leading-relaxed">
                To become Uganda's leading provider of renewable energy and security solutions, 
                recognized for quality, innovation, and customer satisfaction. We envision a 
                Uganda where every home and business has access to clean, affordable power.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Our Core Values</h2>
          <p className="text-slate-400">The principles that guide everything we do</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((value, index) => (
            <Card 
              key={index}
              className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all group"
            >
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-slate-400">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Our Journey</h2>
          <p className="text-slate-400">Key milestones in our growth story</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-amber-500 md:-translate-x-1/2" />
          
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`relative flex items-center gap-4 md:gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ml-12 md:ml-0 ${
                  index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                }`}>
                  <Card className="bg-slate-800/50 border-slate-700 inline-block">
                    <CardContent className="p-4">
                      <span className="text-orange-400 font-bold">{milestone.year}</span>
                      <p className="text-white text-sm mt-1">{milestone.event}</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-slate-900 md:-translate-x-1/2" />
                
                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '4+', label: 'Branches', icon: Sun },
              { value: '10K+', label: 'Happy Customers', icon: Users },
              { value: '50+', label: 'Products', icon: Shield },
              { value: '7+', label: 'Years Experience', icon: Award }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-orange-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Our Team</h2>
          <p className="text-slate-400">Dedicated professionals serving you across Uganda</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Main Branch', role: 'Nansana, Wakiso', phone: '+256 751 800 773' },
            { name: 'Masaka Team', role: 'Masaka Branch', phone: '+256 753 094 406' },
            { name: 'Nakifuma Team', role: 'Nakifuma, Mukono', phone: '+256 774 094 406' },
            { name: 'Kayunga Team', role: 'Kayunga/Bbaale', phone: '+256 774 094 406' }
          ].map((member, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-5">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-slate-400">{member.role}</p>
                <a 
                  href={`tel:${member.phone.replace(/\s/g, '')}`}
                  className="text-sm text-orange-400 hover:text-orange-300 mt-2 inline-block"
                >
                  {member.phone}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

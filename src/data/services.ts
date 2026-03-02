import type { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'service-solar-install',
    title: 'Solar System Installation',
    description: 'Professional installation of solar power systems for homes, businesses, and institutions. We handle everything from site assessment to system commissioning.',
    icon: 'Sun',
    features: [
      'Free site assessment',
      'Custom system design',
      'Professional installation',
      'System testing & commissioning',
      'User training',
      '1-year installation warranty'
    ]
  },
  {
    id: 'service-cctv-install',
    title: 'CCTV Installation',
    description: 'Complete security camera installation with remote viewing setup. Protect your property with our state-of-the-art surveillance solutions.',
    icon: 'Camera',
    features: [
      'Security assessment',
      'Camera positioning planning',
      'Professional wiring',
      'DVR/NVR setup',
      'Mobile app configuration',
      'User training',
      '6-month service warranty'
    ]
  },
  {
    id: 'service-pump-install',
    title: 'Water Pump Installation',
    description: 'Expert installation of solar water pumps for irrigation, domestic use, and livestock. Maximize your water access with solar power.',
    icon: 'Droplets',
    features: [
      'Water source assessment',
      'Pump sizing',
      'Solar panel mounting',
      'Pipeline installation',
      'System optimization',
      '1-year installation warranty'
    ]
  },
  {
    id: 'service-maintenance',
    title: 'Maintenance & Repairs',
    description: 'Comprehensive maintenance services for all solar and security systems. Keep your investment running at peak performance.',
    icon: 'Wrench',
    features: [
      'Scheduled maintenance',
      'Emergency repairs',
      'Battery replacement',
      'Panel cleaning',
      'System upgrades',
      'Performance monitoring'
    ]
  },
  {
    id: 'service-consultation',
    title: 'Energy Consultation',
    description: 'Expert advice on energy solutions tailored to your needs and budget. Make informed decisions about your power requirements.',
    icon: 'Lightbulb',
    features: [
      'Energy needs assessment',
      'System sizing',
      'Cost-benefit analysis',
      'Product recommendations',
      'Financing options',
      'After-sales support'
    ]
  },
  {
    id: 'service-delivery',
    title: 'Delivery & Logistics',
    description: 'Reliable delivery of products to your doorstep anywhere in Uganda. We ensure safe transportation of your equipment.',
    icon: 'Truck',
    features: [
      'Nationwide delivery',
      'Same-day delivery in Kampala',
      'Careful handling',
      'Installation at your location',
      'Free delivery over UGX 2M',
      'Tracking available'
    ]
  }
];

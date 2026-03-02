import type { Product } from '@/types';

export const products: Product[] = [
  // Solar Kits
  {
    id: 'solar-kit-2light',
    name: '2-Light Solar Kit',
    description: 'Complete solar lighting system with 2 LED bulbs, solar panel, and battery. Perfect for small rooms and outdoor lighting.',
    price: 150000,
    category: 'solar-kits',
    image: '/images/products/solar-kit-2light.jpg',
    images: ['/images/products/solar-kit-2light.jpg'],
    rating: 4.5,
    reviews: 128,
    inStock: true,
    features: ['2 LED bulbs', '10W Solar Panel', '6-hour backup', 'USB charging port', 'Easy installation']
  },
  {
    id: 'solar-kit-4light',
    name: '4-Light Solar Kit',
    description: 'Expanded solar lighting system with 4 LED bulbs for larger homes and small businesses.',
    price: 280000,
    category: 'solar-kits',
    image: '/images/products/solar-kit-4light.jpg',
    images: ['/images/products/solar-kit-4light.jpg'],
    rating: 4.7,
    reviews: 95,
    inStock: true,
    features: ['4 LED bulbs', '20W Solar Panel', '8-hour backup', 'USB charging', 'Phone charging']
  },
  {
    id: 'solar-kit-tv',
    name: 'Solar TV Kit',
    description: 'Complete solar entertainment system powering TV, radio, DVD player and lights.',
    price: 850000,
    category: 'solar-kits',
    image: '/images/products/solar-tv-kit.jpg',
    images: ['/images/products/solar-tv-kit.jpg'],
    rating: 4.8,
    reviews: 67,
    inStock: true,
    features: ['32" TV compatible', 'Radio & DVD', '4 LED bulbs', '100W Solar Panel', '12-hour backup']
  },
  {
    id: 'solar-kit-full',
    name: 'Complete Home Solar System',
    description: 'Full home solar solution powering lights, TV, fridge, iron, and subwoofer.',
    price: 2500000,
    category: 'solar-kits',
    image: '/images/products/solar-full-kit.jpg',
    images: ['/images/products/solar-full-kit.jpg'],
    rating: 4.9,
    reviews: 45,
    inStock: true,
    features: ['10+ LED bulbs', 'TV & Fridge', 'Electric iron', 'Subwoofer', '300W Solar Panel', '24-hour backup']
  },
  // Batteries & Inverters
  {
    id: 'battery-100ah',
    name: '100Ah Solar Battery',
    description: 'Deep cycle solar battery with long lifespan and reliable performance.',
    price: 450000,
    category: 'batteries-inverters',
    image: '/images/products/battery-100ah.jpg',
    images: ['/images/products/battery-100ah.jpg'],
    rating: 4.6,
    reviews: 203,
    inStock: true,
    features: ['100Ah capacity', 'Deep cycle', '5-year warranty', 'Maintenance-free', 'Fast charging']
  },
  {
    id: 'battery-200ah',
    name: '200Ah Solar Battery',
    description: 'High-capacity deep cycle battery for larger solar installations.',
    price: 850000,
    category: 'batteries-inverters',
    image: '/images/products/battery-200ah.jpg',
    images: ['/images/products/battery-200ah.jpg'],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    features: ['200Ah capacity', 'Deep cycle', '7-year warranty', 'Maintenance-free', 'Fast charging']
  },
  {
    id: 'inverter-1kw',
    name: '1kW Pure Sine Wave Inverter',
    description: 'Reliable power inverter for home and office use with pure sine wave output.',
    price: 650000,
    category: 'batteries-inverters',
    image: '/images/products/inverter-1kw.jpg',
    images: ['/images/products/inverter-1kw.jpg'],
    rating: 4.5,
    reviews: 89,
    inStock: true,
    features: ['1000W output', 'Pure sine wave', 'Overload protection', 'LCD display', '2-year warranty']
  },
  {
    id: 'inverter-3kw',
    name: '3kW Hybrid Inverter',
    description: 'Advanced hybrid inverter with MPPT charge controller and grid tie capability.',
    price: 1800000,
    category: 'batteries-inverters',
    image: '/images/products/inverter-3kw.jpg',
    images: ['/images/products/inverter-3kw.jpg'],
    rating: 4.8,
    reviews: 42,
    inStock: true,
    features: ['3000W output', 'MPPT controller', 'Grid tie', 'LCD display', '5-year warranty']
  },
  {
    id: 'controller-30a',
    name: '30A MPPT Charge Controller',
    description: 'Maximum Power Point Tracking charge controller for optimal solar efficiency.',
    price: 280000,
    category: 'batteries-inverters',
    image: '/images/products/controller-30a.jpg',
    images: ['/images/products/controller-30a.jpg'],
    rating: 4.6,
    reviews: 134,
    inStock: true,
    features: ['30A capacity', 'MPPT technology', 'LCD display', 'USB ports', '3-year warranty']
  },
  // CCTV Cameras
  {
    id: 'cctv-dome',
    name: 'Dome CCTV Camera',
    description: 'Indoor dome camera with night vision and motion detection.',
    price: 180000,
    category: 'cctv-cameras',
    image: '/images/products/cctv-dome.jpg',
    images: ['/images/products/cctv-dome.jpg'],
    rating: 4.4,
    reviews: 178,
    inStock: true,
    features: ['1080p HD', 'Night vision', 'Motion detection', 'Wide angle', 'Easy installation']
  },
  {
    id: 'cctv-bullet',
    name: 'Bullet CCTV Camera',
    description: 'Weatherproof outdoor bullet camera with long-range night vision.',
    price: 220000,
    category: 'cctv-cameras',
    image: '/images/products/cctv-bullet.jpg',
    images: ['/images/products/cctv-bullet.jpg'],
    rating: 4.5,
    reviews: 145,
    inStock: true,
    features: ['1080p HD', '30m night vision', 'Weatherproof IP66', 'Motion detection', 'Wide angle']
  },
  {
    id: 'cctv-bulb',
    name: 'Solar Bulb Camera',
    description: 'Innovative solar-powered bulb camera with 360° view and mobile app.',
    price: 350000,
    category: 'cctv-cameras',
    image: '/images/products/cctv-bulb.jpg',
    images: ['/images/products/cctv-bulb.jpg'],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    features: ['360° view', 'Solar powered', 'WiFi connected', 'Mobile app', 'Two-way audio']
  },
  {
    id: 'cctv-kit-4ch',
    name: '4-Channel DVR Kit',
    description: 'Complete CCTV system with 4 cameras, DVR, and 1TB hard drive.',
    price: 1200000,
    category: 'cctv-cameras',
    image: '/images/products/cctv-kit-4ch.jpg',
    images: ['/images/products/cctv-kit-4ch.jpg'],
    rating: 4.8,
    reviews: 67,
    inStock: true,
    features: ['4 cameras', '4-channel DVR', '1TB HDD', 'Mobile viewing', 'Night vision']
  },
  {
    id: 'cctv-kit-8ch',
    name: '8-Channel DVR Kit',
    description: 'Professional CCTV system with 8 cameras, DVR, and 2TB hard drive.',
    price: 2200000,
    category: 'cctv-cameras',
    image: '/images/products/cctv-kit-8ch.jpg',
    images: ['/images/products/cctv-kit-8ch.jpg'],
    rating: 4.9,
    reviews: 34,
    inStock: true,
    features: ['8 cameras', '8-channel DVR', '2TB HDD', 'Mobile viewing', 'AI detection']
  },
  // Water Pumps
  {
    id: 'pump-1hp',
    name: '1HP Solar Water Pump',
    description: 'Efficient solar-powered water pump for irrigation and domestic use.',
    price: 950000,
    category: 'water-pumps',
    image: '/images/products/pump-1hp.jpg',
    images: ['/images/products/pump-1hp.jpg'],
    rating: 4.6,
    reviews: 56,
    inStock: true,
    features: ['1HP power', '50m head', 'Solar powered', 'Stainless steel', '5-year warranty']
  },
  {
    id: 'pump-2hp',
    name: '2HP Solar Water Pump',
    description: 'High-capacity solar water pump for large-scale irrigation.',
    price: 1650000,
    category: 'water-pumps',
    image: '/images/products/pump-2hp.jpg',
    images: ['/images/products/pump-2hp.jpg'],
    rating: 4.7,
    reviews: 38,
    inStock: true,
    features: ['2HP power', '80m head', 'Solar powered', 'Stainless steel', '5-year warranty']
  },
  {
    id: 'heater-100l',
    name: '100L Solar Water Heater',
    description: 'Energy-efficient solar water heater for homes and businesses.',
    price: 1800000,
    category: 'water-pumps',
    image: '/images/products/heater-100l.jpg',
    images: ['/images/products/heater-100l.jpg'],
    rating: 4.5,
    reviews: 42,
    inStock: true,
    features: ['100L capacity', 'Vacuum tubes', 'Stainless tank', 'Electric backup', '5-year warranty']
  },
  {
    id: 'heater-200l',
    name: '200L Solar Water Heater',
    description: 'Large-capacity solar water heater for hotels and institutions.',
    price: 2800000,
    category: 'water-pumps',
    image: '/images/products/heater-200l.jpg',
    images: ['/images/products/heater-200l.jpg'],
    rating: 4.6,
    reviews: 28,
    inStock: true,
    features: ['200L capacity', 'Vacuum tubes', 'Stainless tank', 'Electric backup', '5-year warranty']
  },
  // Home Electronics
  {
    id: 'tv-32',
    name: '32" Smart LED TV',
    description: 'Energy-efficient smart TV with built-in apps and USB playback.',
    price: 650000,
    category: 'home-electronics',
    image: '/images/products/tv-32.jpg',
    images: ['/images/products/tv-32.jpg'],
    rating: 4.4,
    reviews: 234,
    inStock: true,
    features: ['32" HD display', 'Smart TV', 'USB playback', 'HDMI ports', '2-year warranty']
  },
  {
    id: 'tv-43',
    name: '43" Smart LED TV',
    description: 'Full HD smart TV with streaming apps and voice control.',
    price: 980000,
    category: 'home-electronics',
    image: '/images/products/tv-43.jpg',
    images: ['/images/products/tv-43.jpg'],
    rating: 4.5,
    reviews: 189,
    inStock: true,
    features: ['43" Full HD', 'Android TV', 'Voice control', 'Chromecast', '2-year warranty']
  },
  {
    id: 'fridge-150l',
    name: '150L Solar Fridge',
    description: 'Low-power consumption refrigerator designed for solar systems.',
    price: 1200000,
    category: 'home-electronics',
    image: '/images/products/fridge-150l.jpg',
    images: ['/images/products/fridge-150l.jpg'],
    rating: 4.6,
    reviews: 78,
    inStock: true,
    features: ['150L capacity', 'Low power', 'Solar compatible', 'Freezer compartment', '3-year warranty']
  },
  {
    id: 'radio-solar',
    name: 'Solar Radio with USB',
    description: 'Portable solar-powered radio with USB charging and flashlight.',
    price: 85000,
    category: 'home-electronics',
    image: '/images/products/radio-solar.jpg',
    images: ['/images/products/radio-solar.jpg'],
    rating: 4.3,
    reviews: 312,
    inStock: true,
    features: ['FM/AM/SW', 'Solar powered', 'USB charging', 'Flashlight', 'Portable']
  },
  {
    id: 'dvd-player',
    name: 'DVD Player with USB',
    description: 'Compact DVD player with USB playback and HDMI output.',
    price: 120000,
    category: 'home-electronics',
    image: '/images/products/dvd-player.jpg',
    images: ['/images/products/dvd-player.jpg'],
    rating: 4.2,
    reviews: 156,
    inStock: true,
    features: ['DVD/CD/MP3', 'USB playback', 'HDMI output', 'Remote control', '1-year warranty']
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.rating >= 4.7).slice(0, 6);
};

export const categoryLabels: Record<string, string> = {
  'solar-kits': 'Solar Kits',
  'batteries-inverters': 'Batteries & Inverters',
  'cctv-cameras': 'CCTV Cameras',
  'water-pumps': 'Water Pumps & Heaters',
  'home-electronics': 'Home Electronics'
};

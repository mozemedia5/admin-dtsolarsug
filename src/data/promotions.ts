import type { Promotion } from '@/types';

export const promotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Solar Week Special',
    description: 'Get 15% off all solar kits this week. Power your home with clean energy!',
    image: '/images/promotions/solar-week.jpg',
    discount: '15% OFF',
    validUntil: '2026-03-15',
    code: 'SOLAR15'
  },
  {
    id: 'promo-2',
    title: 'CCTV Security Bundle',
    description: 'Complete 4-camera CCTV system with free installation at any branch!',
    image: '/images/promotions/cctv-bundle.jpg',
    discount: 'FREE INSTALL',
    validUntil: '2026-03-31',
    code: 'CCTVFREE'
  },
  {
    id: 'promo-3',
    title: 'Water Pump Mega Deal',
    description: 'Buy any solar water pump and get a free 30A charge controller!',
    image: '/images/promotions/water-pump.jpg',
    discount: 'FREE GIFT',
    validUntil: '2026-04-10',
    code: 'PUMPGIFT'
  },
  {
    id: 'promo-4',
    title: 'Battery Upgrade Offer',
    description: 'Trade in your old battery and get 20% off a new 200Ah solar battery!',
    image: '/images/promotions/battery-upgrade.jpg',
    discount: '20% OFF',
    validUntil: '2026-04-30',
    code: 'BATTERY20'
  },
  {
    id: 'promo-5',
    title: 'New Branch Opening',
    description: 'Visit our new Kayunga branch and get special opening discounts!',
    image: '/images/promotions/new-branch.jpg',
    discount: 'UP TO 25% OFF',
    validUntil: '2026-03-20',
    code: 'KAYUNGA25'
  }
];

export const getActivePromotions = (): Promotion[] => {
  const now = new Date();
  return promotions.filter(promo => new Date(promo.validUntil) > now);
};

import type { Review } from '@/types';

export const reviews: Review[] = [
  {
    id: 'review-1',
    userName: 'John Mukasa',
    rating: 5,
    comment: 'Excellent service! The solar installation was quick and professional. My electricity bills have dropped significantly.',
    date: '2026-02-20',
    productId: 'solar-kit-tv',
    verified: true
  },
  {
    id: 'review-2',
    userName: 'Sarah Namukwaya',
    rating: 5,
    comment: 'The CCTV system works perfectly. I can monitor my shop from anywhere using the mobile app. Highly recommended!',
    date: '2026-02-18',
    productId: 'cctv-kit-4ch',
    verified: true
  },
  {
    id: 'review-3',
    userName: 'David Ochieng',
    rating: 4,
    comment: 'Good quality solar water pump. Installation was done the same day I purchased. Customer service at Nansana branch is great.',
    date: '2026-02-15',
    productId: 'pump-1hp',
    verified: true
  },
  {
    id: 'review-4',
    userName: 'Grace Auma',
    rating: 5,
    comment: 'The 200Ah battery has been powering my home for 2 years without issues. DT Solars provides genuine products.',
    date: '2026-02-12',
    productId: 'battery-200ah',
    verified: true
  },
  {
    id: 'review-5',
    userName: 'Peter Kato',
    rating: 5,
    comment: 'Best prices in Uganda! I compared several shops and DT Solars offered the best deal on the complete solar kit.',
    date: '2026-02-10',
    productId: 'solar-kit-full',
    verified: true
  },
  {
    id: 'review-6',
    userName: 'Mary Nakato',
    rating: 4,
    comment: 'The solar bulb camera is innovative and works well. Night vision is clear and the app is easy to use.',
    date: '2026-02-08',
    productId: 'cctv-bulb',
    verified: true
  },
  {
    id: 'review-7',
    userName: 'Robert Ssekito',
    rating: 5,
    comment: 'Pre-ordered a water pump and it was ready in 2 days. The Kayunga branch staff are very helpful.',
    date: '2026-02-05',
    branchId: 'kayunga',
    verified: true
  },
  {
    id: 'review-8',
    userName: 'Jane Nalwoga',
    rating: 5,
    comment: 'The solar water heater saves me so much on electricity. Showers are always hot even on cloudy days!',
    date: '2026-02-03',
    productId: 'heater-100l',
    verified: true
  },
  {
    id: 'review-9',
    userName: 'Charles Okello',
    rating: 4,
    comment: 'Good inverter, runs my TV, lights and fridge without issues. Installation team was professional.',
    date: '2026-01-28',
    productId: 'inverter-1kw',
    verified: true
  },
  {
    id: 'review-10',
    userName: 'Patricia Kyomuhendo',
    rating: 5,
    comment: 'The Masaka branch has excellent customer service. They explained everything about my solar system clearly.',
    date: '2026-01-25',
    branchId: 'masaka',
    verified: true
  }
];

export const getReviewsByProduct = (productId: string): Review[] => {
  return reviews.filter(review => review.productId === productId);
};

export const getReviewsByBranch = (branchId: string): Review[] => {
  return reviews.filter(review => review.branchId === branchId);
};

export const getAverageRating = (productId: string): number => {
  const productReviews = getReviewsByProduct(productId);
  if (productReviews.length === 0) return 0;
  return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
};

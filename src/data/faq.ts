import type { FAQ } from '@/types';

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How long does solar installation take?',
    answer: 'Standard home solar installation typically takes 1-2 days depending on the system size. Our professional team ensures minimal disruption to your daily activities. Larger commercial installations may take 3-5 days.',
    category: 'solar'
  },
  {
    id: 'faq-2',
    question: 'What warranty do you offer on solar products?',
    answer: 'We offer comprehensive warranties: Solar panels come with 25 years warranty, inverters with 5 years, batteries with 5-7 years, and charge controllers with 3 years. All installations include 1-year service warranty.',
    category: 'solar'
  },
  {
    id: 'faq-3',
    question: 'Can I install CCTV cameras myself?',
    answer: 'While DIY installation is possible, we recommend professional installation to ensure optimal camera positioning, proper wiring, and system configuration. Our installation service includes setup, testing, and training on how to use the system.',
    category: 'cctv'
  },
  {
    id: 'faq-4',
    question: 'Do you offer remote monitoring for CCTV systems?',
    answer: 'Yes! All our CCTV systems come with mobile app access for remote viewing. You can monitor your property from anywhere in the world using your smartphone or computer.',
    category: 'cctv'
  },
  {
    id: 'faq-5',
    question: 'Where are your branches located?',
    answer: 'We have 4 branches across Uganda: Nansana (Main Branch in Wakiso), Masaka (Central Uganda), Nakifuma (Mukono), and Kayunga/Bbaale (Kayunga District). Each branch offers full product range and installation services.',
    category: 'branches'
  },
  {
    id: 'faq-6',
    question: 'What are your working hours?',
    answer: 'All branches are open Monday-Friday 8:00 AM - 6:00 PM, and Saturday 9:00 AM - 4:00 PM. We are closed on Sundays. However, our WhatsApp lines are available for emergencies.',
    category: 'branches'
  },
  {
    id: 'faq-7',
    question: 'How does pre-ordering work?',
    answer: 'Simply select your product, choose your nearest branch, provide your contact details, and submit. Our team will contact you within 24 hours to confirm availability and arrange pickup or delivery.',
    category: 'orders'
  },
  {
    id: 'faq-8',
    question: 'Do you offer delivery services?',
    answer: 'Yes, we offer delivery within Uganda at competitive rates. Delivery is free for orders above UGX 2,000,000 within 50km of any branch. We also arrange installation at your location.',
    category: 'orders'
  },
  {
    id: 'faq-9',
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, mobile money (MTN Mobile Money, Airtel Money), bank transfers, and major credit cards. Installment plans are available for orders above UGX 1,000,000.',
    category: 'payment'
  },
  {
    id: 'faq-10',
    question: 'Can I track my pre-order status?',
    answer: 'Yes! Once you place a pre-order, you will receive an order number. You can track your order status through our app or by contacting your selected branch. Status updates include: Pending, Ready, and Completed.',
    category: 'orders'
  },
  {
    id: 'faq-11',
    question: 'Do solar water pumps work during cloudy days?',
    answer: 'Yes, our solar water pumps work on cloudy days but at reduced efficiency. We recommend pairing them with batteries for consistent performance during low sunlight periods.',
    category: 'solar'
  },
  {
    id: 'faq-12',
    question: 'How do I maintain my solar system?',
    answer: 'Regular maintenance includes cleaning solar panels monthly, checking battery water levels (for flooded batteries), and ensuring connections are tight. We offer annual maintenance packages for hassle-free operation.',
    category: 'solar'
  }
];

export const getFAQsByCategory = (category: string): FAQ[] => {
  return faqs.filter(faq => faq.category === category);
};

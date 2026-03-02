import type { Branch } from '@/types';

export const branches: Branch[] = [
  {
    id: 'nansana',
    name: 'Nansana Branch (Main)',
    location: 'Nansana, Wakiso',
    address: 'Nansana, Wakiso, Uganda',
    whatsapp: '+256751800773',
    phone: '+256751800773',
    email: 'dtsolarsug@gmail.com',
    coordinates: {
      lat: 0.3636,
      lng: 32.5286
    },
    workingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    isMain: true
  },
  {
    id: 'masaka',
    name: 'Masaka Branch',
    location: 'Masaka, Central Uganda',
    address: 'Masaka, Uganda',
    whatsapp: '+256753094406',
    phone: '+256753094406',
    email: 'dtsolarsug@gmail.com',
    coordinates: {
      lat: -0.3475,
      lng: 31.7391
    },
    workingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    isMain: false
  },
  {
    id: 'nakifuma',
    name: 'Nakifuma Branch',
    location: 'Nakifuma, Mukono',
    address: 'Nakifuma, Mukono, Uganda',
    whatsapp: '+256774094406',
    phone: '+256774094406',
    email: 'dtsolarsug@gmail.com',
    coordinates: {
      lat: 0.5283,
      lng: 32.7883
    },
    workingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    isMain: false
  },
  {
    id: 'kayunga',
    name: 'Kayunga/Bbaale Branch',
    location: 'Kayunga/Bbaale, Kayunga District',
    address: 'Kayunga/Bbaale, Uganda',
    whatsapp: '+256774094406',
    phone: '+256774094406',
    email: 'dtsolarsug@gmail.com',
    coordinates: {
      lat: 0.7025,
      lng: 32.8883
    },
    workingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    isMain: false
  }
];

export const getBranchById = (id: string): Branch | undefined => {
  return branches.find(branch => branch.id === id);
};

export const getMainBranch = (): Branch => {
  return branches.find(branch => branch.isMain) || branches[0];
};

export const getNearestBranch = (userLat: number, userLng: number): Branch => {
  let nearest = branches[0];
  let minDistance = Infinity;

  branches.forEach(branch => {
    const distance = Math.sqrt(
      Math.pow(branch.coordinates.lat - userLat, 2) +
      Math.pow(branch.coordinates.lng - userLng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = branch;
    }
  });

  return nearest;
};

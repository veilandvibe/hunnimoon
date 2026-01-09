export type RSVPStatus = 'Pending' | 'Yes' | 'No';
export type Side = 'Bride' | 'Groom' | 'Both' | 'Unknown';

export interface Wedding {
  id: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string;
  wedding_slug: string;
  created_at: number;
}

export interface Guest {
  id: string;
  wedding_id: string;
  full_name: string;
  email: string;
  phone: string;
  side: Side;
  household_id?: string;
  plus_one_allowed: boolean;
  plus_one_name?: string;
  invite_sent: boolean;
  rsvp_status: RSVPStatus;
  meal_choice?: string;
  dietary_notes?: string;
  rsvp_notes?: string;
  shuttle_needed: boolean;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_postal?: string;
  address_country?: string;
  source: 'Manual' | 'RSVP';
  last_updated: number;
}

export interface BudgetItem {
  id: string;
  wedding_id: string;
  category_name: string;
  estimated_cost: number;
  actual_cost: number;
  is_paid: boolean;
  is_active: boolean;
  is_custom: boolean;
  sort_order: number;
}

export interface Vendor {
  id: string;
  wedding_id: string;
  vendor_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  notes: string;
}

// Wedding date is 4 months from now
const weddingDate = new Date();
weddingDate.setMonth(weddingDate.getMonth() + 4);

export const dummyWedding: Wedding = {
  id: 'wedding-1',
  partner1_name: 'Alex',
  partner2_name: 'Jordan',
  wedding_date: weddingDate.toISOString(),
  wedding_slug: 'alex-and-jordan-2026',
  created_at: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
};

export const dummyGuests: Guest[] = [
  {
    id: 'guest-1',
    wedding_id: 'wedding-1',
    full_name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '555-0101',
    side: 'Bride',
    household_id: 'hh-1',
    plus_one_allowed: true,
    plus_one_name: 'Michael Johnson',
    invite_sent: true,
    rsvp_status: 'Yes',
    meal_choice: 'Chicken',
    dietary_notes: 'No nuts',
    shuttle_needed: true,
    address_city: 'New York',
    address_state: 'NY',
    source: 'RSVP',
    last_updated: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-2',
    wedding_id: 'wedding-1',
    full_name: 'Emily Chen',
    email: 'emily.chen@email.com',
    phone: '555-0102',
    side: 'Groom',
    plus_one_allowed: false,
    invite_sent: true,
    rsvp_status: 'Yes',
    meal_choice: 'Vegetarian',
    dietary_notes: 'Vegan preferred',
    shuttle_needed: false,
    address_city: 'Brooklyn',
    address_state: 'NY',
    source: 'RSVP',
    last_updated: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-3',
    wedding_id: 'wedding-1',
    full_name: 'Robert Williams',
    email: 'robert.w@email.com',
    phone: '555-0103',
    side: 'Bride',
    plus_one_allowed: true,
    invite_sent: true,
    rsvp_status: 'No',
    source: 'Manual',
    shuttle_needed: false,
    last_updated: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-4',
    wedding_id: 'wedding-1',
    full_name: 'Jessica Martinez',
    email: 'jmartinez@email.com',
    phone: '555-0104',
    side: 'Groom',
    plus_one_allowed: false,
    invite_sent: true,
    rsvp_status: 'Pending',
    source: 'Manual',
    shuttle_needed: false,
    last_updated: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-5',
    wedding_id: 'wedding-1',
    full_name: 'David Lee',
    email: 'david.lee@email.com',
    phone: '555-0105',
    side: 'Both',
    household_id: 'hh-2',
    plus_one_allowed: true,
    plus_one_name: 'Amanda Lee',
    invite_sent: true,
    rsvp_status: 'Yes',
    meal_choice: 'Fish',
    dietary_notes: 'No shellfish',
    shuttle_needed: true,
    address_city: 'Queens',
    address_state: 'NY',
    source: 'RSVP',
    last_updated: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-6',
    wedding_id: 'wedding-1',
    full_name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '555-0106',
    side: 'Bride',
    plus_one_allowed: false,
    invite_sent: true,
    rsvp_status: 'Yes',
    meal_choice: 'Beef',
    shuttle_needed: false,
    address_city: 'Manhattan',
    address_state: 'NY',
    source: 'RSVP',
    last_updated: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-7',
    wedding_id: 'wedding-1',
    full_name: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '555-0107',
    side: 'Groom',
    plus_one_allowed: true,
    invite_sent: true,
    rsvp_status: 'Pending',
    source: 'Manual',
    shuttle_needed: false,
    last_updated: Date.now() - 12 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-8',
    wedding_id: 'wedding-1',
    full_name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    phone: '555-0108',
    side: 'Bride',
    plus_one_allowed: false,
    invite_sent: true,
    rsvp_status: 'Yes',
    meal_choice: 'Chicken',
    shuttle_needed: true,
    address_city: 'Bronx',
    address_state: 'NY',
    source: 'RSVP',
    last_updated: Date.now() - 6 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-9',
    wedding_id: 'wedding-1',
    full_name: 'Thomas Brown',
    email: 'tbrown@email.com',
    phone: '555-0109',
    side: 'Groom',
    household_id: 'hh-3',
    plus_one_allowed: true,
    plus_one_name: 'Jennifer Brown',
    invite_sent: true,
    rsvp_status: 'Yes',
    meal_choice: 'Fish',
    shuttle_needed: false,
    source: 'RSVP',
    last_updated: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-10',
    wedding_id: 'wedding-1',
    full_name: 'Patricia Davis',
    email: 'patricia.d@email.com',
    phone: '555-0110',
    side: 'Both',
    plus_one_allowed: false,
    invite_sent: true,
    rsvp_status: 'Pending',
    source: 'Manual',
    shuttle_needed: false,
    last_updated: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-11',
    wedding_id: 'wedding-1',
    full_name: 'Christopher Moore',
    email: 'chris.moore@email.com',
    phone: '555-0111',
    side: 'Bride',
    plus_one_allowed: true,
    invite_sent: false,
    rsvp_status: 'Pending',
    source: 'Manual',
    shuttle_needed: false,
    last_updated: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-12',
    wedding_id: 'wedding-1',
    full_name: 'Nancy Taylor',
    email: 'nancy.t@email.com',
    phone: '555-0112',
    side: 'Groom',
    plus_one_allowed: false,
    invite_sent: true,
    rsvp_status: 'No',
    source: 'Manual',
    shuttle_needed: false,
    last_updated: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-13',
    wedding_id: 'wedding-1',
    full_name: 'Daniel Jackson',
    email: 'djackson@email.com',
    phone: '555-0113',
    side: 'Bride',
    household_id: 'hh-4',
    plus_one_allowed: true,
    plus_one_name: 'Karen Jackson',
    invite_sent: true,
    rsvp_status: 'Yes',
    meal_choice: 'Vegetarian',
    shuttle_needed: true,
    source: 'RSVP',
    last_updated: Date.now() - 9 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-14',
    wedding_id: 'wedding-1',
    full_name: 'Betty White',
    email: 'betty.white@email.com',
    phone: '555-0114',
    side: 'Both',
    plus_one_allowed: false,
    invite_sent: true,
    rsvp_status: 'Yes',
    meal_choice: 'Chicken',
    shuttle_needed: false,
    source: 'RSVP',
    last_updated: Date.now() - 11 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'guest-15',
    wedding_id: 'wedding-1',
    full_name: 'Matthew Harris',
    email: 'mharris@email.com',
    phone: '555-0115',
    side: 'Groom',
    plus_one_allowed: false,
    invite_sent: false,
    rsvp_status: 'Pending',
    source: 'Manual',
    shuttle_needed: false,
    last_updated: Date.now() - 25 * 24 * 60 * 60 * 1000,
  },
];

export const dummyBudgetItems: BudgetItem[] = [
  {
    id: 'budget-1',
    wedding_id: 'wedding-1',
    category_name: 'Venue',
    estimated_cost: 8000,
    actual_cost: 8500,
    is_paid: true,
    is_active: true,
    is_custom: false,
    sort_order: 1,
  },
  {
    id: 'budget-2',
    wedding_id: 'wedding-1',
    category_name: 'Catering',
    estimated_cost: 12000,
    actual_cost: 11500,
    is_paid: true,
    is_active: true,
    is_custom: false,
    sort_order: 2,
  },
  {
    id: 'budget-3',
    wedding_id: 'wedding-1',
    category_name: 'Photography',
    estimated_cost: 3500,
    actual_cost: 3500,
    is_paid: false,
    is_active: true,
    is_custom: false,
    sort_order: 3,
  },
  {
    id: 'budget-4',
    wedding_id: 'wedding-1',
    category_name: 'Videography',
    estimated_cost: 2500,
    actual_cost: 0,
    is_paid: false,
    is_active: true,
    is_custom: false,
    sort_order: 4,
  },
  {
    id: 'budget-5',
    wedding_id: 'wedding-1',
    category_name: 'Flowers/Décor',
    estimated_cost: 2000,
    actual_cost: 1800,
    is_paid: true,
    is_active: true,
    is_custom: false,
    sort_order: 5,
  },
  {
    id: 'budget-6',
    wedding_id: 'wedding-1',
    category_name: 'Music/Entertainment',
    estimated_cost: 1500,
    actual_cost: 0,
    is_paid: false,
    is_active: true,
    is_custom: false,
    sort_order: 6,
  },
  {
    id: 'budget-7',
    wedding_id: 'wedding-1',
    category_name: 'Attire',
    estimated_cost: 3000,
    actual_cost: 2800,
    is_paid: true,
    is_active: true,
    is_custom: false,
    sort_order: 7,
  },
  {
    id: 'budget-8',
    wedding_id: 'wedding-1',
    category_name: 'Invitations',
    estimated_cost: 500,
    actual_cost: 450,
    is_paid: true,
    is_active: true,
    is_custom: false,
    sort_order: 8,
  },
  {
    id: 'budget-9',
    wedding_id: 'wedding-1',
    category_name: 'Rings',
    estimated_cost: 4000,
    actual_cost: 4200,
    is_paid: true,
    is_active: true,
    is_custom: false,
    sort_order: 9,
  },
  {
    id: 'budget-10',
    wedding_id: 'wedding-1',
    category_name: 'Transportation',
    estimated_cost: 800,
    actual_cost: 0,
    is_paid: false,
    is_active: true,
    is_custom: false,
    sort_order: 10,
  },
];

export const dummyVendors: Vendor[] = [
  {
    id: 'vendor-1',
    wedding_id: 'wedding-1',
    vendor_name: 'The Grand Ballroom',
    contact_name: 'Michelle Stevens',
    email: 'michelle@grandballroom.com',
    phone: '555-1001',
    website: 'https://grandballroom.com',
    notes: 'Beautiful venue with great city views. Includes tables and chairs.',
  },
  {
    id: 'vendor-2',
    wedding_id: 'wedding-1',
    vendor_name: 'Delicious Catering Co.',
    contact_name: 'Chef Marco',
    email: 'marco@deliciouscatering.com',
    phone: '555-1002',
    website: 'https://deliciouscatering.com',
    notes: 'Specializes in Italian and Mediterranean cuisine. Tasting scheduled for next month.',
  },
  {
    id: 'vendor-3',
    wedding_id: 'wedding-1',
    vendor_name: 'Perfect Moments Photography',
    contact_name: 'Sarah Kim',
    email: 'sarah@perfectmoments.com',
    phone: '555-1003',
    website: 'https://perfectmoments.com',
    notes: 'Amazing portfolio. Booked for 8 hours plus engagement shoot.',
  },
  {
    id: 'vendor-4',
    wedding_id: 'wedding-1',
    vendor_name: 'Blooms & Petals',
    contact_name: 'Lisa Flower',
    email: 'lisa@bloomsandpetals.com',
    phone: '555-1004',
    website: 'https://bloomsandpetals.com',
    notes: 'Full service florist. Doing centerpieces, bouquets, and ceremony arch.',
  },
  {
    id: 'vendor-5',
    wedding_id: 'wedding-1',
    vendor_name: 'DJ Beats',
    contact_name: 'Mike Johnson',
    email: 'dj@beats.com',
    phone: '555-1005',
    website: 'https://djbeats.com',
    notes: 'Experienced wedding DJ. Has played at the venue before.',
  },
];

// Helper functions
export const getGuestMetrics = () => {
  const totalGuests = dummyGuests.length;
  const invitesSent = dummyGuests.filter(g => g.invite_sent).length;
  const yesCount = dummyGuests.filter(g => g.rsvp_status === 'Yes').length;
  const pendingCount = dummyGuests.filter(g => g.rsvp_status === 'Pending').length;
  const projectedAttendance = yesCount + Math.floor(pendingCount * 0.5);
  
  return {
    totalGuests,
    invitesSent,
    invitesSentPercent: Math.round((invitesSent / totalGuests) * 100),
    projectedAttendance,
    yesCount,
    noCount: dummyGuests.filter(g => g.rsvp_status === 'No').length,
    pendingCount,
  };
};

export const getBudgetMetrics = () => {
  const activeItems = dummyBudgetItems.filter(item => item.is_active);
  const totalEstimated = activeItems.reduce((sum, item) => sum + item.estimated_cost, 0);
  const totalActual = activeItems.reduce((sum, item) => sum + item.actual_cost, 0);
  const remaining = totalEstimated - totalActual;
  const percentSpent = Math.round((totalActual / totalEstimated) * 100);
  
  return {
    totalEstimated,
    totalActual,
    remaining,
    percentSpent,
    isOverBudget: totalActual > totalEstimated,
  };
};

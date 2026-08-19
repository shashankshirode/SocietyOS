export type FacilityImageInfo = {
  url: string;
  accessibilityLabel: string;
  credit?: string;
};

export const facilityImageRegistry: Record<string, FacilityImageInfo> = {
  clubhouse: {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Luxury clubhouse seating and lounge area',
  },
  gym: {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Modern gym equipped with treadmills, dumbbells, and weight machines',
  },
  swimming_pool: {
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Shining blue outdoor swimming pool with lounge chairs',
  },
  badminton_court: {
    url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Indoor professional badminton court showing net and markings',
  },
  tennis_court: {
    url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Clay tennis court with net under clear sky',
  },
  yoga_hall: {
    url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Serene yoga and meditation room with mats and bamboo decor',
  },
  kids_play_area: {
    url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Colorful kids outdoor playground with slides and swings',
  },
  party_hall: {
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Elegant banquet and party hall setup with lighting and round tables',
  },
  table_tennis: {
    url: 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Indoor table tennis ping pong table with paddles and ball',
  },
  cricket_turf: {
    url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Bright green cricket turf pitch with wickets and boundary ropes',
  },
  guest_room_a: {
    url: 'https://images.unsplash.com/photo-1611891487122-2075b9627798?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Luxury guest hotel style bedroom with double bed',
  },
  guest_room_b: {
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop',
    accessibilityLabel: 'Cozy guest twin bedroom with white linen',
  },
};

export const fallbackFacilityImage: FacilityImageInfo = {
  url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
  accessibilityLabel: 'Modern building community area',
};

export function getFacilityImage(nameOrId?: string): FacilityImageInfo {
  if (!nameOrId) return fallbackFacilityImage;
  const baseName = nameOrId.replace(/\s+\d+$/, '');
  const key = baseName.toLowerCase().replace(/\s+/g, '_');
  return facilityImageRegistry[key] || fallbackFacilityImage;
}

import { HookupProfile, HOOKUP_PROFILES } from '../data/hookupProfiles';

const HOOKUP_INTENTS = [
  'Late night cocktails & discreet rendezvous',
  'No strings attached casual hookup tonight',
  'Hotel lounge drinks & rooftop party',
  'Looking for someone spontaneous to unwind with',
  'Dinner date with intense chemistry',
  'Casual late-night drives & intimate vibes',
  'Pool party, drinks & fun without drama',
  'Spontaneous meetup in downtown tonight',
  'Secret rendezvous & travel companion',
  'Open minded casual adventures',
];

const BIOS = [
  'Free tonight and looking for good company, great drinks, and zero drama.',
  'Just visiting the city for a few days. Show me around or join me for cocktails.',
  'Work hard, play harder. Looking for a spontaneous date tonight with mutual chemistry.',
  'Direct, honest, and looking for casual dating with someone confident and respectful.',
  'Looking for someone to grab late night sushi and cocktails with. Let\'s see where it goes.',
  'Art, techno, rooftop views, and late night conversation. Open to whatever sparks.',
  'Spontaneous, fun-loving, and ready for tonight. Discretion 100% mutual.',
  'Downtown living. Looking for a partner in crime for secret weekend adventures.',
];

const INTEREST_POOLS = [
  ['Cocktails', 'Rooftop Lounges', 'House Music', 'Late Dinners'],
  ['Wine Tasting', 'Fine Dining', 'Beach Bonfires', 'Nightclubbing'],
  ['Techno', 'Speakeasies', 'Modern Art', 'Photography'],
  ['Pool Parties', 'EDM', 'Casinos', 'Luxury Travel'],
  ['Fitness', 'Sushi', 'Late Drives', 'Espresso Martinis'],
  ['Jazz Bars', 'Secret Lounges', 'Champagne', 'Bistros'],
];

const AVAILABILITIES: Array<'Tonight' | 'In 1-2 Hours' | 'This Weekend' | 'Right Now'> = [
  'Tonight',
  'In 1-2 Hours',
  'Right Now',
  'Tonight',
  'This Weekend',
  'Right Now',
];

const ONLINE_STATUSES: Array<'Online Now' | 'Active 5m ago' | 'Active 12m ago'> = [
  'Online Now',
  'Online Now',
  'Active 5m ago',
  'Online Now',
  'Active 12m ago',
];

const BADGE_POOLS = [
  ['🔥 HOT MATCH', 'VERIFIED SELFIE', '98% RESPONSE'],
  ['DISCREET', 'PHOTO VERIFIED', 'FAST REPLIES'],
  ['⚡ 1.2 KM AWAY', 'VIP ONLY', 'ACTIVE TONIGHT'],
  ['NO STRINGS', 'HIGH CHEMISTRY', 'INSTANT MEET'],
  ['PARTY MATCH', '100% PRIVATE', 'VERIFIED PROFILE'],
];

export async function fetchRandomUserHookupProfiles(
  count: number = 12,
  genderFilter: 'all' | 'female' | 'male' | 'couple' = 'all'
): Promise<HookupProfile[]> {
  try {
    const genderParam = genderFilter === 'female' ? '&gender=female' : genderFilter === 'male' ? '&gender=male' : '';
    const url = `https://randomuser.me/api/?results=${count}${genderParam}&nat=us,gb,ca,au,fr,de,es,ch,nl&inc=gender,name,location,dob,picture,login,nat,cell`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Random User API responded with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      throw new Error('No results from Random User API');
    }

    const generatedProfiles: HookupProfile[] = data.results.map((u: any, idx: number) => {
      const isCouple = genderFilter === 'couple' || (genderFilter === 'all' && idx === 3);
      const firstName = u.name?.first ? `${u.name.first.charAt(0).toUpperCase()}${u.name.first.slice(1)}` : 'Alex';
      const lastName = u.name?.last ? `${u.name.last.charAt(0).toUpperCase()}${u.name.last.slice(1)}` : 'Morgan';
      const displayName = isCouple ? `${firstName} & Friend` : `${firstName} ${lastName.charAt(0)}.`;
      
      const age = u.dob?.age && u.dob.age >= 21 && u.dob.age <= 45 ? u.dob.age : Math.floor(22 + Math.random() * 16);
      const distance = Number((0.4 + Math.random() * 8.5).toFixed(1));
      const city = u.location?.city ? `${u.location.city}, ${u.location.state || u.nat}` : 'Downtown';
      const country = u.location?.country || 'United States';
      const photo = u.picture?.large || u.picture?.medium || `https://randomuser.me/api/portraits/${u.gender === 'female' ? 'women' : 'men'}/${(idx * 7) % 90}.jpg`;

      // Multiple portrait angles or alternates for gallery
      const altSeed1 = (idx * 11 + 1) % 90;
      const altSeed2 = (idx * 17 + 3) % 90;
      const genderPath = u.gender === 'female' ? 'women' : 'men';

      const gallery = [
        photo,
        `https://randomuser.me/api/portraits/${genderPath}/${altSeed1}.jpg`,
        `https://randomuser.me/api/portraits/${genderPath}/${altSeed2}.jpg`,
      ];

      return {
        id: `rnd-${u.login?.uuid || idx}-${Date.now()}`,
        name: displayName,
        age: age,
        gender: isCouple ? 'couple' : (u.gender === 'female' ? 'female' : 'male'),
        distanceKm: distance,
        city: city,
        country: country,
        photo: photo,
        gallery: gallery,
        intent: HOOKUP_INTENTS[idx % HOOKUP_INTENTS.length],
        availability: AVAILABILITIES[idx % AVAILABILITIES.length],
        verified: true,
        onlineStatus: ONLINE_STATUSES[idx % ONLINE_STATUSES.length],
        bio: BIOS[idx % BIOS.length],
        interests: INTEREST_POOLS[idx % INTEREST_POOLS.length],
        badges: BADGE_POOLS[idx % BADGE_POOLS.length],
      };
    });

    return generatedProfiles;
  } catch (error) {
    console.warn('Random User API request failed, utilizing fallback high-quality hookup profiles:', error);
    return HOOKUP_PROFILES;
  }
}

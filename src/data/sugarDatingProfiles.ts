export interface DatingProfile {
  id: string; // e.g. "184811"
  type: 'woman' | 'man';
  name: string;
  age: number; // 37 to 78
  originCity: string;
  originCountry: string;
  currentLocation: string;
  region: 'Africa' | 'Europe' | 'Americas' | 'Middle East & Asia';
  photo: string;
  gallery: string[];
  zodiac: string;
  weight: string; // e.g. "128lb, 58kg"
  height: string; // e.g. "5'7\", 170cm"
  eyeColor: string;
  hairColor: string;
  maritalStatus: 'Single' | 'Divorced' | 'Widowed' | 'Never Married';
  children: string; // e.g. "None", "1 (Adult)", "2 (Independent)"
  religion: string; // e.g. "Christian (Orthodox)", "Christian", "Catholic", "Muslim", "Spiritual"
  smoker: 'No' | 'Socially' | 'Never';
  drinker: 'No' | 'Socially' | 'Rarely' | 'Never';
  education: 'University Degree' | 'Master\'s Degree' | 'Doctorate (Ph.D.)' | 'College Graduate' | 'Business Academy';
  company: 'Private Enterprise' | 'Self-Employed / Founder' | 'Family Estate' | 'Multinational Executive' | 'State / Energy Corp';
  jobTitle: string;
  hobbies: string;
  english: 'fluent' | 'native' | 'good' | 'fair';
  languages: string;
  selfDescription: string;
  comments: string;
  netWorth: string;
  monthlyAllowance: string;
  lookingFor: string;
  vipTier: 'Diamond VIP' | 'Platinum Royal' | 'Gold Elite' | 'Imperial';
  verified: boolean;
  onlineNow: boolean;
}

// Rich pre-seeded profiles covering Africa, Europe, Americas, Middle East with Ages 37 to 78
export const SEED_PROFILES: DatingProfile[] = [
  // 1. Irina - Kiev / Ankara (Age 43) - Inspired by screenshot
  {
    id: '184811',
    type: 'woman',
    name: 'Irina Volkova',
    age: 43,
    originCity: 'Kiev',
    originCountry: 'Ukraine',
    currentLocation: 'Ankara, Turkey & Monaco',
    region: 'Europe',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Cancer, Pig',
    weight: '121lb, 55kg',
    height: '5\'7", 170cm',
    eyeColor: 'Green',
    hairColor: 'Blonde',
    maritalStatus: 'Single',
    children: 'None',
    religion: 'Christian (Orthodox)',
    smoker: 'No',
    drinker: 'No',
    education: 'University Degree',
    company: 'Private Enterprise',
    jobTitle: 'Haute Fashion Designer & Boutique Owner',
    hobbies: 'Music, History, Reading, Sports, Art Galleries',
    english: 'fair',
    languages: 'Ukrainian (native), Russian (native), English',
    selfDescription: 'I am active, educated, and very sweet lady with traditional values. I have built successful boutique businesses, but I believe true joy comes from having a loving partner. I am ready for serious marriage and high-class world travel.',
    comments: 'I am looking for a responsible, loving man who appreciates sincerity and devotion. I am ready to relocate or host my future husband with full financial comfort and unconditional affection.',
    netWorth: '$14,500,000',
    monthlyAllowance: '$15,000 - $25,000 / mo',
    lookingFor: 'Gentleman with a loyal heart who is ready for a happy, romantic marriage and luxurious life',
    vipTier: 'Diamond VIP',
    verified: true,
    onlineNow: true,
  },

  // 2. Chief Dr. Folashade Adeleke (Age 54) - Lagos, Nigeria & London (Africa)
  {
    id: '298104',
    type: 'woman',
    name: 'Chief Dr. Folashade Adeleke',
    age: 54,
    originCity: 'Lagos',
    originCountry: 'Nigeria',
    currentLocation: 'Ikoyi (Lagos), Accra & Mayfair (London)',
    region: 'Africa',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Leo, Tiger',
    weight: '145lb, 66kg',
    height: '5\'8", 173cm',
    eyeColor: 'Dark Brown',
    hairColor: 'Black',
    maritalStatus: 'Widowed',
    children: '2 (Adults & Independent)',
    religion: 'Christian',
    smoker: 'No',
    drinker: 'Socially',
    education: 'Doctorate (Ph.D.)',
    company: 'Multinational Executive',
    jobTitle: 'Maritime Logistics & Oil Services Magnate',
    hobbies: 'Philanthropy, High Fashion, Private Aviation, Luxury Resort Dining',
    english: 'fluent',
    languages: 'English (native), Yoruba, French',
    selfDescription: 'I am an accomplished, elegant woman with a warm maternal and romantic spirit. I hold chieftaincy titles and executive boards across West Africa and Europe. I want a gentle, respectable husband to spoil, pamper, and build a peaceful life together.',
    comments: 'Looking for a genuine man (any nationality) who respects a strong, generous woman. I will provide full housing, luxury automobiles, business capital, and $25,000 monthly allowance.',
    netWorth: '$48,000,000',
    monthlyAllowance: '$25,000 - $45,000 / mo',
    lookingFor: 'Respectful, caring and handsome man for holy matrimony and peaceful luxury living',
    vipTier: 'Imperial',
    verified: true,
    onlineNow: true,
  },

  // 3. Madam Beatrice Sterling (Age 64) - Beverly Hills & London
  {
    id: '104729',
    type: 'woman',
    name: 'Madam Beatrice Sterling',
    age: 64,
    originCity: 'London',
    originCountry: 'United Kingdom',
    currentLocation: 'Beverly Hills, CA & Zurich',
    region: 'Europe',
    photo: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Sagittarius, Horse',
    weight: '136lb, 62kg',
    height: '5\'6", 168cm',
    eyeColor: 'Blue',
    hairColor: 'Silver Blonde',
    maritalStatus: 'Widowed',
    children: '1 (Independent)',
    religion: 'Christian',
    smoker: 'No',
    drinker: 'Socially',
    education: 'Master\'s Degree',
    company: 'Family Estate',
    jobTitle: 'Real Estate Developer & Diamond Investor',
    hobbies: 'Superyacht Cruises, Opera, Fine Wine, Equestrian Sports, Charity Galas',
    english: 'native',
    languages: 'English (native), French, German',
    selfDescription: 'A gracious, sophisticated woman who values honesty above all else. Having lived a full commercial life, my priority now is true companionship, love, laughter, and traveling the globe hand-in-hand.',
    comments: 'I offer my future husband unconditional love, serene luxury estates in Malibu and the Swiss Alps, plus an unrestricted monthly lifestyle stipend.',
    netWorth: '$62,000,000',
    monthlyAllowance: '$30,000 - $60,000 / mo',
    lookingFor: 'Charming, faithful and loving man ready for lifelong marriage and world travel',
    vipTier: 'Imperial',
    verified: true,
    onlineNow: true,
  },

  // 4. Lady Genevieve Laurent (Age 58) - Paris & Geneva
  {
    id: '381902',
    type: 'woman',
    name: 'Lady Genevieve Laurent',
    age: 58,
    originCity: 'Paris',
    originCountry: 'France',
    currentLocation: 'Geneva, Switzerland & Monaco',
    region: 'Europe',
    photo: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Libra, Rabbit',
    weight: '128lb, 58kg',
    height: '5\'7", 171cm',
    eyeColor: 'Hazel',
    hairColor: 'Brunette',
    maritalStatus: 'Divorced',
    children: 'None',
    religion: 'Catholic',
    smoker: 'No',
    drinker: 'Socially',
    education: 'University Degree',
    company: 'Private Enterprise',
    jobTitle: 'Private Banking Heiress & Art Curator',
    hobbies: 'Classical Piano, Wine Tasting, Monaco Regattas, Haute Couture',
    english: 'fluent',
    languages: 'French (native), English, Italian',
    selfDescription: 'Refined Parisian lady with a passionate heart. I am financially free and love spoiling the man I adore. I believe marriage should be an everyday celebration of love and mutual appreciation.',
    comments: 'Looking for an ambitious, romantic gentleman who will treat me like a lady and let me treat him like a king.',
    netWorth: '$34,000,000',
    monthlyAllowance: '$20,000 - $35,000 / mo',
    lookingFor: 'Romantic, sincere gentleman ready to settle down in marriage and luxury comfort',
    vipTier: 'Diamond VIP',
    verified: true,
    onlineNow: true,
  },

  // 5. Amina Bint-Khamis (Age 39) - Nairobi, Kenya & Dubai (Africa)
  {
    id: '492018',
    type: 'woman',
    name: 'Amina Bint-Khamis',
    age: 39,
    originCity: 'Nairobi',
    originCountry: 'Kenya',
    currentLocation: 'Nairobi & Downtown Dubai',
    region: 'Africa',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Aries, Snake',
    weight: '125lb, 57kg',
    height: '5\'8", 172cm',
    eyeColor: 'Dark Amber',
    hairColor: 'Black',
    maritalStatus: 'Single',
    children: 'None',
    religion: 'Spiritual',
    smoker: 'No',
    drinker: 'No',
    education: 'Master\'s Degree',
    company: 'Self-Employed / Founder',
    jobTitle: 'Coffee Exporter & Safari Luxury Resort Owner',
    hobbies: 'Wildlife Conservation, Aerial Photography, Gourmet Cuisine, Tennis',
    english: 'fluent',
    languages: 'English, Swahili, Arabic',
    selfDescription: 'Young, energetic, and successful entrepreneur. I run luxury safari lodges in the Serengeti and export organic coffee to Dubai and Europe. I want a strong, family-oriented man to marry.',
    comments: 'I am ready to provide visa sponsorship, financial backing, and unconditional love to a caring partner.',
    netWorth: '$21,500,000',
    monthlyAllowance: '$18,000 - $30,000 / mo',
    lookingFor: 'Family-minded, caring and romantic man ready for serious marriage and business synergy',
    vipTier: 'Platinum Royal',
    verified: true,
    onlineNow: true,
  },

  // 6. Eleanor Montgomery (Age 68) - Miami & Zurich
  {
    id: '772109',
    type: 'woman',
    name: 'Eleanor Montgomery',
    age: 68,
    originCity: 'Zurich',
    originCountry: 'Switzerland',
    currentLocation: 'Miami Beach, FL & St. Moritz',
    region: 'Europe',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Taurus, Dragon',
    weight: '138lb, 63kg',
    height: '5\'6", 168cm',
    eyeColor: 'Green',
    hairColor: 'Honey Blonde',
    maritalStatus: 'Widowed',
    children: 'None',
    religion: 'Christian',
    smoker: 'No',
    drinker: 'Rarely',
    education: 'University Degree',
    company: 'Family Estate',
    jobTitle: 'Commodity Trading Pioneer (Retired)',
    hobbies: 'Sailing, Philanthropy, Alpine Skiing, Modern Art Collecting',
    english: 'fluent',
    languages: 'German, English, French',
    selfDescription: 'A gracious woman of timeless elegance. I enjoy the tranquil ocean breeze in Miami and private chalet winters in Switzerland. Looking for a warm soul to share my remaining decades in joy and harmony.',
    comments: 'I will settle all financial needs for my husband and introduce him to the highest social circles with great affection.',
    netWorth: '$75,000,000',
    monthlyAllowance: '$35,000 - $70,000 / mo',
    lookingFor: 'Gentle, honest and devoted man seeking peaceful marriage and luxury life',
    vipTier: 'Imperial',
    verified: true,
    onlineNow: true,
  },

  // 7. Chantelle Kouassi (Age 47) - Abidjan, Ivory Coast & Paris (Africa)
  {
    id: '503194',
    type: 'woman',
    name: 'Chantelle Kouassi',
    age: 47,
    originCity: 'Abidjan',
    originCountry: 'Ivory Coast',
    currentLocation: 'Abidjan & Paris 8th Arrondissement',
    region: 'Africa',
    photo: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Scorpio, Rooster',
    weight: '132lb, 60kg',
    height: '5\'7", 170cm',
    eyeColor: 'Dark Brown',
    hairColor: 'Black Curly',
    maritalStatus: 'Single',
    children: 'None',
    religion: 'Catholic',
    smoker: 'No',
    drinker: 'Socially',
    education: 'Master\'s Degree',
    company: 'Self-Employed / Founder',
    jobTitle: 'Cocoa Processing & Luxury Real Estate Mogul',
    hobbies: 'French Gastronomy, Afro-Jazz Music, Spa Retreats, Fine Jewelry',
    english: 'good',
    languages: 'French (native), English, Baoule',
    selfDescription: 'Ambitious, glamorous and big-hearted woman. I have accomplished everything in business and now seek the missing piece: true love and marriage with a sincere man.',
    comments: 'I am ready to pamper my husband with luxury cars, beachfront villas in Assinie, and generous monthly deposits.',
    netWorth: '$28,000,000',
    monthlyAllowance: '$20,000 - $35,000 / mo',
    lookingFor: 'Kind, masculine and loving husband to cherish and support forever',
    vipTier: 'Diamond VIP',
    verified: true,
    onlineNow: true,
  },

  // 8. Oksana Petrenko (Age 37) - Odessa / Antalya
  {
    id: '228729',
    type: 'woman',
    name: 'Oksana Petrenko',
    age: 37,
    originCity: 'Odessa',
    originCountry: 'Ukraine',
    currentLocation: 'Antalya, Turkey & Dubai',
    region: 'Europe',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Pisces, Ox',
    weight: '118lb, 53kg',
    height: '5\'8", 172cm',
    eyeColor: 'Blue',
    hairColor: 'Chestnut',
    maritalStatus: 'Single',
    children: 'None',
    religion: 'Christian (Orthodox)',
    smoker: 'No',
    drinker: 'No',
    education: 'University Degree',
    company: 'Private Enterprise',
    jobTitle: 'Cosmetic Clinic Director & Luxury Spa Owner',
    hobbies: 'Pilates, Fashion, Beach Walks, Cooking Gourmet Pastries',
    english: 'good',
    languages: 'Ukrainian, Russian, English',
    selfDescription: 'Gentle, feminine and tender lady with a successful medical aesthetics practice. Ready to build a warm family and support my husband in all endeavors.',
    comments: 'Looking for a kind-hearted man who wants real romance, fidelity, and mutual support.',
    netWorth: '$11,200,000',
    monthlyAllowance: '$12,000 - $22,000 / mo',
    lookingFor: 'Devoted, handsome partner ready for marriage and international living',
    vipTier: 'Gold Elite',
    verified: true,
    onlineNow: true,
  },

  // 9. Sir Arthur Kensington (Age 65) - London & Palm Beach (Men 37-78)
  {
    id: '601928',
    type: 'man',
    name: 'Sir Arthur Kensington',
    age: 65,
    originCity: 'London',
    originCountry: 'United Kingdom',
    currentLocation: 'Mayfair (London) & Palm Beach, FL',
    region: 'Europe',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Virgo, Horse',
    weight: '178lb, 81kg',
    height: '6\'1", 185cm',
    eyeColor: 'Blue',
    hairColor: 'Silver Grey',
    maritalStatus: 'Divorced',
    children: '1 (Adult)',
    religion: 'Christian',
    smoker: 'No',
    drinker: 'Socially',
    education: 'Master\'s Degree',
    company: 'Private Enterprise',
    jobTitle: 'Hedge Fund Founder & Aviation Investor',
    hobbies: 'Classic Car Restoration, Yacht Regattas, Aspen Skiing, Opera',
    english: 'native',
    languages: 'English (native), French',
    selfDescription: 'Distinguished, fit and cultured British gentleman. I want to meet a sincere, loving woman to make my wife, share my fortune with, and take on luxurious vacations around the world.',
    comments: 'I provide black credit cards, private jet travel, mansion living, and an unconditional $30,000+ monthly allowance.',
    netWorth: '$85,000,000',
    monthlyAllowance: '$30,000 - $65,000 / mo',
    lookingFor: 'Loving, classy and warm-hearted woman ready for high-society marriage and pampered luxury',
    vipTier: 'Imperial',
    verified: true,
    onlineNow: true,
  },

  // 10. Alhaji Mansur Al-Hassan (Age 56) - Kano, Nigeria & Dubai (Africa / Men)
  {
    id: '819203',
    type: 'man',
    name: 'Alhaji Mansur Al-Hassan',
    age: 56,
    originCity: 'Kano',
    originCountry: 'Nigeria',
    currentLocation: 'Abuja & Palm Jumeirah (Dubai)',
    region: 'Africa',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Capricorn, Rat',
    weight: '185lb, 84kg',
    height: '6\'0", 183cm',
    eyeColor: 'Dark Brown',
    hairColor: 'Black / Salt & Pepper',
    maritalStatus: 'Widowed',
    children: '2 (Adults)',
    religion: 'Muslim',
    smoker: 'No',
    drinker: 'No',
    education: 'University Degree',
    company: 'Multinational Executive',
    jobTitle: 'Gold Refinery & Mineral Commodities Director',
    hobbies: 'Polo, Falconry, Luxury Yachting, Real Estate Architecture',
    english: 'fluent',
    languages: 'English, Hausa, Arabic',
    selfDescription: 'A generous, principled and wealthy gentleman. I hold traditional family values in the highest regard and seek a sweet, loyal woman to marry and treat like royalty.',
    comments: 'Offering lavish global lifestyle, private driver, visa sponsorship, luxury gifts, and complete financial peace of mind.',
    netWorth: '$52,000,000',
    monthlyAllowance: '$25,000 - $50,000 / mo',
    lookingFor: 'Respectful, cultured and devoted woman ready for high-class marriage and global lifestyle',
    vipTier: 'Imperial',
    verified: true,
    onlineNow: true,
  },

  // 11. Richard Vanderbilt-Hayes (Age 49) - San Francisco & Singapore
  {
    id: '920147',
    type: 'man',
    name: 'Richard Vanderbilt-Hayes',
    age: 49,
    originCity: 'San Francisco',
    originCountry: 'United States',
    currentLocation: 'Silicon Valley, CA & Marina Bay, Singapore',
    region: 'Americas',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Gemini, Monkey',
    weight: '172lb, 78kg',
    height: '5\'11", 180cm',
    eyeColor: 'Green',
    hairColor: 'Dark Brown',
    maritalStatus: 'Single',
    children: 'None',
    religion: 'Spiritual',
    smoker: 'No',
    drinker: 'Socially',
    education: 'Master\'s Degree',
    company: 'Self-Employed / Founder',
    jobTitle: 'AI Tech Venture Capitalist & Commercial Real Estate Tycoon',
    hobbies: 'Helicopter Skiing, Scuba Diving, Modern Art, Philanthropy',
    english: 'native',
    languages: 'English (native), Spanish, Mandarin',
    selfDescription: 'Active, athletic and visionary investor. Looking for a genuine, affectionate partner to build a joyful home and travel together on private charters.',
    comments: 'Full financial security, luxury penthouse living, and unconditional monthly sponsorship for my future bride.',
    netWorth: '$68,000,000',
    monthlyAllowance: '$25,000 - $55,000 / mo',
    lookingFor: 'Affectionate, elegant and loyal woman for serious marriage and luxury global living',
    vipTier: 'Diamond VIP',
    verified: true,
    onlineNow: true,
  },

  // 12. Thabo Mokoena (Age 74) - Johannesburg, South Africa & Cape Town (Africa / Men)
  {
    id: '318290',
    type: 'man',
    name: 'Thabo Mokoena',
    age: 74,
    originCity: 'Johannesburg',
    originCountry: 'South Africa',
    currentLocation: 'Camps Bay (Cape Town) & Geneva',
    region: 'Africa',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    ],
    zodiac: 'Aquarius, Dog',
    weight: '175lb, 79kg',
    height: '5\'10", 178cm',
    eyeColor: 'Dark Brown',
    hairColor: 'White / Silver',
    maritalStatus: 'Widowed',
    children: '3 (Adults & Established)',
    religion: 'Christian',
    smoker: 'No',
    drinker: 'Rarely',
    education: 'University Degree',
    company: 'Family Estate',
    jobTitle: 'Platinum Mining Pioneer & Vineyard Owner',
    hobbies: 'Winemaking, Safari Reserves, Classical Jazz, Vintage Mercedes',
    english: 'fluent',
    languages: 'English, Zulu, Afrikaans',
    selfDescription: 'A peaceful, wise and generous gentleman. I own world-renowned vineyards in Stellenbosch and oceanfront villas. Seeking a devoted, warm woman to marry and share life’s sweetest moments.',
    comments: 'My wife will be cherished with endless respect, royal comfort, and a permanent multi-million trust fund.',
    netWorth: '$94,000,000',
    monthlyAllowance: '$35,000 - $80,000 / mo',
    lookingFor: 'Gentle, loyal and loving woman who seeks peaceful marriage, honor and luxury lifestyle',
    vipTier: 'Imperial',
    verified: true,
    onlineNow: false,
  }
];

// Helper Pool for procedurally synthesizing millions of authentic dating profiles on demand
const FIRST_NAMES_WOMEN = [
  'Ngozi', 'Yuliya', 'Amara', 'Anastasia', 'Fatoumata', 'Svetlana', 'Zainab', 'Kateryna', 
  'Oluchi', 'Ekaterina', 'Amina', 'Daria', 'Funke', 'Nataliya', 'Aicha', 'Victoria', 
  'Chioma', 'Elena', 'Khadija', 'Valeriia', 'Blessing', 'Mariam', 'Zoya', 'Binta', 'Lana'
];

const LAST_NAMES_WOMEN = [
  'Okonkwo', 'Ivanova', 'Diallo', 'Shevchenko', 'Adeyemi', 'Kovalchuk', 'Toure', 'Morozova',
  'Mensah', 'Petrova', 'Keita', 'Popova', 'Dlamini', 'Kuznetsova', 'Kamara', 'Smirnova'
];

const FIRST_NAMES_MEN = [
  'Kwame', 'Dmitri', 'Babajide', 'Alexander', 'Mamadou', 'Viktor', 'Tariq', 'Nikolai',
  'Emeka', 'Maxim', 'Ousmane', 'Sergei', 'Ibrahim', 'Vladimir', 'Tendai', 'Charles'
];

const LAST_NAMES_MEN = [
  'Adeleke', 'Romanov', 'Koffi', 'Sokolov', 'Sow', 'Lebedev', 'Osei', 'Kozlov', 
  'Balogun', 'Novikov', 'Traore', 'Vasiliev', 'Moyo', 'Mikhailov'
];

const CITIES_AFRICA = [
  { city: 'Lagos', country: 'Nigeria' },
  { city: 'Accra', country: 'Ghana' },
  { city: 'Nairobi', country: 'Kenya' },
  { city: 'Johannesburg', country: 'South Africa' },
  { city: 'Abidjan', country: 'Ivory Coast' },
  { city: 'Dakar', country: 'Senegal' },
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Casablanca', country: 'Morocco' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'Dar es Salaam', country: 'Tanzania' }
];

const CITIES_EUROPE = [
  { city: 'Kiev', country: 'Ukraine' },
  { city: 'Paris', country: 'France' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Zurich', country: 'Switzerland' },
  { city: 'Monaco', country: 'Monaco' },
  { city: 'Vienna', country: 'Austria' },
  { city: 'Milan', country: 'Italy' },
  { city: 'Odessa', country: 'Ukraine' }
];

const CITIES_GLOBAL = [
  { city: 'Dubai', country: 'UAE' },
  { city: 'Miami', country: 'United States' },
  { city: 'Singapore', country: 'Singapore' },
  { city: 'Beverly Hills', country: 'United States' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Ankara', country: 'Turkey' }
];

const FEMALE_PHOTOS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
];

const MALE_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
];

const ZODIACS = [
  'Sagittarius, Dog', 'Leo, Tiger', 'Cancer, Pig', 'Taurus, Dragon', 
  'Aries, Snake', 'Scorpio, Rooster', 'Libra, Rabbit', 'Pisces, Ox', 'Capricorn, Rat', 'Aquarius, Horse'
];

export function generateRandomDatingProfiles(count: number = 6, filterType?: 'woman' | 'man', filterRegion?: string): DatingProfile[] {
  const generated: DatingProfile[] = [];

  for (let i = 0; i < count; i++) {
    const isWoman = filterType ? filterType === 'woman' : Math.random() > 0.4;
    const age = Math.floor(Math.random() * (78 - 37 + 1)) + 37; // Ages 37 to 78
    
    // Choose Region
    let region: 'Africa' | 'Europe' | 'Americas' | 'Middle East & Asia' = 'Europe';
    let locObj = CITIES_EUROPE[Math.floor(Math.random() * CITIES_EUROPE.length)];

    if (filterRegion === 'Africa' || (!filterRegion && Math.random() > 0.45)) {
      region = 'Africa';
      locObj = CITIES_AFRICA[Math.floor(Math.random() * CITIES_AFRICA.length)];
    } else if (filterRegion === 'Americas' || (!filterRegion && Math.random() > 0.75)) {
      region = 'Americas';
      locObj = CITIES_GLOBAL[Math.floor(Math.random() * CITIES_GLOBAL.length)];
    }

    const firstName = isWoman
      ? FIRST_NAMES_WOMEN[Math.floor(Math.random() * FIRST_NAMES_WOMEN.length)]
      : FIRST_NAMES_MEN[Math.floor(Math.random() * FIRST_NAMES_MEN.length)];
    
    const lastName = isWoman
      ? LAST_NAMES_WOMEN[Math.floor(Math.random() * LAST_NAMES_WOMEN.length)]
      : LAST_NAMES_MEN[Math.floor(Math.random() * LAST_NAMES_MEN.length)];

    const id = `${Math.floor(100000 + Math.random() * 900000)}`;
    const photo = isWoman
      ? FEMALE_PHOTOS[Math.floor(Math.random() * FEMALE_PHOTOS.length)]
      : MALE_PHOTOS[Math.floor(Math.random() * MALE_PHOTOS.length)];

    const millions = (12 + Math.random() * 65).toFixed(1);
    const allowanceLow = Math.floor(12 + Math.random() * 15);
    const allowanceHigh = allowanceLow + Math.floor(10 + Math.random() * 25);

    const weights = ['118lb, 53kg', '124lb, 56kg', '132lb, 60kg', '140lb, 63kg', '165lb, 75kg', '180lb, 81kg'];
    const heights = ['5\'6", 168cm', '5\'7", 170cm', '5\'8", 173cm', '5\'10", 178cm', '6\'0", 183cm', '6\'2", 188cm'];

    generated.push({
      id,
      type: isWoman ? 'woman' : 'man',
      name: `${firstName} ${lastName}`,
      age,
      originCity: locObj.city,
      originCountry: locObj.country,
      currentLocation: `${locObj.city}, ${locObj.country} & International`,
      region,
      photo,
      gallery: [photo],
      zodiac: ZODIACS[Math.floor(Math.random() * ZODIACS.length)],
      weight: weights[Math.floor(Math.random() * weights.length)],
      height: heights[Math.floor(Math.random() * heights.length)],
      eyeColor: isWoman ? (Math.random() > 0.5 ? 'Green' : 'Brown') : 'Dark Brown',
      hairColor: isWoman ? (Math.random() > 0.4 ? 'Blonde' : 'Black') : 'Dark / Salt & Pepper',
      maritalStatus: age > 60 ? 'Widowed' : (Math.random() > 0.5 ? 'Single' : 'Divorced'),
      children: age > 55 ? 'Adults & Independent' : 'None',
      religion: region === 'Africa' ? (Math.random() > 0.3 ? 'Christian' : 'Muslim') : 'Christian (Orthodox)',
      smoker: 'No',
      drinker: Math.random() > 0.6 ? 'Socially' : 'No',
      education: 'University Degree',
      company: 'Private Enterprise',
      jobTitle: isWoman ? 'Business Magnate & Luxury Investor' : 'Corporate Executive & Real Estate Tycoon',
      hobbies: 'World Travel, Art Galleries, Fine Dining, Luxury Resorts, Music',
      english: 'fluent',
      languages: `${locObj.country} Native, English, French`,
      selfDescription: `I am an ambitious, kind and loving ${isWoman ? 'lady' : 'gentleman'} with family values and substantial financial freedom. Looking for a sincere partner to marry and spoil with unlimited care and comfort.`,
      comments: `Looking for real love and devotion. I provide full luxury lifestyle, housing, and $${allowanceLow},000 - $${allowanceHigh},000/mo allowance to my future partner.`,
      netWorth: `$${millions},000,000`,
      monthlyAllowance: `$${allowanceLow},000 - $${allowanceHigh},000 / mo`,
      lookingFor: `Genuine, caring partner ready for serious marriage, mutual respect, and luxury living together`,
      vipTier: 'Diamond VIP',
      verified: true,
      onlineNow: Math.random() > 0.3,
    });
  }

  return generated;
}

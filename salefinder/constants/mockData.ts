export interface Comment {
  user: string;
  color: string;
  text: string;
}

export interface Deal {
  id: number;
  category: string;
  store: string;
  storeId: string;
  icon: string;
  location: string;
  badge: 'mystery' | 'deal' | 'new';
  badgeText: string;
  title: string;
  desc: string;
  price: string | null;
  oldPrice: string | null;
  discount: string | null;
  poster: string;
  posterColor: string;
  time: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

export interface ShopDeal {
  name: string;
  price: string;
}

export interface Shop {
  name: string;
  icon: string;
  address: string;
  category: string;
  verified: boolean;
  deals: ShopDeal[];
}

export const DEALS: Deal[] = [
  {
    id: 1,
    category: 'mystery',
    store: 'Ravensburger Shop',
    storeId: 'ravensburger',
    icon: '🎲',
    location: '180m · Mariahilfer Str.',
    badge: 'mystery',
    badgeText: '🎁 Mystery Box',
    title: 'Mystery Boxes sind wieder da!',
    desc: 'Gerade zufällig entdeckt — Ravensburger hat wieder Mystery Boxes! Verschiedene Größen, Inhalt unbekannt. Lohnt sich wirklich!',
    price: '€14,99',
    oldPrice: null,
    discount: null,
    poster: 'nico_deals',
    posterColor: '#ff5c35',
    time: 'vor 2 Std.',
    likes: 24,
    liked: false,
    comments: [
      { user: 'LisaShops', color: '#2ecc71', text: 'Danke für den Tipp! Fahre gleich hin 🏃' },
      { user: 'KarlMystery', color: '#ffb800', text: 'Die mit dem blauen Etikett sollen am besten sein!' },
    ],
  },
  {
    id: 2,
    category: 'tech',
    store: 'Saturn',
    storeId: 'saturn',
    icon: '📱',
    location: '320m · Mariahilfer Str.',
    badge: 'deal',
    badgeText: '🔥 Deal',
    title: 'Samsung Galaxy S25 −30%',
    desc: 'Heute nur! Galaxy S25 für €699 statt €999. Nur solange Vorrat reicht.',
    price: '€699',
    oldPrice: '€999',
    discount: '−30%',
    poster: 'MaxTechDeals',
    posterColor: '#4a9eff',
    time: 'vor 4 Std.',
    likes: 61,
    liked: false,
    comments: [
      { user: 'Sandra_Deals', color: '#ff5c35', text: 'Bestätigt! Bin gerade dort, haben noch ~15 Stück.' },
    ],
  },
  {
    id: 3,
    category: 'food',
    store: 'Billa Plus',
    storeId: 'billa',
    icon: '🛒',
    location: '410m · Neubaugasse',
    badge: 'new',
    badgeText: '✨ Neu',
    title: 'Wochenangebote gestartet',
    desc: "Ribeye Steak −40%, Ben & Jerry's 2+1 gratis, Avocados 3 für €2. Läuft bis Samstag.",
    price: null,
    oldPrice: null,
    discount: null,
    poster: 'Sandra_Deals',
    posterColor: '#ff5c35',
    time: 'vor 6 Std.',
    likes: 38,
    liked: false,
    comments: [
      { user: 'nico_deals', color: '#ff5c35', text: 'Das Steak war ein Traum 🥩' },
    ],
  },
  {
    id: 4,
    category: 'mode',
    store: 'Zara',
    storeId: 'zara',
    icon: '👗',
    location: '600m · Kärntner Str.',
    badge: 'deal',
    badgeText: '🔥 Sale',
    title: 'End of Season Sale bis −50%',
    desc: 'Sommer-Kollektion massiv reduziert. Größen werden weniger — am besten heute noch hingehen.',
    price: 'ab €9,99',
    oldPrice: null,
    discount: null,
    poster: 'LisaShops',
    posterColor: '#2ecc71',
    time: 'vor 1 Tag',
    likes: 92,
    liked: true,
    comments: [
      { user: 'Sandra_Deals', color: '#ff5c35', text: 'War heute dort, die Jeans-Abteilung ist top 👖' },
      { user: 'MaxTechDeals', color: '#4a9eff', text: 'Für meinen Bruder perfekt, danke!' },
    ],
  },
  {
    id: 5,
    category: 'toy',
    store: 'Müller',
    storeId: 'mueller',
    icon: '🧸',
    location: '250m · Neubaugasse',
    badge: 'new',
    badgeText: '✨ Neu',
    title: 'LEGO Technic Set −25%',
    desc: 'Mehrere Sets stark reduziert. Besonders das Bugatti-Modell für €89 statt €120!',
    price: '€89',
    oldPrice: '€120',
    discount: '−25%',
    poster: 'KarlMystery',
    posterColor: '#ffb800',
    time: 'vor 8 Std.',
    likes: 45,
    liked: false,
    comments: [],
  },
  {
    id: 6,
    category: 'tech',
    store: 'MediaMarkt',
    storeId: 'mediamarkt',
    icon: '🖥️',
    location: '500m · Mariahilfer Str.',
    badge: 'deal',
    badgeText: '🔥 Deal',
    title: 'MacBook Air M3 Knaller!',
    desc: 'MacBook Air 13" M3 für €1.099 — bisher niedrigster Preis in Wien! Nur noch 3 Stück.',
    price: '€1.099',
    oldPrice: '€1.299',
    discount: '−15%',
    poster: 'MaxTechDeals',
    posterColor: '#4a9eff',
    time: 'vor 12 Std.',
    likes: 118,
    liked: false,
    comments: [
      { user: 'nico_deals', color: '#ff5c35', text: 'Bin schon unterwegs!' },
      { user: 'LisaShops', color: '#2ecc71', text: 'Danke! Habe einen gebraucht 🙌' },
    ],
  },
];

export const SHOPS: Record<string, Shop> = {
  ravensburger: {
    name: 'Ravensburger Shop',
    icon: '🎲',
    address: 'Mariahilfer Str. 85, Wien',
    category: 'Spielzeug & Spiele',
    verified: false,
    deals: [
      { name: '🎁 Mystery Box S', price: '€14,99' },
      { name: '🎁 Mystery Box L', price: '€29,99' },
      { name: '🧩 Puzzle 1000er −20%', price: '€19,99' },
    ],
  },
  saturn: {
    name: 'Saturn',
    icon: '📱',
    address: 'Mariahilfer Str. 2, Wien',
    category: 'Elektronik & Tech',
    verified: true,
    deals: [
      { name: '📱 Samsung Galaxy S25', price: '€699 (−30%)' },
      { name: '🎧 Sony WH-1000XM5', price: '€249 (−17%)' },
      { name: '💻 MacBook Air M3', price: '€1.099 (−8%)' },
    ],
  },
  billa: {
    name: 'Billa Plus',
    icon: '🛒',
    address: 'Neubaugasse 12, Wien',
    category: 'Lebensmittel',
    verified: true,
    deals: [
      { name: '🥩 Ribeye Steak', price: '−40%' },
      { name: '🍦 Ben & Jerrys', price: '2+1 gratis' },
      { name: '🥑 Avocados', price: '3 für €2' },
    ],
  },
  zara: {
    name: 'Zara',
    icon: '👗',
    address: 'Kärntner Str. 28, Wien',
    category: 'Mode & Lifestyle',
    verified: true,
    deals: [
      { name: '👖 Jeans', price: 'ab €19,99' },
      { name: '👕 T-Shirts', price: 'ab €9,99' },
      { name: '👗 Sommerkleider', price: '−50%' },
    ],
  },
  mueller: {
    name: 'Müller',
    icon: '🧸',
    address: 'Neubaugasse 5, Wien',
    category: 'Spielzeug & Drogerie',
    verified: false,
    deals: [
      { name: '🧸 LEGO Technic', price: '−25%' },
    ],
  },
  mediamarkt: {
    name: 'MediaMarkt',
    icon: '🖥️',
    address: 'Mariahilfer Str. 18, Wien',
    category: 'Elektronik',
    verified: true,
    deals: [
      { name: '💻 MacBook Air M3', price: '€1.099 (−15%)' },
      { name: '📱 iPhone 16', price: '€899 (−10%)' },
    ],
  },
};

export const TOP_SHOPPERS = [
  { id: 'sandra', name: 'Sandra_Deals', handle: '@sandra_deals', color: '#ff5c35', deals: 89, followers: 512 },
  { id: 'max', name: 'MaxTechDeals', handle: '@maxtechdeals', color: '#4a9eff', deals: 134, followers: 890 },
  { id: 'lisa', name: 'LisaShops', handle: '@lisashops', color: '#2ecc71', deals: 67, followers: 445 },
  { id: 'karl', name: 'KarlMystery', handle: '@karlmystery', color: '#ffb800', deals: 52, followers: 320 },
];

export const MAP_PINS = [
  { id: 'ravensburger', storeId: 'ravensburger', label: '🎲 €14,99', x: 0.2, y: 0.25, color: '#ffb800' },
  { id: 'saturn', storeId: 'saturn', label: '📱 −30%', x: 0.55, y: 0.35, color: '#ff5c35' },
  { id: 'billa', storeId: 'billa', label: '🛒 Sale', x: 0.35, y: 0.55, color: '#2ecc71' },
  { id: 'zara', storeId: 'zara', label: '👗 −50%', x: 0.7, y: 0.6, color: '#ff5c35' },
  { id: 'mueller', storeId: 'mueller', label: '🧸 −25%', x: 0.15, y: 0.65, color: '#2ecc71' },
  { id: 'mediamarkt', storeId: 'mediamarkt', label: '🖥️ −15%', x: 0.8, y: 0.3, color: '#ff5c35' },
];

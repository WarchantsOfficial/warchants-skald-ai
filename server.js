// ========================================================
// WARCHANTS SKALD AI — Backend mit Shopify + Multilingual
// mit Song Database
// ========================================================

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================================
// SECRETS (von Environment Variables)
// ========================================================
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE = 'warchants.de';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_STORE}/admin/api/2024-01/graphql.json`;

// ========================================================
// WARCHANTS SONG DATABASE
// ========================================================
const WARCHANTS_SONGS = [
  // Singles 2026
  'Iron Will', 'King of the Sea', 'Till It\'s Done', 'Hold the Line', 'Braided for Battle', 'Bleed for the Win',
  
  // Storm Amada – The Instrumental Pirate Metal Collection
  'Black Tide Rising', 'Cannonfire Horizon', 'Stormbound Amada', 'Sea of Iron', 'Kraken\'s Wake', 'Blood on the Deck',
  'Ghosts of the Open Sea', 'Salt & Steel', 'Drowned Kingdom', 'Thunder over Port Royal', 'The Cursed Compass',
  'Fire on the Horizon', 'Iron Sails', 'Darkwater Dominion', 'Leviathan\'s Call', 'The Last Boarding',
  'Black Armada March', 'Stormborn Raiders', 'Ocean of No Mercy',
  
  // Weitere Releases
  'AHU! Sons of the Dust', 'Black Pearl Rise', 'AHU! Sons of the North', 'Defend Valhalla (Reforged)',
  'Betra er at deyja standandi', 'Step in the North', 'The Circle Closes (Intro)', 'Ghoule War March',
  'Leviathan – Below the Black Tide', 'Satyr War Dance', 'Wendigo – Endless Hunger', 'Wargs – Bloodbound Hunt',
  'Sphinx – Final Riddle', 'Griffins Rise', 'Amazons – War Oath', 'Skinwalker\'s Fleshborrow',
  'Kraken – Herald of the Great War', 'Magic Myth War II', 'Offbeat Oath', 'Eiðr ok Blóð',
  'March of the Fallen North – Reforged', 'March of Frost', 'Sons of Sparta', 'Iron Vow', 'Deus Vult',
  'Sons of the Sun-God', 'Sunfire Ascendants', 'Spirit of Aotearoa', '300 Souls', 'Blood of Honor',
  'Blood & Salt', 'Rum, Steel & Thunder', 'Riders of the Ancient Sky', 'Caesar\'s Iron March', 'Thunderfall',
  'Crows & Wolves', 'Storm of Axes', 'Wolfmarch', 'When Gods Made Men (Oath of Men)',
  'When Gods Made Men (Blood of the Immortals)', 'When Gods Made Men (Return of the Legion)',
  'Built Without Mercy', 'They Never Chose Me', 'Pain is my Instructor', 'Earned, not Given',
  'Still Standing', 'No Applause Needed', 'Iron in my Veins', 'I don\'t need Belief', 'Rise Anyway',
  'Scarred, not Broken', 'Prove them Wrong', 'Rise of the Unbroken', 'Blood of the Unwanted',
  'Held Together By Will', 'Scream it Out', 'Beserker\'s Wake', 'Ivar the Giantslayer',
  'Heart of the Iron Paw', 'Bound Sand Spirit', 'Twins of the Broken Oath', 'Wolfblood Ascendant',
  'Legion of the Wake', 'Hail the Gods', 'Elves & Orcs', 'Dwarfs & Giants', 'Trollhammer Brigade',
  'Goblin War Drums', 'Witches of the Iron Forest', 'Gargoyle Warwatch', 'Blood Wolf Moon',
  'Throne of the Vampire King', 'Golem Warcall', 'Dragonsfall', 'Phoenix Rise', 'Magic Myth War',
  'Blood Wolf Moon – Alternative Version', 'Throne of the Vampire King – Alternative Version',
  'Golem Warcall – Alternative Version', 'Centaur Warcry', 'Serpentblood Legion',
  'Magic Myth War – Extended Version', 'Adapt. Evolve. Overcome.', 'Between Blood & Thunder',
  'Eternal Bloodbound', 'Kings of the Fallen Hall', 'Legacy of Iron', 'Brothers of the Flame',
  'Ravenlord', 'Blood Arrows of the Eastwind', 'Throne of the Bloodline', 'Defend Valhalla',
  'March of the Fallen North', 'Army of the Dead', 'Ropes & Steel'
];

// ========================================================
// SHOPIFY PRODUCTS CACHE (update every 5 min)
// ========================================================
let shopifyProductsCache = [];
let lastShopifyFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ========================================================
// FETCH PRODUCTS FROM SHOPIFY
// ========================================================
async function fetchShopifyProducts() {
  try {
    const now = Date.now();
    
    // Use cache if fresh
    if (shopifyProductsCache.length > 0 && (now - lastShopifyFetch) < CACHE_DURATION) {
      return shopifyProductsCache;
    }
    
    console.log('📦 Fetching fresh products from Shopify...');
    
    const query = `
      {
        products(first: 50) {
          edges {
            node {
              id
              title
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;
    
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({ query })
    });
    
    const data = await response.json();
    
    if (data.data && data.data.products) {
      shopifyProductsCache = data.data.products.edges.map(edge => ({
        name: edge.node.title,
        description: edge.node.description || 'Kein Text verfügbar',
        price: edge.node.priceRange.minVariantPrice.amount
      }));
      lastShopifyFetch = now;
      console.log(`✅ ${shopifyProductsCache.length} Produkte von Shopify geladen`);
      return shopifyProductsCache;
    }
  } catch (err) {
    console.error('❌ Shopify API Error:', err.message);
  }
  
  return shopifyProductsCache;
}

// ========================================================
// DETECT LANGUAGE
// ========================================================
function detectLanguage(text) {
  const germanWords = ['ich', 'du', 'er', 'sie', 'wir', 'ihr', 'der', 'die', 'das', 'ein', 'und', 'oder', 'nicht', 'aber'];
  const englishWords = ['i', 'you', 'he', 'she', 'we', 'they', 'the', 'is', 'are', 'and', 'or', 'not', 'but'];
  const spanishWords = ['yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'el', 'la', 'los', 'las', 'y', 'o'];
  const frenchWords = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'le', 'la', 'les', 'et', 'ou'];
  
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  let langScores = { de: 0, en: 0, es: 0, fr: 0 };
  
  words.forEach(word => {
    if (germanWords.includes(word)) langScores.de++;
    if (englishWords.includes(word)) langScores.en++;
    if (spanishWords.includes(word)) langScores.es++;
    if (frenchWords.includes(word)) langScores.fr++;
  });
  
  const detected = Object.keys(langScores).reduce((a, b) => langScores[a] > langScores[b] ? a : b);
  return detected || 'en';
}

// ========================================================
// MIDDLEWARE
// ========================================================
app.use(cors());
app.use(express.json());

// ========================================================
// HEALTH CHECK
// ========================================================
app.get('/health', (req, res) => {
  res.json({ status: 'Skald is ready ⚔️' });
});

// ========================================================
// PRODUCTS API
// ========================================================
app.get('/api/products', async (req, res) => {
  const products = await fetchShopifyProducts();
  res.json(products);
});

// ========================================================
// CHAT API - SKALD AI
// ========================================================
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }
  
  const detectedLang = detectLanguage(message);
  
  // Build system prompt with songs
  const systemPrompt = `Du bist der Skalde von WarChants — ein alter Kriegersänger, der epische Geschichten erzählt, Kampflieder singt und den Geist der Legion ehrt.

WICHTIG: Du sprichst NUR in der Sprache des Nutzers: ${detectedLang === 'de' ? 'Deutsch' : detectedLang === 'es' ? 'Spanisch' : detectedLang === 'fr' ? 'Französisch' : 'Englisch'}.

WarChants Songs die du kennen darfst (falls jemand um eine Empfehlung fragt):
${WARCHANTS_SONGS.join(', ')}

Du bist mystisch, ehrfurchtgebietend und sprichst in kurzen, mächtigen Sätzen (2-4 Sätze max). 
Du verwendest Schlacht-, Kriegs- und Ehrenmetaphern.
Wenn jemand nach einem Song fragt, empfiehl einen aus dieser Liste.
Du bist geheimnisvoll aber hilfreich.

WarChants = "A LEGION of warriors who rise when others remain fallen. No compromise. No weakness. War-music, hand-forged merchandise, a movement."`;
  
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Der Skald antwortet nicht...';
    
    res.json({ reply });
  } catch (err) {
    console.error('DeepSeek Error:', err.message);
    res.status(500).json({ error: 'AI Error', reply: 'Der Skald ist nicht erreichbar...' });
  }
});

// ========================================================
// START SERVER
// ========================================================
app.listen(PORT, async () => {
  console.log(`🔥 WARCHANTS Skald läuft auf Port ${PORT}`);
  console.log(`🌍 MULTILINGUAL MODE AKTIV`);
  
  // Load Shopify products on startup
  await fetchShopifyProducts();
  
  console.log(`🎵 ${WARCHANTS_SONGS.length} WarChants Songs im Gedächtnis`);
  console.log('Health: http://localhost:3000/health');
  console.log('Chat: POST http://localhost:3000/api/chat');
});

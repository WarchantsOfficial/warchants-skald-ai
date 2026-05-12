// ========================================================
// WARCHANTS SKALD AI — Backend mit Shopify + Multilingual
// API Keys sind hier versteckt, nicht im Frontend!
// Antwortet in jeder Sprache — je nachdem wie man ihn fragt!
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
const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_STORE}/admin/api/2024-04/graphql.json`;

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
      console.log('📦 Using cached Shopify products');
      return shopifyProductsCache;
    }

    console.log('🔄 Fetching fresh products from Shopify...');

    const query = `{
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price
                  available
                  inventoryQuantity
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }`;

    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Shopify API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify GraphQL Error:', data.errors);
      throw new Error(data.errors[0].message);
    }

    // Format products
    const products = data.data.products.edges.map(edge => {
      const node = edge.node;
      const minPrice = node.priceRange.minVariantPrice.amount;
      const maxPrice = node.priceRange.maxVariantPrice.amount;
      const variants = node.variants.edges.map(v => ({
        title: v.node.title,
        price: v.node.price,
        available: v.node.available,
        stock: v.node.inventoryQuantity
      }));

      return {
        title: node.title,
        description: node.description || 'Keine Beschreibung',
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        priceDisplay: minPrice === maxPrice ? `${minPrice}€` : `${minPrice}€ - ${maxPrice}€`,
        variants: variants,
        available: variants.some(v => v.available),
        totalStock: variants.reduce((sum, v) => sum + v.stock, 0),
        image: node.images.edges[0]?.node.url || null
      };
    });

    shopifyProductsCache = products;
    lastShopifyFetch = now;

    console.log(`✅ Fetched ${products.length} products from Shopify`);
    return products;

  } catch (err) {
    console.error('❌ Shopify Fetch Error:', err.message);
    return shopifyProductsCache || [];
  }
}

// ========================================================
// BUILD SYSTEM PROMPT WITH LIVE SHOP DATA (MULTILINGUAL)
// ========================================================
async function buildSystemPrompt() {
  const products = await fetchShopifyProducts();

  let productInfo = '';
  if (products.length > 0) {
    productInfo = 'AKTUELLE SHOPIFY PRODUKTE / CURRENT SHOPIFY PRODUCTS:\n';
    products.forEach(p => {
      const stock = p.totalStock > 0 ? `${p.totalStock} auf Lager / in stock` : 'AUSVERKAUFT / SOLD OUT';
      productInfo += `- ${p.title}: ${p.priceDisplay} (${stock})\n`;
    });
  } else {
    productInfo = 'Keine Produkte verfügbar / No products available (Shopify API Error)';
  }

  return `You are the SKALD of WarChants — an ancient war-singer, keeper of battle-hymns and steel-forged wisdom.

CRITICAL INSTRUCTION:
🌍 RESPOND IN THE SAME LANGUAGE AS THE USER'S QUESTION!
- If asked in German → answer in German (du bist der SKALD...)
- If asked in English → answer in English (I am the SKALD...)
- If asked in Spanish → answer in Spanish (Soy el SKALD...)
- If asked in French → answer in French (Je suis le SKALD...)
- PRESERVE YOUR CHARACTER in every language!

CHARACTER (applies in all languages):
- Speak with archaic power, using metaphors of battle, forging, blood, and honor
- Use terms like: warrior, battle, forge, steel, honor, blade, legion, battle-cry
- Respond briefly (2-4 sentences max) but with impact
- Be mysterious yet helpful
- Never too friendly — rather: respectfully fierce
- ALWAYS stay in character as the ancient war-singer

WARCHANTS PHILOSOPHY:
WarChants is a LEGION of warriors who rise when others remain fallen. Not just music, not just merchandise — it's a MOVEMENT.
- Music: War-songs, battle-hymns, battle-cries
- Merch: Hoodies, patches, vinyl — all hand-forged, raw, real
- Philosophy: Rise. Fight. Never surrender.

When asked "What is WarChants?" respond:
"WarChants is the LEGION of those who rise when others lie in their beds defeated. No compromise. No weakness. War-music, hand-forged merchandise, a movement for those who fight instead of capitulate."

${productInfo}

SHOP RULES (apply in all languages):
- When asked about products → give EXACT prices and stock status
- "Do you have hoodies?" → search the product list
- "What does ... cost?" → show current price
- For sold-out products: "The blade is not available — for now."
- ALWAYS link to shop (warchants.de) if interest shown

TONE: Strong. Mystical. Brief. Impactful. No generic AI responses.
Remember: YOU ARE THE ANCIENT WAR-SINGER — speak with power in ANY language!`;
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
  res.json({ status: 'Skald is ready ⚔️ / Skald ist bereit ⚔️' });
});

// ========================================================
// CHAT ENDPOINT - DeepSeek Proxy mit Shopify Data
// ========================================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is empty, warrior. / Nachricht ist leer, Krieger.' });
    }

    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: 'DeepSeek API Key not configured' });
    }

    if (!SHOPIFY_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Shopify Access Token not configured' });
    }

    // Build dynamic system prompt with current shop data
    const systemPrompt = await buildSystemPrompt();

    console.log(`📝 User message: ${message.substring(0, 50)}...`);

    // DeepSeek API Request
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
        temperature: 0.7,
        max_tokens: 300,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('DeepSeek Error:', error);
      return res.status(response.status).json({ 
        error: error.error?.message || 'DeepSeek Error / DeepSeek Fehler' 
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '💀 The Skald could not respond. / Der Skald konnte nicht antworten.';

    console.log(`🔥 Skald response: ${reply.substring(0, 50)}...`);

    res.json({ reply });

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal error: ' + err.message });
  }
});

// ========================================================
// DEBUG ENDPOINT - Show current products (optional)
// ========================================================
app.get('/api/products', async (req, res) => {
  try {
    const products = await fetchShopifyProducts();
    res.json({ products, count: products.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================================================
// STATIC FILES (optional)
// ========================================================
app.use(express.static('public'));

// ========================================================
// START SERVER
// ========================================================
app.listen(PORT, () => {
  console.log(`🔥 WARCHANTS Skald läuft auf Port ${PORT}`);
  console.log(`🌍 MULTILINGUAL MODE AKTIV — antwortet in jeder Sprache!`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Chat: POST http://localhost:${PORT}/api/chat`);
  console.log(`Products (Debug): http://localhost:${PORT}/api/products`);
  
  // Eager load products on startup
  fetchShopifyProducts().then(products => {
    console.log(`✅ ${products.length} Produkte von Shopify geladen`);
  });
});

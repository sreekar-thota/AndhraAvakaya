import fs from 'node:fs';
import path from 'node:path';
import { getSupabaseClient } from './supabaseClient.js';

export const VALID_PRODUCT_IDS = new Set([
  // Veg Pickles (9)
  'avakaya-pickle',
  'menthi-avakaya-pickle',
  'maagaya-pickle',
  'usirikaya-pickle',
  'allam-pachadi',
  'gongura-pachadi',
  'tomato-pachadi',
  'nalleru-kada-pachadi',
  'cauliflower-pachadi',
  // Non-Veg Pickles (11)
  'chicken-pickle',
  'prawns-pickle',
  'mutton-pickle',
  'fish-pickle',
  'gongura-chicken-bone-pickle',
  'gongura-chicken-boneless-pickle',
  'gongura-prawns-pickle',
  'gongura-mutton-pickle',
  'gongura-mutton-boneless-pickle',
  'country-chicken-pickle',
  'crab-pickle'
]);

// In-memory cache for fast lookups & read-only fallbacks
let inMemoryStockCache = null;

/**
 * Get initial default stock dictionary for all 20 products
 */
export function getDefaultStock() {
  const stock = {};
  const now = new Date().toISOString();
  for (const id of VALID_PRODUCT_IDS) {
    stock[id] = {
      inStock: true,
      note: '',
      updatedAt: now
    };
  }
  return stock;
}

/**
 * Read persistent stock from Supabase (or fallback to cache/local file)
 * @returns {Promise<Object>} Map of product stock objects
 */
export async function getStock() {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  // 1. Try fetching from Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('id, in_stock, note, updated_at');

      if (!error && Array.isArray(data) && data.length > 0) {
        const stockMap = {};
        for (const row of data) {
          if (VALID_PRODUCT_IDS.has(row.id)) {
            stockMap[row.id] = {
              inStock: row.in_stock !== false,
              note: row.note || '',
              updatedAt: row.updated_at || now
            };
          }
        }

        // Ensure all 20 products exist in the returned dictionary
        for (const id of VALID_PRODUCT_IDS) {
          if (!stockMap[id]) {
            stockMap[id] = { inStock: true, note: '', updatedAt: now };
          }
        }

        inMemoryStockCache = stockMap;
        return stockMap;
      }

      if (error) {
        console.warn('[stockService] Supabase query notice:', error.message);
      }
    } catch (err) {
      console.warn('[stockService] Supabase error during getStock:', err.message);
    }
  }

  // 2. Return in-memory cache if available
  if (inMemoryStockCache) {
    return { ...inMemoryStockCache };
  }

  // 3. Fallback: try reading local file in read-only mode (NEVER write to disk on serverless)
  try {
    const localFilePath = path.resolve(process.cwd(), 'data', 'stock.json');
    if (fs.existsSync(localFilePath)) {
      const raw = fs.readFileSync(localFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const stockMap = {};
      for (const id of VALID_PRODUCT_IDS) {
        const item = parsed[id] || {};
        stockMap[id] = {
          inStock: item.inStock !== false,
          note: item.note || '',
          updatedAt: item.updatedAt || now
        };
      }
      inMemoryStockCache = stockMap;
      return stockMap;
    }
  } catch (err) {
    console.warn('[stockService] Could not read local fallback stock.json:', err.message);
  }

  // 4. Default baseline stock
  const defaultStock = getDefaultStock();
  inMemoryStockCache = defaultStock;
  return defaultStock;
}

/**
 * Update stock statuses persistently in Supabase
 * @param {Object} updates - Dictionary of { [productId]: { inStock: boolean, note?: string } }
 * @returns {Promise<Object>} Updated stock state and stats
 */
export async function updateStock(updates) {
  if (!updates || typeof updates !== 'object') {
    throw new Error('Invalid updates payload: expected an object of product updates');
  }

  const now = new Date().toISOString();
  const currentStock = await getStock();
  const rowsToUpsert = [];
  let updatedCount = 0;

  for (const [id, update] of Object.entries(updates)) {
    if (!VALID_PRODUCT_IDS.has(id)) {
      continue; // Skip unknown product IDs
    }

    const inStock = Boolean(update.inStock);
    const note = typeof update.note === 'string' ? update.note.trim().slice(0, 200) : '';

    rowsToUpsert.push({
      id,
      in_stock: inStock,
      note,
      updated_at: now
    });

    currentStock[id] = {
      inStock,
      note,
      updatedAt: now
    };
    updatedCount++;
  }

  if (rowsToUpsert.length === 0) {
    return {
      stock: currentStock,
      updatedCount: 0,
      updatedAt: now
    };
  }

  const supabase = getSupabaseClient();

  if (supabase) {
    // Persistent update via Supabase
    const { error } = await supabase
      .from('inventory')
      .upsert(rowsToUpsert, { onConflict: 'id' });

    if (error) {
      console.error('[stockService] Supabase upsert error:', error);
      throw new Error(`Supabase database error: ${error.message}`);
    }

    inMemoryStockCache = currentStock;
  } else {
    // If Supabase is NOT configured:
    // When running in Vercel / serverless environment, throw helpful error instructing to configure Supabase
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (isServerless) {
      throw new Error(
        'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your Vercel Project Settings > Environment Variables.'
      );
    }

    // In local development without Supabase keys, update in-memory cache & safely write to local file if writable
    inMemoryStockCache = currentStock;
    try {
      const dataDir = path.resolve(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, 'stock.json');
      fs.writeFileSync(filePath, JSON.stringify(currentStock, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[stockService] Local file write skipped (read-only filesystem):', err.message);
    }
  }

  return {
    stock: currentStock,
    updatedCount,
    updatedAt: now
  };
}

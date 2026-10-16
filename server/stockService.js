import fs from 'node:fs';
import path from 'node:path';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient.js';

/**
 * Authentic 20 products from Andhra Avakaya menu price cards
 * (9 Vegetarian, 11 Non-Vegetarian)
 */
export const PRODUCTS_CATALOG = [
  // Veg Pickles (9)
  { id: 'avakaya-pickle', name: 'Avakaya Pickle', category: 'veg' },
  { id: 'menthi-avakaya-pickle', name: 'Menthi Avakaya Pickle', category: 'veg' },
  { id: 'maagaya-pickle', name: 'Maagaya Pickle', category: 'veg' },
  { id: 'usirikaya-pickle', name: 'Usirikaya Pickle', category: 'veg' },
  { id: 'allam-pachadi', name: 'Allam Pachadi', category: 'veg' },
  { id: 'gongura-pachadi', name: 'Gongura Pachadi', category: 'veg' },
  { id: 'tomato-pachadi', name: 'Tomato Pachadi', category: 'veg' },
  { id: 'nalleru-kada-pachadi', name: 'Nalleru Kada Pachadi', category: 'veg' },
  { id: 'cauliflower-pachadi', name: 'Cauliflower Pachadi', category: 'veg' },
  // Non-Veg Pickles (11)
  { id: 'chicken-pickle', name: 'Chicken Pickle', category: 'non-veg' },
  { id: 'prawns-pickle', name: 'Prawns Pickle', category: 'non-veg' },
  { id: 'mutton-pickle', name: 'Mutton Pickle', category: 'non-veg' },
  { id: 'fish-pickle', name: 'Fish Pickle', category: 'non-veg' },
  { id: 'gongura-chicken-bone-pickle', name: 'Gongura Chicken Bone Pickle', category: 'non-veg' },
  { id: 'gongura-chicken-boneless-pickle', name: 'Gongura Chicken Boneless Pickle', category: 'non-veg' },
  { id: 'gongura-prawns-pickle', name: 'Gongura Prawns Pickle', category: 'non-veg' },
  { id: 'gongura-mutton-pickle', name: 'Gongura Mutton Pickle', category: 'non-veg' },
  { id: 'gongura-mutton-boneless-pickle', name: 'Gongura Mutton Boneless Pickle', category: 'non-veg' },
  { id: 'country-chicken-pickle', name: 'Country Chicken Pickle', category: 'non-veg' },
  { id: 'crab-pickle', name: 'Crab Pickle', category: 'non-veg' }
];

export const VALID_PRODUCT_IDS = new Set(PRODUCTS_CATALOG.map((p) => p.id));

// Helper: Normalize string for fuzzy/safe matching (removes symbols, spaces, lowercase)
function normalizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Match an inventory record from the database to one of our 20 canonical products.
 * Supports exact ID, normalized ID, normalized name, and base slug.
 *
 * @param {Object} row - Database row { id, name, category }
 * @returns {Object|null} Matching catalog item or null
 */
export function matchCatalogProduct(row) {
  if (!row) return null;
  const rowId = String(row.id || '').trim();
  const rowName = String(row.name || '').trim();

  // 1. Exact ID match
  if (VALID_PRODUCT_IDS.has(rowId)) {
    return PRODUCTS_CATALOG.find((p) => p.id === rowId) || null;
  }

  const normRowId = normalizeText(rowId);
  const normRowName = normalizeText(rowName);

  // 2. Normalized ID or Name match
  for (const product of PRODUCTS_CATALOG) {
    const normProdId = normalizeText(product.id);
    const normProdName = normalizeText(product.name);

    if (
      (normRowId && normRowId === normProdId) ||
      (normRowName && normRowName === normProdName) ||
      (normRowId && normRowId === normProdName) ||
      (normRowName && normRowName === normProdId)
    ) {
      return product;
    }
  }

  // 3. Suffix-agnostic match (stripping 'pickle' or 'pachadi')
  const stripSuffix = (s) => s.replace(/(pickle|pachadi)$/i, '');
  const baseRowId = stripSuffix(normRowId);
  const baseRowName = stripSuffix(normRowName);

  for (const product of PRODUCTS_CATALOG) {
    const baseProdId = stripSuffix(normalizeText(product.id));
    const baseProdName = stripSuffix(normalizeText(product.name));

    if (
      (baseRowId && (baseRowId === baseProdId || baseRowId === baseProdName)) ||
      (baseRowName && (baseRowName === baseProdId || baseRowName === baseProdName))
    ) {
      return product;
    }
  }

  return null;
}

// In-memory cache for fast lookups & fallbacks
let inMemoryStockCache = null;
let inMemoryImageMapCache = null;
// Map from canonical product id -> database id (in case DB uses an alternate ID)
const dbIdMap = new Map();

/**
 * Get image mappings stored in Supabase Storage bucket 'product-images'
 */
export async function getStorageImageMap(forceRefresh = false) {
  if (inMemoryImageMapCache && !forceRefresh) return { ...inMemoryImageMapCache };
  const supabase = getSupabaseClient();
  if (!supabase) return inMemoryImageMapCache ? { ...inMemoryImageMapCache } : {};

  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .download('_meta/image_map.json');

    if (data && !error) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        inMemoryImageMapCache = parsed;
        return { ...parsed };
      }
    }
  } catch (err) {
    // Non-critical if manifest not created yet
  }
  return inMemoryImageMapCache ? { ...inMemoryImageMapCache } : {};
}

/**
 * Get initial default stock dictionary for all 20 products
 */
export function getDefaultStock() {
  const stock = {};
  const now = new Date().toISOString();
  for (const p of PRODUCTS_CATALOG) {
    stock[p.id] = {
      inStock: true,
      note: '',
      stock_note: '',
      imageUrl: '',
      image: '',
      updatedAt: now
    };
  }
  return stock;
}

/**
 * Load fallback data from local data/stock.json (read-only safe)
 */
function readLocalFallback() {
  try {
    const localFilePath = path.resolve(process.cwd(), 'data', 'stock.json');
    if (fs.existsSync(localFilePath)) {
      const raw = fs.readFileSync(localFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const stockMap = {};
      const now = new Date().toISOString();
      for (const p of PRODUCTS_CATALOG) {
        const item = parsed[p.id] || {};
        stockMap[p.id] = {
          inStock: item.inStock !== false,
          note: item.note || item.stock_note || '',
          stock_note: item.note || item.stock_note || '',
          imageUrl: item.imageUrl || item.image || '',
          image: item.image || item.imageUrl || '',
          updatedAt: item.updatedAt || now
        };
      }
      return stockMap;
    }
  } catch (err) {
    console.warn('[stockService] Could not read local fallback stock.json:', err.message);
  }
  return null;
}

/**
 * Read persistent stock from Supabase (or fallback to cache/local baseline)
 * Preserves all existing stock availability and notes from the database.
 * Does NOT overwrite existing values with defaults.
 *
 * @returns {Promise<Object>} Map of product stock objects keyed by canonical product ID
 */
export async function getStock() {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  // Load storage image map
  const storageImageMap = await getStorageImageMap();

  // 1. Try querying Supabase public.inventory table
  if (supabase) {
    try {
      // First attempt query with image_url column
      let data = null;
      let error = null;

      const resWithImage = await supabase
        .from('inventory')
        .select('id, name, category, in_stock, stock_note, image_url, updated_at');

      if (!resWithImage.error && Array.isArray(resWithImage.data)) {
        data = resWithImage.data;
      } else {
        // Fallback to query without image_url column if not yet created in SQL
        const resBasic = await supabase
          .from('inventory')
          .select('id, name, category, in_stock, stock_note, updated_at');
        data = resBasic.data;
        error = resBasic.error;
      }

      if (!error && Array.isArray(data)) {
        const stockMap = {};
        const matchedProductIds = new Set();

        for (const row of data) {
          const matchedProduct = matchCatalogProduct(row);
          if (matchedProduct) {
            const canonicalId = matchedProduct.id;
            matchedProductIds.add(canonicalId);
            // Save DB ID mapping for future updates
            dbIdMap.set(canonicalId, String(row.id));

            // Extract existing stock status, preserving exact boolean
            const inStock = Boolean(row.in_stock);
            // Support 'stock_note' as primary, with fallback to 'note' if present
            const note = row.stock_note != null ? String(row.stock_note) : (row.note != null ? String(row.note) : '');

            // Product image: priority to database image_url, then storage image map
            const imageUrl = (row.image_url && String(row.image_url).trim()) || storageImageMap[canonicalId] || '';

            stockMap[canonicalId] = {
              inStock,
              note,
              stock_note: note,
              imageUrl,
              image: imageUrl,
              updatedAt: row.updated_at || now
            };
          }
        }

        // Check if any of our 20 catalog products are missing in Supabase
        const missingProducts = PRODUCTS_CATALOG.filter((p) => !matchedProductIds.has(p.id));
        const localFallback = readLocalFallback() || {};

        if (missingProducts.length > 0) {
          // For missing products, preserve statuses from local fallback or default to true
          const rowsToSeed = [];
          for (const p of missingProducts) {
            const fallbackItem = localFallback[p.id];
            const inStock = fallbackItem ? fallbackItem.inStock !== false : true;
            const note = fallbackItem ? (fallbackItem.note || '') : '';

            stockMap[p.id] = {
              inStock,
              note,
              stock_note: note,
              updatedAt: now
            };

            dbIdMap.set(p.id, p.id);
            rowsToSeed.push({
              id: p.id,
              name: p.name,
              category: p.category,
              in_stock: inStock,
              stock_note: note,
              updated_at: now
            });
          }

          // Safely insert only the missing products into Supabase without overwriting existing rows
          try {
            await supabase.from('inventory').upsert(rowsToSeed, { onConflict: 'id' });
            console.log(`[stockService] Seeded ${rowsToSeed.length} missing products into Supabase inventory.`);
          } catch (seedErr) {
            console.warn('[stockService] Note: Non-critical auto-seed notice:', seedErr.message);
          }
        }

        // Fill any gaps for complete 20 items
        for (const p of PRODUCTS_CATALOG) {
          if (!stockMap[p.id]) {
            stockMap[p.id] = { inStock: true, note: '', stock_note: '', updatedAt: now };
          }
        }

        inMemoryStockCache = stockMap;
        return stockMap;
      }

      if (error) {
        console.warn('[stockService] Supabase query returned error:', error.message);
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
  const localMap = readLocalFallback();
  if (localMap) {
    inMemoryStockCache = localMap;
    return localMap;
  }

  // 4. Default baseline stock
  const defaultStock = getDefaultStock();
  inMemoryStockCache = defaultStock;
  return defaultStock;
}

/**
 * Update stock statuses persistently in Supabase
 *
 * @param {Object} updates - Dictionary of { [productId]: { inStock: boolean, note?: string } }
 * @returns {Promise<Object>} Updated stock state and stats
 */
export async function updateStock(updates) {
  if (!updates || typeof updates !== 'object') {
    throw new Error('Invalid updates payload: expected an object of product updates');
  }

  const now = new Date().toISOString();
  // Ensure we have the current stock and DB mappings
  const currentStock = await getStock();
  const rowsToUpsert = [];
  let updatedCount = 0;

  for (const [key, update] of Object.entries(updates)) {
    // Find canonical product
    const matchedProduct =
      PRODUCTS_CATALOG.find((p) => p.id === key) ||
      matchCatalogProduct({ id: key, name: key });

    if (!matchedProduct) {
      continue; // Skip unknown products
    }

    const canonicalId = matchedProduct.id;
    const dbId = dbIdMap.get(canonicalId) || canonicalId;

    const inStock = Boolean(update.inStock);
    const note = typeof update.note === 'string' ? update.note.trim().slice(0, 500) : (
      typeof update.stock_note === 'string' ? update.stock_note.trim().slice(0, 500) : ''
    );

    // Build row matching exact public.inventory schema
    rowsToUpsert.push({
      id: dbId,
      name: matchedProduct.name,
      category: matchedProduct.category,
      in_stock: inStock,
      stock_note: note,
      updated_at: now
    });

    currentStock[canonicalId] = {
      ...currentStock[canonicalId],
      inStock,
      note,
      stock_note: note,
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
    // Persistent update via Supabase database
    const { error } = await supabase
      .from('inventory')
      .upsert(rowsToUpsert, { onConflict: 'id' });

    if (error) {
      console.error('[stockService] Supabase upsert error:', error);
      throw new Error(`Supabase database error: ${error.message} (${error.details || error.hint || 'Check table schema and permissions'})`);
    }

    inMemoryStockCache = currentStock;
  } else {
    // If Supabase is NOT configured:
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (isServerless) {
      throw new Error(
        'Supabase is not configured on Vercel. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your Vercel Project Settings > Environment Variables.'
      );
    }

    // In local development without Supabase keys, update in-memory cache & safely attempt local file write if writable
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

/**
 * Upload and save a new product image to Supabase Storage and database
 *
 * @param {string} productId - Canonical or matched product ID
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} mimeType - Image MIME type ('image/jpeg', 'image/png', 'image/webp')
 * @returns {Promise<{ success: boolean, productId: string, imageUrl: string }>}
 */
export async function saveProductImage(productId, fileBuffer, mimeType) {
  if (!productId || typeof productId !== 'string') {
    throw new Error('Valid productId is required');
  }

  const matchedProduct =
    PRODUCTS_CATALOG.find((p) => p.id === productId) ||
    matchCatalogProduct({ id: productId, name: productId });

  if (!matchedProduct) {
    throw new Error(`Product not found: "${productId}"`);
  }

  const canonicalId = matchedProduct.id;

  // Validate buffer and size (max 5 MB)
  if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
    throw new Error('Invalid or empty image file data');
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (fileBuffer.length > MAX_SIZE) {
    throw new Error(`Image file size (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds the 5 MB limit`);
  }

  // Validate allowed MIME types
  const MIME_EXT_MAP = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };

  const normalizedMime = (mimeType || '').toLowerCase().trim();
  const ext = MIME_EXT_MAP[normalizedMime];
  if (!ext) {
    throw new Error(`Unsupported image type "${mimeType}". Allowed formats: JPG, JPEG, PNG, WebP.`);
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  // Versioned cache-busting filename
  const timestamp = Date.now();
  const fileName = `img-${timestamp}.${ext}`;
  const filePath = `${canonicalId}/${fileName}`;

  // 1. Upload to dedicated Supabase Storage bucket 'product-images'
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('product-images')
    .upload(filePath, fileBuffer, {
      contentType: normalizedMime,
      upsert: true
    });

  if (uploadErr) {
    console.error('[stockService] Storage upload error:', uploadErr);
    throw new Error(`Supabase Storage upload failed: ${uploadErr.message}`);
  }

  // 2. Retrieve public URL
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  const publicUrl = urlData?.publicUrl;
  if (!publicUrl) {
    throw new Error('Failed to generate public URL for uploaded image');
  }

  // 3. Remove older image versions for this product in bucket to conserve storage
  try {
    const { data: existingFiles } = await supabase.storage
      .from('product-images')
      .list(canonicalId);

    if (Array.isArray(existingFiles)) {
      const filesToRemove = existingFiles
        .filter((f) => f.name !== fileName && f.name.startsWith('img-'))
        .map((f) => `${canonicalId}/${f.name}`);

      if (filesToRemove.length > 0) {
        await supabase.storage.from('product-images').remove(filesToRemove);
      }
    }
  } catch (cleanErr) {
    console.warn('[stockService] Cleanup warning (non-critical):', cleanErr.message);
  }

  // 4. Update persistent storage manifest (_meta/image_map.json)
  try {
    const currentMap = await getStorageImageMap();
    currentMap[canonicalId] = publicUrl;
    inMemoryImageMapCache = currentMap;

    const manifestBuffer = Buffer.from(JSON.stringify(currentMap, null, 2), 'utf-8');
    await supabase.storage
      .from('product-images')
      .upload('_meta/image_map.json', manifestBuffer, {
        contentType: 'application/json',
        upsert: true
      });
  } catch (mErr) {
    console.warn('[stockService] Manifest update warning:', mErr.message);
  }

  // 5. Try updating public.inventory.image_url in Supabase database
  try {
    const dbId = dbIdMap.get(canonicalId) || canonicalId;
    await supabase
      .from('inventory')
      .update({
        image_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', dbId);
  } catch (dbErr) {
    // Graceful if column image_url is not created yet
    console.warn('[stockService] Database image_url update notice:', dbErr.message);
  }

  // 6. Update in-memory stock cache if present
  if (inMemoryStockCache && inMemoryStockCache[canonicalId]) {
    inMemoryStockCache[canonicalId].imageUrl = publicUrl;
    inMemoryStockCache[canonicalId].image = publicUrl;
    inMemoryStockCache[canonicalId].updatedAt = new Date().toISOString();
  }

  return {
    success: true,
    productId: canonicalId,
    imageUrl: publicUrl
  };
}


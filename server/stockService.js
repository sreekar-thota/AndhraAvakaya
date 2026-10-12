import fs from 'node:fs';
import path from 'node:path';

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

function getStockFilePath() {
  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'stock.json');
}

/**
 * Get initial default stock dictionary for all 20 products
 */
function getDefaultStock() {
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
 * Read persistent stock from disk
 */
export function getStock() {
  const filePath = getStockFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      // Ensure all 20 products are present
      const now = new Date().toISOString();
      let hasMissing = false;
      for (const id of VALID_PRODUCT_IDS) {
        if (!data[id]) {
          data[id] = { inStock: true, note: '', updatedAt: now };
          hasMissing = true;
        }
      }
      if (hasMissing) {
        saveStock(data);
      }
      return data;
    }
  } catch (err) {
    console.error('Error reading stock.json:', err.message);
  }

  // If file does not exist or read failed, initialize default
  const defaultStock = getDefaultStock();
  saveStock(defaultStock);
  return defaultStock;
}

/**
 * Save stock atomically to disk
 */
function saveStock(stockData) {
  const filePath = getStockFilePath();
  const tmpPath = `${filePath}.tmp.${Date.now()}`;
  const serialized = JSON.stringify(stockData, null, 2);
  fs.writeFileSync(tmpPath, serialized, 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

/**
 * Update stock statuses for one or more products
 * @param {Object} updates - Dictionary of { [productId]: { inStock: boolean, note?: string } }
 */
export function updateStock(updates) {
  if (!updates || typeof updates !== 'object') {
    throw new Error('Invalid updates payload: expected object');
  }

  const currentStock = getStock();
  const now = new Date().toISOString();
  let updatedCount = 0;

  for (const [id, update] of Object.entries(updates)) {
    if (!VALID_PRODUCT_IDS.has(id)) {
      continue; // Skip unknown products
    }

    const inStock = Boolean(update.inStock);
    const note = typeof update.note === 'string' ? update.note.trim().slice(0, 150) : '';

    currentStock[id] = {
      inStock,
      note,
      updatedAt: now
    };
    updatedCount++;
  }

  if (updatedCount > 0) {
    saveStock(currentStock);
  }

  return {
    stock: currentStock,
    updatedCount,
    updatedAt: now
  };
}

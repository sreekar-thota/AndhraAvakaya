/**
 * Andhra Avakaya - Supabase Inventory Migration & Diagnostic Utility
 * 
 * Safe migration script:
 * 1. Checks connection to Supabase
 * 2. Inspects existing rows in public.inventory
 * 3. Safely maps database records to canonical catalog products
 * 4. Seeds any missing catalog products while PRESERVING existing stock statuses and notes
 * 
 * Run with: node server/migrateStock.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { PRODUCTS_CATALOG, matchCatalogProduct } from './stockService.js';

// Load .env file manually if running via node directly
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  // ignore
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

console.log('----------------------------------------------------');
console.log('Andhra Avakaya — Supabase Inventory Migration Tool');
console.log('----------------------------------------------------');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
  console.error('❌ Supabase credentials are missing or placeholders in .env!');
  console.log('Please ensure your .env has:');
  console.log('  SUPABASE_URL=https://<your-project-id>.supabase.co');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>');
  process.exit(1);
}

console.log(`📡 Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function run() {
  try {
    // 1. Fetch current inventory from Supabase
    const { data: existingRows, error } = await supabase
      .from('inventory')
      .select('id, name, category, in_stock, stock_note, updated_at');

    if (error) {
      console.error('❌ Error querying public.inventory table:', error.message);
      console.log('Please verify the table exists in your Supabase project with columns:');
      console.log('  id (text, pk), name (text), category (text), in_stock (boolean), stock_note (text), updated_at (timestamp)');
      process.exit(1);
    }

    console.log(`✅ Successfully queried public.inventory table (${existingRows.length} rows found)`);

    // 2. Map existing rows
    const matchedIds = new Set();
    const existingMap = new Map();

    for (const row of existingRows) {
      const match = matchCatalogProduct(row);
      if (match) {
        matchedIds.add(match.id);
        existingMap.set(match.id, row);
        console.log(`   ✓ Found: "${row.name || row.id}" -> Mapped to "${match.name}" (In Stock: ${row.in_stock}, Note: "${row.stock_note || ''}")`);
      } else {
        console.log(`   ? Notice: Row with ID "${row.id}" did not match any standard catalog product.`);
      }
    }

    // 3. Find missing products
    const missing = PRODUCTS_CATALOG.filter((p) => !matchedIds.has(p.id));

    if (missing.length === 0) {
      console.log('\n🎉 All 20 Andhra Avakaya products are already present in your Supabase inventory table!');
      console.log('No migration or additions required. All existing stock statuses are preserved.');
      return;
    }

    console.log(`\n⚠️  ${missing.length} products from the catalog are missing in Supabase.`);
    console.log('Seeding missing products without touching existing items...');

    // Read local stock.json if available to carry over any previous local settings
    let localStock = {};
    try {
      const localPath = path.resolve(process.cwd(), 'data', 'stock.json');
      if (fs.existsSync(localPath)) {
        localStock = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
      }
    } catch (e) {
      // ignore
    }

    const now = new Date().toISOString();
    const rowsToInsert = missing.map((p) => {
      const local = localStock[p.id];
      const inStock = local ? local.inStock !== false : true;
      const note = local ? (local.note || local.stock_note || '') : '';
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        in_stock: inStock,
        stock_note: note,
        updated_at: now
      };
    });

    const { error: insertError } = await supabase
      .from('inventory')
      .upsert(rowsToInsert, { onConflict: 'id' });

    if (insertError) {
      console.error('❌ Failed to seed missing products:', insertError.message);
      process.exit(1);
    }

    console.log(`✅ Successfully added ${rowsToInsert.length} missing products to public.inventory!`);
    console.log('All 20 products are now available and synced in Supabase.');
  } catch (err) {
    console.error('❌ Migration failed with exception:', err);
    process.exit(1);
  }
}

run();

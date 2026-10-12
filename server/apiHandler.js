import {
  verifyCredentials,
  createSessionToken,
  verifySessionToken,
  parseCookies,
  getSessionCookieHeader,
  getClearSessionCookieHeader
} from './auth.js';
import { getStock, updateStock } from './stockService.js';

/**
 * Read request body as JSON
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // Safeguard against large payloads (>1MB)
      if (data.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error('Invalid JSON: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 */
function sendJson(res, statusCode, payload, headers = {}) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  for (const [k, v] of Object.entries(headers)) {
    res.setHeader(k, v);
  }
  res.end(JSON.stringify(payload));
}

/**
 * Check admin authorization from request cookies
 */
function checkAdminAuth(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.admin_session;
  return verifySessionToken(token);
}

/**
 * Main API request dispatcher
 * Compatible with Connect middleware (Vite), Express, and Node http.
 * @returns {Promise<boolean>} true if handled, false if not an API route
 */
export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Only handle /api routes
  if (!pathname.startsWith('/api')) {
    return false;
  }

  const method = req.method.toUpperCase();

  try {
    // -------------------------------------------------------------
    // 1. PUBLIC: GET /api/stock
    // -------------------------------------------------------------
    if (pathname === '/api/stock' && method === 'GET') {
      const stock = getStock();
      sendJson(res, 200, {
        success: true,
        stock,
        timestamp: new Date().toISOString()
      }, {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      return true;
    }

    // -------------------------------------------------------------
    // 2. AUTH: POST /api/admin/login
    // -------------------------------------------------------------
    if (pathname === '/api/admin/login' && method === 'POST') {
      const body = await readJsonBody(req);
      const { username, password } = body || {};

      if (!username || !password) {
        sendJson(res, 400, {
          success: false,
          message: 'Username and password are required'
        });
        return true;
      }

      const isValid = verifyCredentials(username, password);
      if (!isValid) {
        sendJson(res, 401, {
          success: false,
          message: 'Invalid username or password. Please try again.'
        });
        return true;
      }

      // Generate secure session token and Set-Cookie header
      const token = createSessionToken(username);
      const isHttps = req.headers['x-forwarded-proto'] === 'https' || req.socket?.encrypted;
      const cookieHeader = getSessionCookieHeader(token, isHttps);

      sendJson(res, 200, {
        success: true,
        message: 'Authentication successful',
        user: { username }
      }, {
        'Set-Cookie': cookieHeader
      });
      return true;
    }

    // -------------------------------------------------------------
    // 3. AUTH: POST /api/admin/logout
    // -------------------------------------------------------------
    if (pathname === '/api/admin/logout' && method === 'POST') {
      const clearCookie = getClearSessionCookieHeader();
      sendJson(res, 200, {
        success: true,
        message: 'Logged out successfully'
      }, {
        'Set-Cookie': clearCookie
      });
      return true;
    }

    // -------------------------------------------------------------
    // 4. AUTH: GET /api/admin/check-auth
    // -------------------------------------------------------------
    if (pathname === '/api/admin/check-auth' && method === 'GET') {
      const auth = checkAdminAuth(req);
      if (!auth.valid) {
        sendJson(res, 200, {
          authenticated: false,
          message: auth.error || 'Not authenticated'
        });
        return true;
      }

      sendJson(res, 200, {
        authenticated: true,
        user: { username: auth.username },
        expiresAt: auth.expiresAt
      });
      return true;
    }

    // -------------------------------------------------------------
    // 5. PROTECTED: POST /api/admin/stock (Update stock status)
    // -------------------------------------------------------------
    if (pathname === '/api/admin/stock' && (method === 'POST' || method === 'PUT')) {
      const auth = checkAdminAuth(req);
      if (!auth.valid) {
        sendJson(res, 401, {
          success: false,
          message: 'Unauthorized: Admin session required to update stock'
        });
        return true;
      }

      const body = await readJsonBody(req);
      const { updates } = body || {};

      if (!updates || typeof updates !== 'object') {
        sendJson(res, 400, {
          success: false,
          message: 'Missing updates dictionary'
        });
        return true;
      }

      const result = updateStock(updates);
      sendJson(res, 200, {
        success: true,
        message: `Successfully updated ${result.updatedCount} products`,
        stock: result.stock,
        updatedCount: result.updatedCount,
        updatedAt: result.updatedAt
      });
      return true;
    }

    // Fallback for unknown /api endpoint
    sendJson(res, 404, {
      success: false,
      message: `Endpoint ${method} ${pathname} not found`
    });
    return true;

  } catch (err) {
    console.error('API Error in handleApiRequest:', err);
    sendJson(res, 500, {
      success: false,
      message: 'Internal server error: ' + err.message
    });
    return true;
  }
}

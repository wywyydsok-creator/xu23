/**
 * Supabase Photo CRUD via REST API (no CDN dependency)
 *
 * Uses fetch() directly to communicate with Supabase REST API.
 * Works reliably in WeChat browser and China networks without
 * relying on jsdelivr CDN or any external library.
 *
 * HOW TO SET UP:
 * 1. Go to https://supabase.com and create a project.
 * 2. In SQL Editor, run supabase-schema.sql to create the photos table.
 * 3. Go to Storage -> Create bucket "birthday-gallery" (public).
 * 4. In Project Settings -> API, copy your Project URL and anon key.
 * 5. Paste them below.
 */

// ====== CONFIG - EDIT THESE TWO VALUES ======
var SUPABASE_URL = "https://tywlkrhvelkoydmyupta.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5d2xrcmh2ZWxrb3lkbXl1cHRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDg0OTMsImV4cCI6MjA5ODUyNDQ5M30.S_XR68klyEFSSe3JNXPTbNDOsAxQwU0fH5pmczKMZFc";
var STORAGE_BUCKET = 'birthday-gallery';
// ============================================

// Sentinel object - non-null when Supabase is configured.
// script.js checks `supabaseClient != null` to decide Supabase mode.
var supabaseClient = null;

// Base URLs for REST and Storage APIs
var SUPABASE_REST_URL = SUPABASE_URL + '/rest/v1';
var SUPABASE_STORAGE_URL = SUPABASE_URL + '/storage/v1/object';

// ---- Internal helpers ----

function _authHeaders() {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
  };
}

function _jsonHeaders() {
  var h = _authHeaders();
  h['Content-Type'] = 'application/json';
  h['Prefer'] = 'return=representation';
  return h;
}

// ---- Initialize ----

(function() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('[Supabase] Not configured - using local fallback.');
    return;
  }
  supabaseClient = {};
  console.log('[Supabase] REST client initialized.');
  // Notify script.js that Supabase is ready (also checked via supabaseClient)
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new Event('supabase-ready'));
  }
})();

/**
 * Fetch all photos from the photos table, ordered by position ascending.
 * @returns {Promise<Array<{id:string, url:string, position:number, created_at:string}>>}
 */
async function fetchAllPhotos() {
  if (!supabaseClient) return [];
  try {
    var resp = await fetch(SUPABASE_REST_URL + '/photos?select=*&order=position.asc', {
      headers: _authHeaders()
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status + ' ' + (await resp.text()).slice(0, 200));
    var data = await resp.json();
    return data || [];
  } catch (err) {
    console.error('[Supabase] fetchAllPhotos error:', err.message);
    throw err;
  }
}

/**
 * Upload a photo file to Supabase Storage, create a DB record,
 * and return the new record { id, url, position, created_at }.
 * @param {File} file - The image file from <input type="file">
 * @returns {Promise<{id:string, url:string, position:number, created_at:string}>}
 */
async function uploadPhoto(file) {
  if (!supabaseClient) throw new Error('Supabase not configured');

  var ext = (file.name || 'image.jpg').split('.').pop();
  var ts = Date.now();
  var rnd = Math.random().toString(36).substring(2, 8);
  var fileName = ts + '_' + rnd + '.' + ext;
  var publicUrl = SUPABASE_STORAGE_URL + '/public/' + STORAGE_BUCKET + '/' + fileName;

  // 1. Upload raw file binary to Storage
  var uploadResp = await fetch(SUPABASE_STORAGE_URL + '/' + STORAGE_BUCKET + '/' + fileName, {
    method: 'POST',
    headers: _authHeaders(),
    body: file
  });
  if (!uploadResp.ok) {
    var errText = await uploadResp.text().catch(function() { return ''; });
    throw new Error('Storage upload failed (HTTP ' + uploadResp.status + '): ' + errText.slice(0, 200));
  }

  // 2. Get next position value
  var maxPosResp = await fetch(
    SUPABASE_REST_URL + '/photos?select=position&order=position.desc.nullslast&limit=1',
    { headers: _authHeaders() }
  );
  var maxData = maxPosResp.ok ? await maxPosResp.json() : [];
  var nextPos = (maxData && maxData.length > 0) ? maxData[0].position + 1 : 18;

  // 3. Insert record into photos table
  var insertResp = await fetch(SUPABASE_REST_URL + '/photos', {
    method: 'POST',
    headers: _jsonHeaders(),
    body: JSON.stringify({ url: publicUrl, position: nextPos })
  });
  if (!insertResp.ok) {
    var errText2 = await insertResp.text().catch(function() { return ''; });
    throw new Error('Insert failed (HTTP ' + insertResp.status + '): ' + errText2.slice(0, 200));
  }

  var data = await insertResp.json();
  return Array.isArray(data) ? data[0] : data;
}

/**
 * Delete a photo from Storage and the photos table.
 * @param {string} id - UUID of the photo record
 * @param {string} url - Public URL of the stored file
 */
async function deletePhoto(id, url) {
  if (!supabaseClient) throw new Error('Supabase not configured');

  // 1. Delete the file from Storage if URL belongs to our bucket
  if (url && typeof url === 'string' && url.indexOf(STORAGE_BUCKET) > -1) {
    var urlPath = url.split('?')[0];
    var segments = urlPath.split('/');
    var fileName = segments[segments.length - 1];
    if (fileName && fileName.indexOf('.') > -1) {
      try {
        await fetch(SUPABASE_STORAGE_URL + '/' + STORAGE_BUCKET + '/' + encodeURIComponent(fileName), {
          method: 'DELETE',
          headers: _authHeaders()
        });
      } catch (e) {
        console.warn('[Supabase] Storage delete skipped:', e.message);
      }
    }
  }

  // 2. Delete the record from photos table
  var deleteResp = await fetch(SUPABASE_REST_URL + '/photos?id=eq.' + id, {
    method: 'DELETE',
    headers: _authHeaders()
  });
  if (!deleteResp.ok) {
    var errText = await deleteResp.text().catch(function() { return ''; });
    throw new Error('Delete failed (HTTP ' + deleteResp.status + '): ' + errText.slice(0, 200));
  }
}

/**
 * Seed the default 18 local photos into the photos table (if empty).
 * Stores local relative paths - no Storage upload needed for defaults.
 * @param {string[]} defaultFiles - Array of filenames
 * @param {string} base - Base path prefix (e.g. 'photos/slot/')
 * @returns {Promise<boolean>} true if seeded, false if already had data
 */
async function seedDefaults(defaultFiles, base) {
  if (!supabaseClient) return false;

  // Check if photos table already has records
  var checkResp = await fetch(SUPABASE_REST_URL + '/photos?select=id&limit=1', {
    headers: _authHeaders()
  });
  if (!checkResp.ok) throw new Error('Check failed (HTTP ' + checkResp.status + ')');
  var existing = await checkResp.json();
  if (existing && existing.length > 0) return false;

  // Insert all default records
  var records = defaultFiles.map(function(f, i) {
    return { url: base + f, position: i };
  });

  var insertResp = await fetch(SUPABASE_REST_URL + '/photos', {
    method: 'POST',
    headers: _jsonHeaders(),
    body: JSON.stringify(records)
  });
  if (!insertResp.ok) {
    var errText = await insertResp.text().catch(function() { return ''; });
    throw new Error('Seed failed (HTTP ' + insertResp.status + '): ' + errText.slice(0, 200));
  }

  console.log('[Supabase] Seeded ' + records.length + ' default photos.');
  return true;
}

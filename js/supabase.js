/**
 * ============================================================================
 * MYTH RX — BUSTING HEALTH HOAXES
 * Centralized Supabase Client Initialization & Authentication Utilities
 * Phase 4: Frontend–Supabase Integration
 * ============================================================================
 * 
 * CONFIGURATION INSTRUCTIONS:
 * To connect Myth Rx to your live Supabase project:
 * 1. Log in to your Supabase dashboard: https://app.supabase.com
 * 2. Select your Myth Rx project.
 * 3. Go to: Project Settings -> API.
 * 4. Copy your "Project URL" (e.g., https://xyzcompany.supabase.co)
 *    and paste it into SUPABASE_URL below.
 * 5. Copy your "Project API Key (anon / public)" (starts with eyJ...)
 *    and paste it into SUPABASE_ANON_KEY below.
 * 
 * DEVELOPER CONVENIENCE (Optional):
 * You can also configure credentials dynamically in the browser console:
 *   localStorage.setItem('MYTHRX_SUPABASE_URL', 'https://your-project.supabase.co');
 *   localStorage.setItem('MYTHRX_SUPABASE_ANON_KEY', 'your-anon-key');
 *   location.reload();
 * 
 * CRITICAL SECURITY NOTICE:
 * NEVER paste your "service_role" secret key into this file or any frontend file!
 * The anon key is safe for public browser use because all data access is strictly
 * protected by Row Level Security (RLS) policies defined in Phase 3.
 */

// Live project configuration for Myth Rx
const SUPABASE_URL_DEFAULT = 'https://vsetsdbxfmbamrzzxknt.supabase.co';
const SUPABASE_ANON_KEY_DEFAULT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzZXRzZGJ4Zm1iYW1yenp4a250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NzI1NDEsImV4cCI6MjEwNzQ0ODU0MX0.XNVAZlM-eQ1TKZhHOxEof9lAzAvQKkIJRYOFbvL4pGk';

// Retrieve credentials from constant or optional localStorage override
function getEffectiveConfig() {
  const urlOverride = typeof window !== 'undefined' && window.localStorage 
    ? window.localStorage.getItem('MYTHRX_SUPABASE_URL') || window.MYTHRX_SUPABASE_URL 
    : null;
  const keyOverride = typeof window !== 'undefined' && window.localStorage 
    ? window.localStorage.getItem('MYTHRX_SUPABASE_ANON_KEY') || window.MYTHRX_SUPABASE_ANON_KEY 
    : null;

  return {
    url: (urlOverride && urlOverride.trim()) || SUPABASE_URL_DEFAULT,
    anonKey: (keyOverride && keyOverride.trim()) || SUPABASE_ANON_KEY_DEFAULT
  };
}

let supabaseClient = null;

/**
 * Checks whether valid Supabase configuration credentials have been provided.
 * @returns {boolean} True if credentials are replaced with real values.
 */
function isSupabaseConfigured() {
  const { url, anonKey } = getEffectiveConfig();
  return (
    typeof url === 'string' &&
    url.startsWith('https://') &&
    !url.includes('YOUR_PROJECT_ID') &&
    typeof anonKey === 'string' &&
    !anonKey.includes('YOUR_SUPABASE_ANON_KEY_HERE') &&
    anonKey.length > 20
  );
}

/**
 * Initializes and returns the singleton Supabase client instance.
 * If credentials are not yet configured, returns null without breaking the UI.
 * @returns {object|null} The initialized Supabase client or null.
 */
function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  // Verify that the official Supabase JS library has been loaded via script tag
  if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
    console.warn(
      '[Myth Rx] Supabase JS library (@supabase/supabase-js) is not detected in the window object. ' +
      'Ensure the @supabase/supabase-js script tag is included in your HTML <head>.'
    );
    return null;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, anonKey } = getEffectiveConfig();

  try {
    supabaseClient = window.supabase.createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    console.info('[Myth Rx] Supabase client successfully initialized.');
    return supabaseClient;
  } catch (error) {
    console.error('[Myth Rx] Error initializing Supabase client:', error.message);
    return null;
  }
}

/**
 * Retrieves the currently active authenticated session.
 * @returns {Promise<object|null>} The session object or null if guest.
 */
async function getCurrentSession() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data: { session }, error } = await client.auth.getSession();
    if (error) throw error;
    return session;
  } catch (err) {
    console.debug('[Myth Rx] Session retrieval notice:', err.message);
    return null;
  }
}

/**
 * Retrieves the currently active authenticated user.
 * @returns {Promise<object|null>} The auth user or null.
 */
async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user || null;
}

/**
 * Retrieves the active user's application profile from public.profiles,
 * including their server-enforced role ('user' or 'admin').
 * @returns {Promise<object|null>}
 */
async function getCurrentUserProfile() {
  const client = getSupabaseClient();
  const user = await getCurrentUser();
  if (!client || !user) return null;

  try {
    const { data, error } = await client
      .from('profiles')
      .select('id, display_name, role, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('[Myth Rx] Could not fetch profile for user:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('[Myth Rx] Error querying user profile:', err);
    return null;
  }
}

/**
 * Checks whether the currently signed-in user has the 'admin' role.
 * Note: Server-side RLS and triggers always enforce actual security.
 * @returns {Promise<boolean>}
 */
async function isCurrentUserAdmin() {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin';
}

/**
 * Tests the live connection to Supabase.
 * Call this function from your browser console to verify connectivity.
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function testSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase URL and Anon Key are placeholders. Add your project credentials to js/supabase.js.'
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Failed to initialize Supabase client instance.'
    };
  }

  try {
    // Attempt a lightweight query to public.categories (open to anon)
    const { data, error } = await client.from('categories').select('id, slug, name').limit(1);
    
    if (error) {
      return {
        success: false,
        message: `Connected to Supabase endpoint, but query failed: ${error.message} (Code: ${error.code})`
      };
    }

    return {
      success: true,
      message: `Successfully connected to Supabase! Retrieved categories table sample.`
    };
  } catch (err) {
    return {
      success: false,
      message: `Connection test failed: ${err.message}`
    };
  }
}

// Attach all utilities to global namespace
window.MythRx = window.MythRx || {};
window.MythRx.getSupabaseClient = getSupabaseClient;
window.MythRx.isSupabaseConfigured = isSupabaseConfigured;
window.MythRx.getCurrentSession = getCurrentSession;
window.MythRx.getCurrentUser = getCurrentUser;
window.MythRx.getCurrentUserProfile = getCurrentUserProfile;
window.MythRx.isCurrentUserAdmin = isCurrentUserAdmin;
window.MythRx.testSupabaseConnection = testSupabaseConnection;

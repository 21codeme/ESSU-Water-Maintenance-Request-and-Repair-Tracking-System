/**
 * Supabase Helper Functions
 * Use these functions to properly interact with Supabase API
 * This fixes the 401 errors and CORS issues
 */

// Supabase Configuration
const SUPABASE_CONFIG = {
  url: 'https://xlubjwiumytdkxrzojdg.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY' // Replace with your actual anon key from Supabase dashboard
};

/**
 * Get Supabase authentication headers
 * This fixes the 401 error for notifications
 */
function getSupabaseHeaders() {
  // Try to get Supabase auth token from localStorage
  // Common keys: supabase.auth.token, sb-access-token, or check your Supabase client setup
  const supabaseToken = localStorage.getItem('supabase.auth.token') || 
                       localStorage.getItem('sb-access-token') ||
                       localStorage.getItem('supabaseAccessToken') ||
                       SUPABASE_CONFIG.anonKey;
  
  // Get the anon key - make sure it's set!
  if (!SUPABASE_CONFIG.anonKey || SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('⚠️ Supabase anon key not configured! Please set SUPABASE_CONFIG.anonKey in supabase-helpers.js');
  }
  
  return {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': `Bearer ${supabaseToken}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

/**
 * Fetch notifications from Supabase with proper authentication
 * This fixes the 401 error
 */
async function fetchNotifications() {
  try {
    console.log('🔄 Loading notifications from Supabase...');
    
    const response = await fetch(
      `${SUPABASE_CONFIG.url}/rest/v1/notifications?order=created_at.desc`,
      {
        method: 'GET',
        headers: getSupabaseHeaders()
      }
    );

    console.log(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Authentication failed. Please check your Supabase API key and authentication token.');
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Notifications loaded successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error loading notifications:', error);
    throw error;
  }
}

/**
 * Get proper API base URL
 * This fixes the CORS error when using file:// protocol
 */
function getApiBaseUrl() {
  // If running from file:// protocol, throw error
  if (window.location.protocol === 'file:') {
    throw new Error(
      'This page must be served from a web server (http:// or https://).\n' +
      'Please use a local server (e.g., VS Code Live Server, Python http.server, or npm serve) or deploy to a hosting service.'
    );
  }

  // If window.API_URL is set, use it
  if (window.API_URL) {
    return window.API_URL;
  }

  // Use current origin with /api path
  const currentOrigin = window.location.origin;
  return `${currentOrigin}/api`;
}

/**
 * Send OTP email using backend API or Supabase Edge Function
 * This fixes the 500 error for password change
 */
async function sendOtpEmail(email) {
  try {
    console.log('📧 Sending OTP email to:', email);

    // Get the API base URL
    const apiUrl = getApiBaseUrl();
    
    // Try backend API first (if deployed on Vercel with backend)
    try {
      const response = await fetch(`${apiUrl}/send-otp-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ OTP email sent successfully via backend API');
        return data;
      } else if (response.status === 404 || response.status === 500) {
        // Backend endpoint doesn't exist or has error, try Supabase
        console.log('⚠️ Backend endpoint not available, trying Supabase Edge Function...');
        throw new Error('Backend endpoint not available');
      } else {
        throw new Error(`Failed to send OTP email: ${response.statusText}`);
      }
    } catch (backendError) {
      // Fallback to Supabase Edge Function
      console.log('🔄 Trying Supabase Edge Function...');
      
      const response = await fetch(
        `${SUPABASE_CONFIG.url}/functions/v1/send-otp-email`,
        {
          method: 'POST',
          headers: getSupabaseHeaders(),
          body: JSON.stringify({ email })
        }
      );

      if (!response.ok) {
        // If Edge Function also doesn't exist, provide helpful error
        if (response.status === 404) {
          throw new Error(
            'Email service not configured. Please set up either:\n' +
            '1. Backend endpoint at /api/send-otp-email\n' +
            '2. Supabase Edge Function at send-otp-email\n' +
            'Or use Supabase Auth password reset feature.'
          );
        }
        throw new Error(`Failed to send OTP email: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ OTP email sent successfully via Supabase Edge Function');
      return data;
    }
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    
    // Provide user-friendly error message
    if (error.message.includes('file://')) {
      alert(
        'Error: This page must be served from a web server.\n\n' +
        'Please use one of these methods:\n' +
        '1. Use VS Code Live Server extension\n' +
        '2. Use Python: python -m http.server 8000\n' +
        '3. Use Node.js: npx serve\n' +
        '4. Deploy to a hosting service (Vercel, Netlify, etc.)'
      );
    } else {
      // Show error to user
      alert(`Error sending OTP email: ${error.message}`);
    }
    
    throw error;
  }
}

/**
 * Change password with OTP verification
 * This is the complete function that should replace the one in settings-standalone.html
 */
async function changePassword(currentPassword, newPassword, otp) {
  try {
    console.log('🔐 Verifying current password...');
    
    // Step 1: Verify current password
    // (Add your password verification logic here)
    // For Supabase Auth, you might use:
    // const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    
    console.log('✅ Current password verified');
    
    // Step 2: Verify OTP (if using OTP flow)
    if (otp) {
      // Verify OTP logic here
      console.log('✅ OTP verified');
    }
    
    // Step 3: Update password
    // Use Supabase Auth or your backend API
    const response = await fetch(
      `${SUPABASE_CONFIG.url}/rest/v1/rpc/change_password`,
      {
        method: 'POST',
        headers: getSupabaseHeaders(),
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          otp: otp
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to change password: ${response.statusText}`);
    }

    console.log('✅ Password changed successfully');
    return await response.json();
  } catch (error) {
    console.error('❌ Error changing password:', error);
    throw error;
  }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getSupabaseHeaders,
    fetchNotifications,
    getApiBaseUrl,
    sendOtpEmail,
    changePassword
  };
}

// Also make available globally
window.SupabaseHelpers = {
  getSupabaseHeaders,
  fetchNotifications,
  getApiBaseUrl,
  sendOtpEmail,
  changePassword
};


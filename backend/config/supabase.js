// Supabase Configuration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase configuration missing!');
    console.error('⚠️  Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
    console.error('⚠️  Get these from your Supabase project settings');
}

// Create Supabase client with service role key (for backend operations)
const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Test connection
async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Supabase connection error:', error.message);
            console.error('⚠️  Make sure you have run the SQL schema in Supabase SQL Editor');
        } else {
            console.log('✅ Supabase connected successfully');
        }
    } catch (error) {
        console.error('❌ Supabase connection error:', error.message);
    }
}

// Only test if credentials are provided
if (supabaseUrl && supabaseServiceKey) {
    testConnection();
}

module.exports = supabase;



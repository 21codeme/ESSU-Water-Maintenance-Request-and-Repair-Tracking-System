// Script to check and add confirmation columns if they don't exist
const supabase = require('./config/supabase');
require('dotenv').config();

async function checkAndAddColumns() {
    try {
        console.log('🔍 Checking for confirmation columns...');
        
        // Try to query a report with confirmation fields
        const { data, error } = await supabase
            .from('reports')
            .select('id, confirmed_by_technician, confirmed_at')
            .limit(1);
        
        if (error) {
            if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
                console.log('❌ Confirmation columns do not exist in database!');
                console.log('📝 Please run the migration SQL in Supabase SQL Editor:');
                console.log('\nALTER TABLE reports ADD COLUMN IF NOT EXISTS confirmed_by_technician BOOLEAN DEFAULT FALSE;');
                console.log('ALTER TABLE reports ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE NULL;');
                return;
            }
            console.error('Error:', error);
            return;
        }
        
        console.log('✅ Confirmation columns exist!');
        console.log('Sample data:', data);
    } catch (error) {
        console.error('Error checking columns:', error);
    }
}

checkAndAddColumns();




// Script to set up demo users with proper password hashes for Supabase
// Run this after: npm install && node setup-demo-users.js

const bcrypt = require('bcryptjs');
const supabase = require('./config/supabase');
require('dotenv').config();

async function setupDemoUsers() {
    try {
        console.log('🔐 Generating password hashes...');
        const adminHash = await bcrypt.hash('admin123', 10);
        const techHash = await bcrypt.hash('tech123', 10);
        const userHash = await bcrypt.hash('user123', 10);

        console.log('\n📋 Password hashes generated');

        // Check if users exist
        const { data: existing } = await supabase
            .from('users')
            .select('id, email')
            .in('email', ['admin@essu.edu', 'tech@essu.edu', 'user@essu.edu']);

        const existingEmails = existing?.map(u => u.email) || [];

        // Update or insert demo users
        console.log('\n👤 Setting up demo users...');

        const users = [
            { email: 'admin@essu.edu', full_name: 'Admin User', password: adminHash, role: 'admin' },
            { email: 'tech@essu.edu', full_name: 'Technician User', password: techHash, role: 'technician' },
            { email: 'user@essu.edu', full_name: 'Regular User', password: userHash, role: 'user' }
        ];

        for (const user of users) {
            if (existingEmails.includes(user.email)) {
                // Update existing user
                const { error } = await supabase
                    .from('users')
                    .update({ password: user.password })
                    .eq('email', user.email);

                if (error) {
                    console.error(`❌ Error updating ${user.email}:`, error.message);
                } else {
                    console.log(`✅ Updated ${user.email}`);
                }
            } else {
                // Insert new user
                const { error } = await supabase
                    .from('users')
                    .insert(user);

                if (error) {
                    console.error(`❌ Error creating ${user.email}:`, error.message);
                } else {
                    console.log(`✅ Created ${user.email}`);
                }
            }
        }

        console.log('\n✅ Demo users setup complete!');
        console.log('\n📝 Demo Credentials:');
        console.log('   Admin: admin@essu.edu / admin123');
        console.log('   Technician: tech@essu.edu / tech123');
        console.log('   User: user@essu.edu / user123');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('SUPABASE_URL') || error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
            console.error('⚠️  Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
        } else {
            console.error('⚠️  Make sure you have run the SQL schema in Supabase SQL Editor');
        }
    }
}

setupDemoUsers();



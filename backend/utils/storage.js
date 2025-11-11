// Storage utility for Supabase Storage
// This works for both local development and Vercel deployment
const supabase = require('../config/supabase');
const path = require('path');

const BUCKET_NAME = 'uploads'; // Supabase Storage bucket name

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} folder - Folder path (e.g., 'reports', 'proofs')
 * @param {string} contentType - MIME type (optional, defaults to image/jpeg)
 * @returns {Promise<{url: string, path: string}>}
 */
async function uploadToSupabaseStorage(fileBuffer, fileName, folder = 'reports', contentType = 'image/jpeg') {
    try {
        // Ensure bucket exists (create if not exists)
        // Note: Bucket creation requires admin access, so this might fail
        // Make sure to create the bucket manually in Supabase dashboard
        
        const filePath = `${folder}/${fileName}`;
        
        // Determine content type from file extension if not provided
        if (!contentType || contentType === 'image/jpeg') {
            const ext = fileName.toLowerCase().split('.').pop();
            const mimeTypes = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp'
            };
            contentType = mimeTypes[ext] || 'image/jpeg';
        }
        
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, fileBuffer, {
                contentType: contentType,
                upsert: false // Don't overwrite existing files
            });

        if (error) {
            console.error('Error uploading to Supabase Storage:', error);
            throw new Error(`Failed to upload file: ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return {
            url: urlData.publicUrl,
            path: filePath
        };
    } catch (error) {
        console.error('Storage upload error:', error);
        throw error;
    }
}

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - File path in storage
 * @returns {Promise<boolean>}
 */
async function deleteFromSupabaseStorage(filePath) {
    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting from Supabase Storage:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Storage delete error:', error);
        return false;
    }
}

/**
 * Get public URL for a file in Supabase Storage
 * @param {string} filePath - File path in storage
 * @returns {string}
 */
function getPublicUrl(filePath) {
    if (!filePath) return null;
    
    // If already a full URL, return as is
    if (filePath.startsWith('http')) {
        return filePath;
    }
    
    // If it's an old local path, try to extract the filename
    // and construct Supabase Storage URL
    const fileName = path.basename(filePath);
    const folder = filePath.includes('proof-') ? 'proofs' : 'reports';
    
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${folder}/${fileName}`);
    
    return data.publicUrl;
}

module.exports = {
    uploadToSupabaseStorage,
    deleteFromSupabaseStorage,
    getPublicUrl,
    BUCKET_NAME
};


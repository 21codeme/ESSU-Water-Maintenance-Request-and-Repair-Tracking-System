// Reports Routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireRole } = require('../middleware/auth');
const supabase = require('../config/supabase');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const prefix = file.fieldname === 'completion_proof' ? 'proof-' : 'report-';
        cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Get all reports (authenticated)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select(`
                *,
                assigned_to_user:users!reports_assigned_to_fkey(id, full_name, email)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reports:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Format response to include assigned_to_name
        const formattedReports = (data || []).map(report => {
            // Explicitly handle confirmed_by_technician - check for true, 'true', 1, or '1'
            let confirmed = false;
            if (report.confirmed_by_technician === true || 
                report.confirmed_by_technician === 'true' || 
                report.confirmed_by_technician === 1 || 
                report.confirmed_by_technician === '1') {
                confirmed = true;
            }
            
            return {
                ...report,
                assigned_to_name: report.assigned_to_user?.full_name || null,
                // Ensure confirmed_by_technician is explicitly set as boolean
                confirmed_by_technician: confirmed,
                confirmed_at: report.confirmed_at || null
            };
        });

        // Debug: Log confirmation status for first few reports
        formattedReports.slice(0, 3).forEach(report => {
            if (report.confirmed_by_technician !== undefined) {
                console.log(`📋 Report ${report.id.substring(0, 8)} - confirmed_by_technician:`, report.confirmed_by_technician, typeof report.confirmed_by_technician);
            }
        });

        res.json(formattedReports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get public reports (no auth required)
router.get('/public', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select('id, reporter_name, email, location, issue_type, priority, status, description, created_at, updated_at')
            .in('status', ['Resolved', 'In Progress'])
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching public reports:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(data || []);
    } catch (error) {
        console.error('Error fetching public reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single report
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select(`
                *,
                assigned_to_user:users!reports_assigned_to_fkey(id, full_name, email)
            `)
            .eq('id', req.params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Report not found' });
            }
            console.error('Error fetching report:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Format response to include assigned_to_name
        const formattedReport = {
            ...data,
            assigned_to_name: data.assigned_to_user?.full_name || null
        };

        res.json(formattedReport);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create report (public - no auth required)
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const { reporter_name, email, location, issue_type, priority, description } = req.body;

        // Validation
        if (!reporter_name || !email || !location || !issue_type || !description) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const { data, error } = await supabase
            .from('reports')
            .insert({
                reporter_name,
                email,
                location,
                issue_type,
                priority: priority || 'Medium',
                description,
                image_path: imagePath,
                status: 'Pending'
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating report:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update report (with optional file upload for completion proof)
router.put('/:id', authenticateToken, upload.single('completion_proof'), async (req, res) => {
    try {
        const { status, priority, admin_note, assigned_to, confirmed_by_technician, confirmed_at } = req.body;

        if (!status && !priority && admin_note === undefined && assigned_to === undefined && confirmed_by_technician === undefined && !req.file) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        const updates = {};
        if (status) updates.status = status;
        if (priority) updates.priority = priority;
        if (admin_note !== undefined) updates.admin_note = admin_note;
        if (assigned_to !== undefined) updates.assigned_to = assigned_to || null;
        
        // Handle confirmation by technician
        if (confirmed_by_technician !== undefined) {
            updates.confirmed_by_technician = confirmed_by_technician === 'true' || confirmed_by_technician === true;
            if (updates.confirmed_by_technician && confirmed_at) {
                updates.confirmed_at = confirmed_at;
            } else if (updates.confirmed_by_technician) {
                updates.confirmed_at = new Date().toISOString();
            }
        }
        
        // Handle completion proof image upload
        if (req.file) {
            updates.completion_proof_path = `/uploads/${req.file.filename}`;
        }

        // Debug: Log what we're trying to update
        if (updates.confirmed_by_technician !== undefined) {
            console.log('🔄 Attempting to update confirmation:', {
                reportId: req.params.id,
                updates: updates
            });
        }

        const { data, error } = await supabase
            .from('reports')
            .update(updates)
            .eq('id', req.params.id)
            .select('*')
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Report not found' });
            }
            // Check if error is about missing column
            if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
                console.error('❌ Database column missing! Please run migration SQL:', error.message);
                return res.status(500).json({ 
                    error: 'Database column missing. Please run the migration SQL in Supabase SQL Editor. See backend/add-completion-proof-column.sql'
                });
            }
            console.error('Error updating report:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Debug: Log confirmation status
        if (updates.confirmed_by_technician !== undefined) {
            console.log('✅ Report confirmation updated:', {
                reportId: req.params.id,
                confirmed_by_technician: data?.confirmed_by_technician,
                confirmed_at: data?.confirmed_at,
                type: typeof data?.confirmed_by_technician,
                fullData: data
            });
        }

        // Ensure confirmed_by_technician is returned as boolean
        const responseData = {
            ...data,
            confirmed_by_technician: data?.confirmed_by_technician === true || 
                                   data?.confirmed_by_technician === 'true' || 
                                   data?.confirmed_by_technician === 1 || 
                                   data?.confirmed_by_technician === '1'
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete report
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        // Get report to check if image exists
        const { data: report, error: fetchError } = await supabase
            .from('reports')
            .select('image_path')
            .eq('id', req.params.id)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return res.status(404).json({ error: 'Report not found' });
            }
            console.error('Error fetching report:', fetchError);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Delete image file if exists
        if (report?.image_path) {
            const imagePath = path.join(__dirname, '..', report.image_path);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete report from database
        const { error: deleteError } = await supabase
            .from('reports')
            .delete()
            .eq('id', req.params.id);

        if (deleteError) {
            console.error('Error deleting report:', deleteError);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;


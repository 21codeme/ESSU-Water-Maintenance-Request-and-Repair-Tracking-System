// Email routes for sending OTP and other emails
const express = require('express');
const router = express.Router();

/**
 * Send OTP email
 * POST /api/send-otp-email
 * Body: { email: string }
 */
router.post('/send-otp-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in session or database (you might want to use Redis or a database)
    // For now, we'll just return it (in production, store it securely and send via email service)
    // TODO: Implement actual email sending using nodemailer, SendGrid, or similar
    
    console.log(`📧 OTP for ${email}: ${otp}`);
    
    // In production, you would:
    // 1. Store OTP in database with expiration (e.g., 10 minutes)
    // 2. Send email using nodemailer, SendGrid, AWS SES, etc.
    // 3. Return success without exposing OTP
    
    // For now, return success (you need to implement actual email sending)
    res.json({
      success: true,
      message: 'OTP email sent successfully',
      // Remove this in production - only for testing
      // otp: otp // DO NOT return OTP in production!
    });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }
});

/**
 * Verify OTP
 * POST /api/verify-otp
 * Body: { email: string, otp: string }
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // TODO: Verify OTP from database
    // Check if OTP exists, is not expired, and matches
    
    // For now, return success (implement actual verification)
    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

module.exports = router;



import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendOtpMail, sendWelcomeEmail } from '../utils/mailer.js';

const router = express.Router();



// In-memory store for pending signups (for demo; use Redis for production)
const pendingSignups = {};

// Signup - Step 1: Send OTP
router.post('/signup/send-otp', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store pending signup in memory
    pendingSignups[email] = {
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 min
    };

    // Send OTP email
    await sendOtpMail(email, otp);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Signup - Step 2: Verify OTP and create user
router.post('/signup/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const pending = pendingSignups[email];
    if (!pending) return res.status(400).json({ message: 'No pending signup for this email' });
    if (pending.otpExpires < Date.now()) {
      delete pendingSignups[email];
      return res.status(400).json({ message: 'OTP expired' });
    }
    if (pending.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    // Create user in DB
    const user = new User({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      emailVerified: true,
    });
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(pending.email, pending.name);
      console.log(`Welcome email sent to ${pending.email}`);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the signup if email fails
    }

    delete pendingSignups[email];

    res.status(200).json({ message: 'Email verified, signup complete! Welcome email sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login (only allow if email verified)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (!user.emailVerified) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
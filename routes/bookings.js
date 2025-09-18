import express from 'express';
import Booking from '../models/Booking.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { generateBookingReceipt } from '../utils/generateBookingReceipt.js';
import { sendEmailWithAttachment } from '../utils/sendEmail.js';
import path from 'path';

// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize Razorpay with error handling
let razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    console.log('Razorpay credentials missing, payment features will be disabled');
  } else {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    console.log('Razorpay initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
}

// Import auth middleware
import { auth } from '../middleware/auth.js';

// Test endpoint
router.get('/test', (req, res) => {
  console.log('🧪 Test endpoint hit!');
  res.json({ message: 'Bookings API is working!' });
});

// Create booking
router.post('/', auth, async (req, res) => {
  console.log('BOOKING REQUEST RECEIVED!');
  console.log('Request body:', req.body);
  console.log('User:', req.user);
  
  try {
    const { car, startDate, endDate, totalAmount, pickupLocation, dropLocation } = req.body;

    // Validate booking times
    const now = new Date();
    const pickupDateTime = new Date(startDate);
    const dropDateTime = new Date(endDate);
    const diffMs = dropDateTime - pickupDateTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Add debugging
    console.log('Server - Current time:', now.toLocaleString());
    console.log('Server - Pickup time:', pickupDateTime.toLocaleString());
    console.log('Server - Drop time:', dropDateTime.toLocaleString());
    console.log('Server - Pickup is before now?', pickupDateTime < now);
    console.log('Server - Duration in hours:', diffHours);
    
    // Check if pickup time is in the past (with 1 hour buffer)
    const oneHourFromNow = new Date(now.getTime() + (1 * 60 * 60 * 1000));
    if (pickupDateTime < oneHourFromNow) {
      return res.status(400).json({ 
        message: `Pickup time must be at least 1 hour in the future. Current time: ${now.toLocaleString()}, Selected pickup: ${pickupDateTime.toLocaleString()}` 
      });
    }
    if (diffHours < 24) {
      return res.status(400).json({ message: 'Booking must be at least 24 hours.' });
    }

    console.log('Creating booking:', { car, startDate, endDate, totalAmount, user: req.user._id });

    // Create booking without payment for now (can add Razorpay later)
    const booking = new Booking({
      car: car,
      user: req.user._id,
      startDate: pickupDateTime,
      endDate: dropDateTime,
      totalAmount,
      pickupLocation,
      dropLocation,
      status: 'confirmed', // Skip payment for now
      paymentStatus: 'completed' // Skip payment for now
    });

    await booking.save();

    // Populate car and user data
    await booking.populate('car');
    await booking.populate('user', 'name email');

    // Generate PDF receipt and send email with better error handling
    try {
      console.log('--- Starting PDF/Email process ---');
      console.log('User email:', booking.user.email);
      console.log('User name:', booking.user.name);
      
      const filePath = path.join(process.cwd(), 'receipts', `receipt-${booking._id}.pdf`);
      console.log('PDF file path:', filePath);
      
      console.log('Generating PDF receipt...');
      await generateBookingReceipt({ booking, car: booking.car, user: booking.user, filePath });
      console.log('PDF generated successfully');
      
      console.log('Sending email with attachment...');
      await sendEmailWithAttachment({
        to: booking.user.email,
        subject: 'Your RoyalCar Booking Receipt',
        text: `Dear ${booking.user.name},\n\nThank you for your booking! Please find your receipt attached.`,
        attachmentPath: filePath,
      });
      
      console.log('✅ PDF generated and email sent successfully for booking:', booking._id);
    } catch (pdfEmailError) {
      console.error('❌ PDF/Email error (booking still successful):', pdfEmailError.message);
      console.error('Full error stack:', pdfEmailError);
      // Don't fail the booking if PDF/email fails
    }

    console.log('Booking created successfully:', booking._id);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        _id: booking._id,
        car: booking.car,
        user: booking.user,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (for checking car availability status)
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      status: { $ne: 'cancelled' } // Exclude cancelled bookings
    }).select('car startDate endDate status');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
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

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { car, startDate, endDate, totalAmount, pickupLocation, dropLocation } = req.body;

    console.log('Creating booking:', { car, startDate, endDate, totalAmount, user: req.user._id });

    // Create booking without payment for now (can add Razorpay later)
    const booking = new Booking({
      car: car,
      user: req.user._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalAmount,
      status: 'confirmed', // Skip payment for now
      paymentStatus: 'completed' // Skip payment for now
    });

    await booking.save();

    // Populate car and user data
    await booking.populate('car');
    await booking.populate('user', 'name email');

    // Generate PDF receipt and send email with better error handling
    try {
      const filePath = path.join(process.cwd(), 'receipts', `receipt-${booking._id}.pdf`);
      await generateBookingReceipt({ booking, car: booking.car, user: booking.user, filePath });
      
      await sendEmailWithAttachment({
        to: booking.user.email,
        subject: 'Your RoyalCar Booking Receipt',
        text: `Dear ${booking.user.name},\n\nThank you for your booking! Please find your receipt attached.`,
        attachmentPath: filePath,
      });
      
      console.log('PDF generated and email sent successfully for booking:', booking._id);
    } catch (pdfEmailError) {
      console.error('PDF/Email error (booking still successful):', pdfEmailError);
      // Don't fail the booking if PDF/email fails
    }

    console.log('Booking created successfully:', booking._id);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
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
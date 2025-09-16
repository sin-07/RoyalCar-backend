import express from 'express';
import Booking from '../models/Booking.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

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

// Create booking
router.post('/', async (req, res) => {
  try {
    const { carId, startDate, endDate, totalAmount } = req.body;

    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(500).json({ 
        message: 'Payment service unavailable. Please contact support.' 
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paisa
      currency: 'INR',
      receipt: `booking_${Date.now()}`,
    });

    // Create booking
    const booking = new Booking({
      car: carId,
      user: req.user.id, // Will be set by auth middleware
      startDate,
      endDate,
      totalAmount,
      orderId: order.id,
    });

    await booking.save();

    res.status(201).json({
      booking,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
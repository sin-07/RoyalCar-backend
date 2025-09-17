import express from 'express';
import Car from '../models/Car.js';
const router = express.Router();

// Get available cars for a location and time range
router.post('/available', async (req, res) => {
  try {
    const { pickup, drop, pickupDate, pickupTime, dropDate, dropTime } = req.body;
    console.log('Available cars request:', req.body);
    
    const startDate = new Date(`${pickupDate}T${pickupTime}`);
    const endDate = new Date(`${dropDate}T${dropTime}`);

    // Find cars that are not booked in the given range
    // Get all bookings that overlap with the requested time
    const bookings = await (await import('../models/Booking.js')).default.find({
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
      ]
    });
    const bookedCarIds = bookings.map(b => b.car.toString());

    // Find all available cars (not filtering by location for now)
    const cars = await Car.find({
      isAvailable: true,
      _id: { $nin: bookedCarIds }
    });
    
    console.log(`Found ${cars.length} available cars`);
    res.json(cars);
  } catch (error) {
    console.error('Available cars error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Duplicate imports and router declaration removed

// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().populate('owner', 'name email');
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get car by id
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner', 'name email');
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new car (protected route - only for owners)
router.post('/', async (req, res) => {
  try {
    const newCar = new Car({
      ...req.body,
      owner: req.user.id, // Will be set by auth middleware
    });

    const car = await newCar.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
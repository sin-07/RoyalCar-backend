import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Car.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Sample car data
const sampleCars = [
  {
    brand: "Toyota",
    model: "Innova Crysta",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    year: 2023,
    category: "SUV",
    seating_capacity: 7,
    fuel_type: "Diesel",
    transmission: "Manual",
    pricePerDay: 2500,
    description: "Spacious and comfortable SUV perfect for family trips",
    isAvailable: true
  },
  {
    brand: "Maruti Suzuki",
    model: "Swift Dzire",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    year: 2022,
    category: "Sedan",
    seating_capacity: 5,
    fuel_type: "Petrol",
    transmission: "Automatic",
    pricePerDay: 1800,
    description: "Fuel-efficient sedan ideal for city drives",
    isAvailable: true
  },
  {
    brand: "Hyundai",
    model: "Creta",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    year: 2023,
    category: "SUV",
    seating_capacity: 5,
    fuel_type: "Petrol",
    transmission: "Automatic",
    pricePerDay: 2200,
    description: "Modern SUV with advanced features and comfort",
    isAvailable: true
  },
  {
    brand: "Mahindra",
    model: "Scorpio",
    image: "https://images.unsplash.com/photo-1494976688153-ca3ce9bb88bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    year: 2022,
    category: "SUV",
    seating_capacity: 7,
    fuel_type: "Diesel",
    transmission: "Manual",
    pricePerDay: 2800,
    description: "Rugged SUV perfect for adventure trips",
    isAvailable: true
  },
  {
    brand: "Honda",
    model: "City",
    image: "https://images.unsplash.com/photo-1580414155667-2178ef8aa7c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    year: 2023,
    category: "Sedan",
    seating_capacity: 5,
    fuel_type: "Petrol",
    transmission: "CVT",
    pricePerDay: 2000,
    description: "Premium sedan with excellent build quality",
    isAvailable: true
  },
  {
    brand: "Tata",
    model: "Nexon",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    year: 2022,
    category: "Compact SUV",
    seating_capacity: 5,
    fuel_type: "Petrol",
    transmission: "Manual",
    pricePerDay: 1900,
    description: "Compact SUV with great safety features",
    isAvailable: true
  },
  {
    brand: "Kia",
    model: "Seltos",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    year: 2023,
    category: "SUV",
    seating_capacity: 5,
    fuel_type: "Diesel",
    transmission: "Automatic",
    pricePerDay: 2400,
    description: "Stylish SUV with premium interiors",
    isAvailable: true
  },
  {
    brand: "Maruti Suzuki",
    model: "Alto K10",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    year: 2022,
    category: "Hatchback",
    seating_capacity: 5,
    fuel_type: "Petrol",
    transmission: "Manual",
    pricePerDay: 1200,
    description: "Budget-friendly car perfect for city commuting",
    isAvailable: true
  }
];

async function seedCars() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a dummy owner user if none exists
    let owner = await User.findOne({ email: 'owner@royalcar.com' });
    if (!owner) {
      owner = new User({
        name: 'Royal Car Owner',
        email: 'owner@royalcar.com',
        password: 'hashedpassword', // In real app, this should be properly hashed
        phone: '9999999999',
        role: 'owner'
      });
      await owner.save();
      console.log('Created dummy owner user');
    }

    // Clear existing cars
    await Car.deleteMany({});
    console.log('Cleared existing cars');

    // Add owner ID to each car, log if missing
    if (!owner || !owner._id) {
      throw new Error('Owner user not found or missing _id');
    }
    const carsWithOwner = sampleCars.map(car => ({
      ...car,
      owner: owner._id
    }));

    // Insert sample cars
    const insertedCars = await Car.insertMany(carsWithOwner);
    console.log(`Successfully inserted ${insertedCars.length} cars into the database`);

    // Display inserted cars
    insertedCars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.brand} ${car.model} - ₹${car.pricePerDay}/day (Owner: ${car.owner})`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding cars:', error);
    mongoose.connection.close();
  }
}

// Run the seed function
seedCars();
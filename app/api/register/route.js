import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    console.log("Attempting to connect to MongoDB...");
    
    try {
      await connectToDatabase();
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }
    
    // Check if user already exists
    try {
      const userExists = await User.findOne({ email });
      
      if (userExists) {
        return NextResponse.json(
          { message: 'User already exists' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
      return NextResponse.json(
        { message: 'Error checking user existence' },
        { status: 500 }
      );
    }
    
    // Create new user
    try {
      await User.create({
        name,
        email,
        password,
      });
      
      return NextResponse.json(
        { message: 'User registered successfully' },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { message: 'Error creating user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Error processing registration request' },
      { status: 500 }
    );
  }
}
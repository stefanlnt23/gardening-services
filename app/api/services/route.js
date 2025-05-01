import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET services (with optional category filter)
export async function GET(request) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database successfully');
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');
    
    let query = {};
    if (categoryId) {
      query.category = categoryId;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Executing service query:', query);
    
    // First get services without population to ensure basic query works
    const services = await Service.find(query).lean();
    
    // Then populate categories safely
    const populatedServices = await Promise.all(
      services.map(async (service) => {
        try {
          if (service.category) {
            const category = await mongoose.model('Category').findById(service.category).lean();
            return {
              ...service,
              category: category || { name: 'Unknown Category' }
            };
          }
          return service;
        } catch (err) {
          console.error('Error populating category for service:', service._id, err);
          return {
            ...service,
            category: { name: 'Unknown Category' }
          };
        }
      })
    );

    // Sort after population
    populatedServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('Services found:', populatedServices.length);
    return NextResponse.json(populatedServices);
  } catch (error) {
    console.error('Error in services GET route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch services',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

// POST new service
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const data = await request.json();
    
    // Ensure photos array is provided
    if (!data.photos || !Array.isArray(data.photos) || data.photos.length === 0) {
      return NextResponse.json(
        { error: 'At least one photo is required' },
        { status: 400 }
      );
    }

    const service = await Service.create(data);
    const populatedService = await service.populate('category', 'name');
    
    return NextResponse.json(populatedService, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

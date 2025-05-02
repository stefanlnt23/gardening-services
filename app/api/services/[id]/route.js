
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';
import '@/models/Category'; // Import Category model explicitly to ensure it's registered
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET service by ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    console.log('Service detail API called for ID:', id);
    
    if (!id) {
      console.error('Invalid service ID provided:', id);
      return NextResponse.json(
        { error: 'Invalid service ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log('Database connected, attempting to find service with ID:', id);
    
    try {
      const service = await Service.findById(id)
        .populate('category', 'name');
      
      if (!service) {
        console.log('Service not found for ID:', id);
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }

      console.log('Service found successfully:', service._id);
      return NextResponse.json(service);
    } catch (findError) {
      console.error('Error finding service:', findError.message);
      return NextResponse.json(
        { error: `Error finding service: ${findError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in service detail API:', error);
    return NextResponse.json(
      { 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT update service
export async function PUT(request, { params }) {
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

    const service = await Service.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE service
export async function DELETE(request, { params }) {
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
    
    const service = await Service.findByIdAndDelete(params.id);

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

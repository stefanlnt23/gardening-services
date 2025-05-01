import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database');
    
    const data = await request.json();
    console.log('Received data:', data);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'serviceInterested', 'message'];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.log('Missing required field:', field);
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    console.log('Creating contact inquiry...');
    // Create contact inquiry in database
    const contact = await Contact.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      serviceInterested: data.serviceInterested,
      message: data.message,
      status: 'New'
    });
    console.log('Contact inquiry created:', contact);

    return NextResponse.json(
      { message: 'Thank you for your inquiry. We will contact you soon!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

// Get all contact inquiries (admin only)
export async function GET(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      console.log('Unauthorized access attempt to contacts');
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    console.log('Admin user accessing contacts:', session.user.email);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    await connectToDatabase();
    
    let query = {};
    if (status) {
      query.status = status;
    }

    console.log('Fetching contacts with query:', query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .lean();
    console.log('Found contacts:', contacts.length);

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

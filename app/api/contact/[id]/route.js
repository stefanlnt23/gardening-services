import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request, { params }) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      console.log('Unauthorized access attempt to update contact');
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    console.log('Admin user updating contact:', session.user.email);
    await connectToDatabase();
    
    const { id } = params;
    const data = await request.json();
    console.log('Updating contact with data:', data);
    
    // Validate the data
    if (!data.status || !['New', 'In Progress', 'Completed'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update the contact inquiry
    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        status: data.status,
        adminNotes: data.adminNotes,
        scheduledDate: data.scheduledDate,
        updatedAt: new Date()
      },
      { new: true }
    ).lean();

    if (!contact) {
      console.log('Contact not found:', id);
      return NextResponse.json(
        { error: 'Contact inquiry not found' },
        { status: 404 }
      );
    }

    console.log('Contact updated successfully:', contact);
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact inquiry' },
      { status: 500 }
    );
  }
}

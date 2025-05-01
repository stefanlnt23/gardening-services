import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const project = await Project.findById(params.id).lean();
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Log project data
    console.log('Retrieved project:', JSON.stringify({
      ...project,
      featured: Boolean(project.featured),
      type: {
        featured: typeof project.featured,
        status: typeof project.status
      }
    }, null, 2));

    // Ensure boolean type for featured flag
    project.featured = Boolean(project.featured);
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();

    // Log incoming data
    console.log('Incoming update data:', JSON.stringify(data, null, 2));

    // Ensure boolean type for featured flag
    data.featured = Boolean(data.featured);
    console.log('Featured flag after conversion:', data.featured, 'type:', typeof data.featured);
    
    // Validate status
    if (!['In Progress', 'Completed'].includes(data.status)) {
      data.status = 'In Progress';
    }
    console.log('Status after validation:', data.status);

    // Log the final data being updated
    console.log('Final update data:', JSON.stringify({
      ...data,
      updatedAt: Date.now()
    }, null, 2));
    
    const project = await Project.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    // Log the updated project
    console.log('Updated project:', JSON.stringify(project.toObject(), null, 2));
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const project = await Project.findByIdAndDelete(params.id);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

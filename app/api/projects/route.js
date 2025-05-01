import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();

    // Ensure boolean type for featured flag
    data.featured = Boolean(data.featured);
    
    // Validate status
    if (!['In Progress', 'Completed'].includes(data.status)) {
      data.status = 'In Progress';
    }

    // Log the data being saved
    console.log('Creating project with data:', data);
    
    const project = await Project.create(data);
    console.log('Created project:', project);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find().lean();
    
    // Log all projects
    console.log('All projects before processing:', JSON.stringify(projects.map(p => ({
      id: p._id,
      title: p.title,
      featured: p.featured,
      type: typeof p.featured,
      status: p.status
    })), null, 2));

    // Ensure boolean type for featured flag on all projects
    const processedProjects = projects.map(project => ({
      ...project,
      featured: Boolean(project.featured)
    }));

    // Log processed projects
    console.log('Projects after processing:', JSON.stringify(processedProjects.map(p => ({
      id: p._id,
      title: p.title,
      featured: p.featured,
      type: typeof p.featured,
      status: p.status
    })), null, 2));

    return NextResponse.json(processedProjects);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

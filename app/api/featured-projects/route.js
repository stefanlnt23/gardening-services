import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Log MongoDB connection
    const db = await connectToDatabase();
    console.log('MongoDB connection status:', mongoose.connection.readyState);

    // Log all projects first
    const allProjects = await Project.find().lean();
    console.log('All projects in DB:', JSON.stringify(allProjects.map(p => ({
      id: p._id,
      title: p.title,
      featured: p.featured,
      status: p.status,
      type: typeof p.featured
    })), null, 2));

    // Then query featured ones with explicit boolean comparison
    const projects = await Project.find({ featured: { $eq: true } }).sort({ createdAt: -1 });
    console.log('Featured projects query result:', JSON.stringify(projects.map(p => ({
      id: p._id,
      title: p.title,
      featured: p.featured,
      status: p.status,
      type: typeof p.featured
    })), null, 2));
    console.log('Found featured projects:', projects.length);
    console.log('Featured projects:', projects.map(p => ({ 
      id: p._id, 
      title: p.title, 
      featured: p.featured,
      status: p.status 
    })));
    
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

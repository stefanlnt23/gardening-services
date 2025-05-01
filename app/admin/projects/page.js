'use client';

import { useEffect, useState } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetchProjects();
  }, []);

  // Add another effect to refetch when the component is focused
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refetching projects...');
      fetchProjects();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      
      // Log project data for debugging
      console.log('All projects:', data);
      console.log('Projects with status and featured:', data.map(p => ({
        id: p._id,
        title: p.title,
        status: p.status,
        featured: p.featured
      })));
      
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Refresh the projects list
      fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Projects</h1>
        <Link href="/admin/create-project" className="btn btn-success">
          Create New Project
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Client</th>
            <th>Location</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project.title}</td>
              <td>{project.clientName || 'N/A'}</td>
              <td>{project.location || 'N/A'}</td>
              <td>
                <span className={`badge bg-${project.status === 'Completed' ? 'success' : 'warning'}`}>
                  {project.status || 'In Progress'}
                </span>
              </td>
              <td>
                <span className={`badge ${project.featured ? 'bg-primary' : 'bg-secondary'}`}>
                  {project.featured ? 'Featured' : 'Not Featured'}
                </span>
              </td>
              <td>{new Date(project.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="d-flex gap-2">
                  <Link
                    href={`/admin/projects/edit/${project._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

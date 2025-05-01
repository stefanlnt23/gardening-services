'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated or not admin, redirect to home
    if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/');
    }
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === 'loading' || !session?.user?.isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row className="g-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Category Management</Card.Title>
              <Card.Text>
                Create and manage service categories.
              </Card.Text>
              <Link 
                href="/admin/create-category"
                className="btn btn-primary"
              >
                Create Category
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Service Management</Card.Title>
              <Card.Text>
                Create and manage services offered.
              </Card.Text>
              <div className="d-flex gap-2">
                <Link 
                  href="/admin/services"
                  className="btn btn-primary"
                >
                  Manage Services
                </Link>
                <Link 
                  href="/admin/create-service"
                  className="btn btn-success"
                >
                  Create Service
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Project Management</Card.Title>
              <Card.Text>
                Create and manage portfolio projects.
              </Card.Text>
              <div className="d-flex gap-2">
                <Link 
                  href="/admin/projects"
                  className="btn btn-primary"
                >
                  Manage Projects
                </Link>
                <Link 
                  href="/admin/create-project"
                  className="btn btn-success"
                >
                  Create Project
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Contact Inquiries</Card.Title>
              <Card.Text>
                Manage customer inquiries and schedule appointments.
              </Card.Text>
              <Link 
                href="/admin/inquiries"
                className="btn btn-primary"
              >
                View Inquiries
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

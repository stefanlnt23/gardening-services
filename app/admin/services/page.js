'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import Link from 'next/link';

export default function AdminServices() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Fetch services and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (!catRes.ok) throw new Error(catData.error);
        setCategories(catData);

        // Fetch services
        const servicesUrl = selectedCategory 
          ? `/api/services?category=${selectedCategory}`
          : '/api/services';
        const servRes = await fetch(servicesUrl);
        const servData = await servRes.json();
        if (!servRes.ok) throw new Error(servData.error);
        setServices(servData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  // Redirect if not admin
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user?.isAdmin) {
    router.push('/');
    return null;
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Services</h1>
        <Link href="/admin/create-service" className="btn btn-success">
          Create New Service
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <Form.Group className="mb-4">
        <Form.Label>Filter by Category</Form.Label>
        <Form.Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : services.length === 0 ? (
        <div className="alert alert-info">No services found.</div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service._id}>
                  <td>{service.title}</td>
                  <td>{service.category.name}</td>
                  <td>£{service.price}</td>
                  <td>
                    <span className={`badge ${service.featured ? 'bg-primary' : 'bg-secondary'}`}>
                      {service.featured ? 'Featured' : 'Not Featured'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link 
                        href={`/admin/services/edit/${service._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                      </Link>
                      <Link 
                        href={`/services/${service._id}`}
                        className="btn btn-info btn-sm"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => {
                          setServiceToDelete(service);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the service &quot;{serviceToDelete?.title}&quot;? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={async () => {
              try {
                const res = await fetch(`/api/services/${serviceToDelete._id}`, {
                  method: 'DELETE'
                });
                
                if (!res.ok) {
                  const data = await res.json();
                  throw new Error(data.error || 'Failed to delete service');
                }

                // Remove the deleted service from the list
                setServices(services.filter(s => s._id !== serviceToDelete._id));
                setShowDeleteModal(false);
              } catch (err) {
                setError(err.message);
                setShowDeleteModal(false);
              }
            }}
          >
            Delete Service
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

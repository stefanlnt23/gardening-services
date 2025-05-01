'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

export default function EditService() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    benefits: '',
    whatsIncluded: '',
    price: '',
    duration: '',
    coverage: '',
    photos: [],
    featured: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch service data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (!catRes.ok) throw new Error(catData.error);
        setCategories(catData);

        // Fetch service details
        const serviceRes = await fetch(`/api/services/${params.id}`);
        const serviceData = await serviceRes.json();
        if (!serviceRes.ok) throw new Error(serviceData.error);
        
        setFormData({
          title: serviceData.title,
          category: serviceData.category._id,
          description: serviceData.description,
          benefits: serviceData.benefits,
          whatsIncluded: serviceData.whatsIncluded,
          price: serviceData.price,
          duration: serviceData.duration,
          coverage: serviceData.coverage,
          photos: serviceData.photos,
          featured: serviceData.featured
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  // Redirect if not admin
  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session?.user?.isAdmin) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/services/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess('Service updated successfully!');
      // Redirect back to services list after a short delay
      setTimeout(() => {
        router.push('/admin/services');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoAdd = () => {
    const photoUrl = window.prompt('Enter photo URL:');
    if (photoUrl) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrl]
      }));
    }
  };

  const handlePhotoRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Edit Service</h1>
        <Link href="/admin/services" className="btn btn-secondary">
          Back to Services
        </Link>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="Enter service title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={1000}
            rows={4}
            placeholder="Enter service description"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Benefits</Form.Label>
          <Form.Control
            as="textarea"
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            required
            maxLength={1000}
            rows={4}
            placeholder="Enter service benefits"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>What&apos;s Included</Form.Label>
          <Form.Control
            as="textarea"
            name="whatsIncluded"
            value={formData.whatsIncluded}
            onChange={handleChange}
            required
            maxLength={1000}
            rows={4}
            placeholder="Enter what&apos;s included in the service"
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Price (£)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter price"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="e.g., 2 hours"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Coverage Area</Form.Label>
              <Form.Control
                type="text"
                name="coverage"
                value={formData.coverage}
                onChange={handleChange}
                required
                placeholder="e.g., Within 20 miles"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Photos</Form.Label>
          <div className="mb-2">
            <Button 
              variant="secondary" 
              onClick={handlePhotoAdd}
              type="button"
            >
              Add Photo URL
            </Button>
          </div>
          {formData.photos.length > 0 && (
            <Row className="g-2">
              {formData.photos.map((photo, index) => (
                <Col key={index} md={4}>
                  <div className="position-relative">
                    <Image
                      src={photo}
                      alt={`Service photo ${index + 1}`}
                      width={300}
                      height={200}
                      className="rounded"
                      style={{ objectFit: 'cover' }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-1"
                      onClick={() => handlePhotoRemove(index)}
                    >
                      ×
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            name="featured"
            label="Feature this service"
            checked={formData.featured}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={saving || formData.photos.length === 0}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Link 
            href="/admin/services" 
            className="btn btn-secondary"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </Container>
  );
}

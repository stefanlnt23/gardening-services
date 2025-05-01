'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

export default function CreateService() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    featured: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Redirect if not admin
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user?.isAdmin) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
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

      setSuccess('Service created successfully!');
      setFormData({
        title: '',
        category: '',
        description: '',
        benefits: '',
        whatsIncluded: '',
        price: '',
        duration: '',
        coverage: '',
        photos: [],
        featured: false,
        relatedCategory: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
      <h1 className="mb-4">Create New Service</h1>
      
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
          <Form.Label>What's Included</Form.Label>
          <Form.Control
            as="textarea"
            name="whatsIncluded"
            value={formData.whatsIncluded}
            onChange={handleChange}
            required
            maxLength={1000}
            rows={4}
            placeholder="Enter what's included in the service"
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
                    <img
                      src={photo}
                      alt={`Service photo ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ height: '200px', width: '100%', objectFit: 'cover' }}
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

        <Button 
          variant="primary" 
          type="submit" 
          disabled={isLoading || formData.photos.length === 0}
        >
          {isLoading ? 'Creating...' : 'Create Service'}
        </Button>
      </Form>
    </Container>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState('In Progress');
  const [featured, setFeatured] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  // Define all functions before any conditional returns
  const handleAddPhoto = () => {
    if (!newPhotoUrl) {
      setError('Please enter a photo URL');
      return;
    }
    if (!/^https?:\/\/.+/.test(newPhotoUrl)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setPhotos(prevPhotos => [...prevPhotos, newPhotoUrl]);
    setNewPhotoUrl('');
    setError('');
  };

  const removePhoto = (index) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title || !description || !clientName || !location || !completionDate || services.length === 0 || photos.length === 0) {
      setError('Please fill in all required fields, select at least one service, and upload at least one photo');
      setLoading(false);
      return;
    }

    // Convert featured to boolean explicitly
    const formData = {
      title,
      description,
      clientName,
      location,
      completionDate,
      services,
      status,
      featured: Boolean(featured),
      photos
    };

    // Log form data for debugging
    console.log('Form data before submission:', formData);
    console.log('Featured flag type:', typeof formData.featured);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error('Failed to create project');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (e) => {
    const selectedServices = Array.from(e.target.selectedOptions, option => option.value);
    setServices(selectedServices);
  };

  useEffect(() => {
    // Redirect if not admin
    if (!session?.user?.isAdmin) {
      router.push('/');
      return;
    }

    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        setAvailableServices(data);
      } catch (err) {
        setError('Failed to load services');
      }
    };
    fetchServices();
  }, [session, router]);

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Create New Project</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Client Name</Form.Label>
          <Form.Control
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter project location"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Completion Date</Form.Label>
          <Form.Control
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Services Provided</Form.Label>
          <Form.Select 
            multiple
            value={services}
            onChange={handleServiceChange}
            required
          >
            {availableServices.map(service => (
              <option key={service.title} value={service.title}>
                {service.title}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">
            Hold Ctrl (Windows) or Command (Mac) to select multiple services
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Feature this project on homepage"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Add Photo URL</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="url"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="Enter photo URL (http:// or https://)"
            />
            <Button 
              variant="secondary" 
              onClick={handleAddPhoto}
              type="button"
            >
              Add Photo
            </Button>
          </div>
          <Form.Text className="text-muted">
            Enter URLs for project photos
          </Form.Text>
        </Form.Group>

        {photos.length > 0 && (
          <div className="mb-3">
            <p>Project Photos:</p>
            <div className="d-flex gap-2 flex-wrap">
              {photos.map((photo, index) => (
                <div key={index} className="position-relative">
                  <Image
                    src={photo}
                    alt={`Project photo ${index + 1}`}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0"
                    onClick={() => removePhoto(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Project'}
        </Button>
      </Form>
    </Container>
  );
}

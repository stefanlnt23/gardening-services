'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { use } from 'react';

export default function EditProject({ params: paramsPromise }) {
  const params = use(paramsPromise);
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Redirect if not admin
    if (!session?.user?.isAdmin) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch project data
        const projectResponse = await fetch(`/api/projects/${params.id}`);
        if (!projectResponse.ok) {
          throw new Error('Failed to fetch project');
        }
        const projectData = await projectResponse.json();
        setTitle(projectData.title);
        setDescription(projectData.description);
        setClientName(projectData.clientName || '');
        setLocation(projectData.location || '');
        setCompletionDate(projectData.completionDate ? new Date(projectData.completionDate).toISOString().split('T')[0] : '');
        setServices(projectData.services || []);
        setStatus(projectData.status || 'In Progress');
        setFeatured(projectData.featured || false);
        setPhotos(projectData.photos || []);

        // Fetch available services
        const servicesResponse = await fetch('/api/services');
        if (!servicesResponse.ok) throw new Error('Failed to fetch services');
        const servicesData = await servicesResponse.json();
        setAvailableServices(servicesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, session, router]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!title || !description || !clientName || !location || !completionDate || services.length === 0 || photos.length === 0) {
      setError('Please fill in all required fields and include at least one photo');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          clientName,
          location,
          completionDate,
          services,
          status,
          featured,
          photos,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update project');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="py-5">
      <h1 className="mb-4">Edit Project</h1>

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
            onChange={(e) => setServices(Array.from(e.target.selectedOptions, option => option.value))}
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
            <p>Current Photos:</p>
            <div className="d-flex gap-2 flex-wrap">
              {photos.map((photo, index) => (
                <div key={index} className="position-relative">
                  <img
                    src={photo}
                    alt={`Project photo ${index + 1}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
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
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
}

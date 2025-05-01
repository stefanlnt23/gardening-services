'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Row, Col, Card, Badge, Carousel } from 'react-bootstrap';
import Image from 'next/image';
import { use } from 'react';

export default function ProjectDetails({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!project) return <div className="text-center mt-5">Project not found</div>;

  return (
    <Container className="my-5">
      <Row>
        <Col lg={8}>
          {project.photos && project.photos.length > 0 ? (
            <Carousel className="mb-4">
              {project.photos.map((photo, index) => (
                <Carousel.Item key={index}>
                  <div style={{ position: 'relative', height: '500px' }}>
                    <Image
                      src={photo}
                      alt={`Project photo ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="mb-4 bg-light d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
              <p className="text-muted">No photos available</p>
            </div>
          )}
        </Col>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <h1 className="h2 mb-4">{project.title || 'Untitled Project'}</h1>
              
              <div className="mb-3">
                <Badge bg={project.status === 'Completed' ? 'success' : 'warning'} className="mb-2">
                  {project.status || 'In Progress'}
                </Badge>
                {project.featured && (
                  <Badge bg="primary" className="ms-2">Featured</Badge>
                )}
              </div>

              <div className="mb-3">
                <strong>Client:</strong> {project.clientName || 'N/A'}
              </div>

              <div className="mb-3">
                <strong>Location:</strong> {project.location || 'N/A'}
              </div>

              <div className="mb-3">
                <strong>Completion Date:</strong>{' '}
                {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'TBD'}
              </div>

              <div className="mb-3">
                <strong>Services Provided:</strong>
                <div className="mt-2">
                  {project.services?.map((service, index) => (
                    <Badge key={index} bg="secondary" className="me-2 mb-2">
                      {service}
                    </Badge>
                  )) || (
                    <p className="text-muted">No services listed</p>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <h2 className="h4 mb-3">Project Description</h2>
              <p className="mb-0">{project.description || 'No description available.'}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

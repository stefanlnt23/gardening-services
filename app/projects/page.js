'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Nu s-au putut încărca proiectele');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="text-center mt-5">Se încarcă...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5">Proiectele Noastre</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {projects.map((project) => (
          <Col key={project._id}>
            <Card 
              className="h-100 shadow-sm hover-shadow cursor-pointer"
              onClick={() => router.push(`/projects/${project._id}`)}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {project.photos && project.photos.length > 0 && (
                <div style={{ position: 'relative', height: '200px' }}>
                  <Image
                    src={project.photos[0]}
                    alt={project.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <Card.Body>
                <Card.Title>{project.title}</Card.Title>
                <Card.Text className="mb-3">{project.description.substring(0, 150)}...</Card.Text>
                <div className="d-flex gap-2 flex-wrap">
                  <Badge bg={project.status === 'Completed' ? 'success' : 'warning'}>
                    {project.status === 'Completed' ? 'Finalizat' : 'În desfășurare'}
                  </Badge>
                  {project.featured && (
                    <Badge bg="primary">Recomandat</Badge>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
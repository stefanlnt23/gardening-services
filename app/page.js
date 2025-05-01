'use client';

import { Container, Row, Col, Button, Form, Card, Badge, Alert } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterested: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess(false);

    try {
      console.log('Submitting contact form:', contactForm);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setContactSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        serviceInterested: '',
        message: ''
      });

      // Scroll to top of form to show success message
      const formElement = document.querySelector('#contact-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setContactError(err.message);
    } finally {
      setContactLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch featured projects
      try {
        const projectsResponse = await fetch('/api/featured-projects', { 
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (!projectsResponse.ok) throw new Error('Failed to fetch featured projects');
        const featured = await projectsResponse.json();
        console.log('Featured projects from API:', featured);
        setFeaturedProjects(featured);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setProjectsError(err.message);
      } finally {
        setProjectsLoading(false);
      }

      // Fetch featured services
      try {
        const servicesResponse = await fetch('/api/featured-services', {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (!servicesResponse.ok) throw new Error('Failed to fetch featured services');
        const featuredServices = await servicesResponse.json();
        console.log('Featured services from API:', featuredServices);
        setServices(featuredServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        setServicesError(err.message);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchData();

    // Add interval to refresh data periodically
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Service icons mapping
  const getServiceIcon = (title) => {
    const icons = {
      'Garden Design': '🌿',
      'Lawn Maintenance': '✂️',
      'Seasonal Planting': '🌺',
      'Irrigation Systems': '💧',
      'Landscape Lighting': '💡',
      'Hardscaping': '🏗️',
    };
    return icons[title] || '🌳'; // Default icon if no match
  };

  const testimonials = [
    {
      name: 'Jane Doe',
      role: 'Client Rezidențial',
      text: 'Flori și Frunze ne-a transformat complet curtea din spate într-o oază frumoasă. Echipa lor a fost profesionistă, competentă și o plăcere de a lucra cu ei. Nu puteam fi mai fericiți cu rezultatele!'
    },
    {
      name: 'Robert Smith',
      role: 'Client de Întreținere Regulată',
      text: 'Folosim serviciile de întreținere de la Flori și Frunze de peste 5 ani, iar grădina noastră nu a arătat niciodată mai bine. Atenția lor la detalii și cunoștințele horticole sunt impresionante.'
    },
    {
      name: 'Amanda Lee',
      role: 'Client Sistem de Irigații',
      text: 'Sistemul de irigații instalat de Flori și Frunze a fost o schimbare radicală pentru grădina noastră. Este eficient, ușor de utilizat și a redus semnificativ consumul nostru de apă, menținând în același timp plantele sănătoase.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section position-relative bg-success text-white py-5" style={{ minHeight: '80vh' }}>
        <div className="position-absolute top-0 end-0" style={{ width: '400px', height: '400px', background: '#8B6D2B', borderRadius: '50%', opacity: '0.5', transform: 'translate(20%, -20%)' }}></div>
        <Container className="py-5">
          <Row className="align-items-center min-vh-75">
            <Col md={8} className="text-center text-md-start">
              <h1 className="display-2 fw-bold mb-4">Transformă-ți Spațiul Exterior</h1>
              <p className="lead mb-4">Servicii profesionale de grădinărit pentru a crea și întreține grădina visurilor tale</p>
              <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                <Link href="/services" className="btn btn-success btn-lg">Serviciile Noastre</Link>
                <Link href="/contact" className="btn btn-outline-light btn-lg">Cere o Ofertă</Link>
              </div>
            </Col>
          </Row>
        </Container>
        <div className="position-absolute bottom-0 w-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,112C1120,96,1280,96,1360,96L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Featured Services */}
      <section className="py-5">
        <Container>
          <h2 className="text-center text-success mb-2">Serviciile Noastre Principale</h2>
          <p className="text-center mb-5">Oferim o gamă completă de servicii de grădinărit pentru a menține spațiul tău exterior arătând impecabil pe tot parcursul anului.</p>
          
          {servicesLoading ? (
            <div className="text-center">Se încarcă serviciile...</div>
          ) : servicesError ? (
            <div className="text-center text-danger">{servicesError}</div>
          ) : services.length === 0 ? (
            <div className="text-center">
              Nu există servicii disponibile.
              <div className="text-muted small mt-2">
                {servicesLoading ? 'Se încarcă...' : `${services.length} servicii disponibile`}
              </div>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {services.map((service) => (
                <Col key={service._id}>
                  <Card className="h-100 shadow-sm hover-shadow">
                    {service.photos && service.photos.length > 0 && (
                      <div style={{ position: 'relative', height: '200px' }}>
                        <Image
                          src={service.photos[0]}
                          alt={service.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title className="text-success">{service.title}</Card.Title>
                      <Card.Text>{service.description.substring(0, 100)}...</Card.Text>
                      <div className="d-flex gap-2 flex-wrap align-items-center">
                        <Badge bg="secondary">£{service.price}</Badge>
                        <Badge bg="info">{service.duration}</Badge>
                        <Link href={`/services/${service._id}`} className="text-success text-decoration-none ms-auto">
                          Află mai multe →
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          
          <div className="text-center mt-5">
            <Link href="/services" className="btn btn-success">Vezi Toate Serviciile</Link>
          </div>
        </Container>
      </section>

{/* About Section */}
<section className="py-5 bg-light">
  <Container>
    <Row className="align-items-center">
      <Col md={6}>
        <h2 className="text-success mb-4">Despre Flori și Frunze</h2>
        <p>Înființată în 2008, Flori și Frunze a transformat spații exterioare din întreaga regiune cu serviciile noastre experte de grădinărit și amenajare peisagistică. Echipa noastră de horticultori certificați și designeri peisagiști sunt pasionați de crearea unor grădini frumoase și sustenabile care prosperă în clima noastră locală.</p>
        <p>Ne mândrim cu atenția la detalii, practicile sustenabile și angajamentul față de satisfacția clienților. Lasă-ne să te ajutăm să creezi și să întreții spațiul exterior la care ai visat întotdeauna.</p>
      </Col>
      <Col md={6} className="text-center">
        <div className="p-4 rounded-3 shadow-sm">
          <img 
            src="https://i.postimg.cc/Rmgf9BZF/logo.png"
            alt="Logo Flori și Frunze"
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }}
            className="img-fluid"
          />
        </div>
      </Col>
    </Row>
  </Container>
</section>
      {/* Featured Projects */}
      <section className="py-5">
        <Container>
          <h2 className="text-center text-success mb-2">Proiecte Recente</h2>
          <p className="text-center mb-5">Aruncă o privire la câteva dintre proiectele noastre evidențiate și inspiră-te pentru propria transformare a grădinii.</p>
          
          {projectsLoading ? (
            <div className="text-center">Se încarcă proiectele...</div>
          ) : projectsError ? (
            <div className="text-center text-danger">{projectsError}</div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center">
              Nu există proiecte disponibile.
              <div className="text-muted small mt-2">
                {projectsLoading ? 'Se încarcă...' : `${featuredProjects.length} proiecte disponibile`}
              </div>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {featuredProjects.map((project) => (
                <Col key={project._id}>
                  <Link 
                    href={`/projects/${project._id}`}
                    className="text-decoration-none"
                  >
                    <Card className="h-100 shadow-sm hover-shadow">
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
                        <Card.Title className="text-success">{project.title}</Card.Title>
                        <Card.Text>{project.description.substring(0, 100)}...</Card.Text>
                        <div className="d-flex gap-2 flex-wrap">
                          <Badge bg={project.status === 'Completed' ? 'success' : 'warning'}>
                            {project.status === 'Completed' ? 'Finalizat' : 'În desfășurare'}
                          </Badge>
                          <Badge bg="secondary">{project.location}</Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-5">
            <Link href="/projects" className="btn btn-success">Vezi Toate Proiectele</Link>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center text-success mb-2">Ce Spun Clienții Noștri</h2>
          <p className="text-center mb-5">Nu ne crede doar pe cuvânt. Iată ce au de spus câțiva dintre clienții noștri mulțumiți despre serviciile noastre.</p>

          <Row xs={1} md={3} className="g-4">
            {testimonials.map((testimonial, index) => (
              <Col key={index}>
                <Card className="h-100 border-0 testimonial-card">
                  <Card.Body>
                    <div className="mb-3 text-warning">★★★★★</div>
                    <Card.Text className="mb-4">{testimonial.text}</Card.Text>
                    <div className="d-flex align-items-center">
                      <div className="testimonial-avatar me-3">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h6 className="mb-0">{testimonial.name}</h6>
                        <small className="text-muted">{testimonial.role}</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-success text-white">
        <Container className="text-center">
          <h2 className="mb-4">Ești Gata să-ți Transformi Spațiul Exterior?</h2>
          <p className="mb-4">Contactează-ne astăzi pentru o consultație gratuită și o ofertă. Hai să creăm împreună grădina visurilor tale.</p>
          <Link href="/contact" className="btn btn-warning btn-lg">Începe Astăzi</Link>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="py-5">
        <Container>
          <h2 className="text-center text-success mb-2">Contactează-ne</h2>
          <p className="text-center mb-5">Ai întrebări sau ești gata să începi? Contactează-ne folosind formularul de mai jos sau informațiile de contact.</p>

          <Row>
            <Col md={6}>
              <Form id="contact-form" onSubmit={handleContactSubmit}>
                {contactSuccess && (
                  <Alert variant="success" className="mb-4">
                    Îți mulțumim pentru mesaj! Te vom contacta în curând.
                  </Alert>
                )}
                
                {contactError && (
                  <Alert variant="danger" className="mb-4">
                    {contactError}
                  </Alert>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Numele tău</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    placeholder="Introdu numele tău"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Adresa de Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    placeholder="Introdu adresa ta de email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Număr de Telefon</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    required
                    placeholder="Introdu numărul tău de telefon"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Serviciul Care te Interesează</Form.Label>
                  <Form.Select
                    name="serviceInterested"
                    value={contactForm.serviceInterested}
                    onChange={handleContactChange}
                    required
                  >
                    <option value="">Selectează un Serviciu</option>
                    {services.map((service) => (
                      <option key={service._id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mesajul tău</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    placeholder="Introdu mesajul tău"
                  />
                </Form.Group>

                <Button 
                  variant="success" 
                  type="submit"
                  disabled={contactLoading}
                >
                  {contactLoading ? 'Se trimite...' : 'Trimite Mesaj'}
                </Button>
              </Form>
            </Col>

            <Col md={6}>
              <div className="p-4 contact-info text-white">
                <h3 className="mb-4">Contactează-ne</h3>
                
                <div className="mb-4">
                  <h5>Adresă</h5>
                  <p>Strada Grădinii 123<br />Verdeanu, VR 12345</p>
                </div>

                <div className="mb-4">
                  <h5>Telefon</h5>
                  <p>(555) 123-4567</p>
                </div>

                <div className="mb-4">
                  <h5>Email</h5>
                  <p>info@florisifrunze.ro</p>
                </div>

                <div>
                  <h5>Program de Lucru</h5>
                  <p>Luni - Vineri: 8:00 - 18:00<br />
                  Sâmbătă: 9:00 - 16:00<br />
                  Duminică: Închis</p>
                </div>

                <div className="mt-4">
                  <h5>Urmărește-ne</h5>
                  <div className="d-flex gap-3 social-icons">
                    <Link href="#" className="text-white">
                      <i className="bi bi-facebook"></i>
                    </Link>
                    <Link href="#" className="text-white">
                      <i className="bi bi-instagram"></i>
                    </Link>
                    <Link href="#" className="text-white">
                      <i className="bi bi-twitter"></i>
                    </Link>
                    <Link href="#" className="text-white">
                      <i className="bi bi-youtube"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
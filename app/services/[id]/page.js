'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Carousel, Card } from 'react-bootstrap';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ServiceDetail() {
  const params = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [relatedServices, setRelatedServices] = useState([]);

  // Fetch services from same category
  useEffect(() => {
    if (service?.category?._id) {
      const fetchRelatedServices = async () => {
        try {
          const res = await fetch(`/api/services?category=${service.category._id}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setRelatedServices(data.filter(s => s._id !== service._id).slice(0, 3));
        } catch (err) {
          console.error('Failed to load related services:', err);
        }
      };
      fetchRelatedServices();
    }
  }, [service]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? service.photos.length - 1 : prev - 1
    );
  }, [service?.photos?.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prev) => 
      prev === service.photos.length - 1 ? 0 : prev + 1
    );
  }, [service?.photos?.length]);

  const handleKeyPress = useCallback((e) => {
    if (showModal) {
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'Escape') setShowModal(false);
    }
  }, [showModal, handlePrevImage, handleNextImage, setShowModal]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showModal, handleKeyPress]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${params.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setService(data);
      } catch (err) {
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-3">
          <div className="text-center py-5">Loading...</div>
        </Container>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-3">
          <div className="alert alert-danger">
            {error || 'Service not found'}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Breadcrumb */}
      <Container className="py-3">
        <nav className="text-muted">
          <Link href="/" className="text-decoration-none text-muted">Home</Link>
          {' / '}
          <Link href="/services" className="text-decoration-none text-muted">Services</Link>
          {' / '}
          <span>{service.title}</span>
        </nav>
      </Container>

      <Container className="position-relative pb-5">
        <Row>
          {/* Main Content */}
          <Col lg={8}>
            {/* Image Carousel */}
            <div className="bg-white rounded-3 shadow-sm mb-4 p-3">
              <Carousel 
                className="service-carousel"
                activeIndex={currentSlide}
                onSelect={(index) => setCurrentSlide(index)}
              >
                {service.photos.map((photo, index) => (
                  <Carousel.Item key={index}>
                    <div 
                      onClick={() => handleImageClick(index)}
                      style={{ cursor: 'pointer', height: '400px' }}
                    >
                      <img
                        className="d-block w-100 h-100"
                        src={photo}
                        alt={`${service.title} - Photo ${index + 1}`}
                      style={{ objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
              <div className="d-flex justify-content-center mt-2">
                {service.photos.map((_, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm rounded-circle mx-1 ${
                      currentSlide === index ? 'btn-success' : 'btn-light'
                    }`}
                    style={{ width: '12px', height: '12px', padding: 0 }}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
              <h1 className="h2 mb-4">{service.title}</h1>
              <p className="text-muted">{service.description}</p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
              <h2 className="h4 text-success mb-4">Benefits</h2>
              <Row className="g-4">
                {service.benefits ? (
                  service.benefits.split('\n').filter(item => item.trim()).map((item, index) => (
                    <Col md={6} key={index}>
                      <div className="d-flex align-items-start">
                        <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                        <div>
                          <p className="mb-0">{item}</p>
                        </div>
                      </div>
                    </Col>
                  ))
                ) : (
                  <>
                    <Col md={6}>
                      <div className="d-flex align-items-start">
                        <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                        <div>
                          <h3 className="h6 mb-2">Increased Property Value</h3>
                          <p className="text-muted small mb-0">
                            A well-designed garden can significantly increase your property&apos;s market value.
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-start">
                        <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                        <div>
                          <h3 className="h6 mb-2">Enhanced Outdoor Living</h3>
                          <p className="text-muted small mb-0">
                            Create a beautiful space for relaxation, entertainment, and family activities.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </>
                )}
              </Row>
            </div>

            {/* What's Included */}
            {service.whatsIncluded && (
              <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                <h2 className="h4 text-success mb-4">What&apos;s Included</h2>
                <Row>
                  <Col md={6}>
                    {service.whatsIncluded.split('\n').filter(item => item.trim()).map((item, index) => (
                      <div key={index} className="d-flex align-items-center mb-3">
                        <i className="fas fa-check text-success me-2"></i>
                        <span>{item}</span>
                      </div>
                    ))}
                  </Col>
                </Row>
              </div>
            )}
          </Col>

          {/* Service Details Card */}
          <Col lg={4}>
            <div className="bg-white rounded-3 shadow-sm p-4 sticky-top" style={{ top: '2rem' }}>
              <h2 className="h4 text-success mb-4">Service Details</h2>
              <div className="mb-4">
                <h3 className="h2 text-success mb-1">£{service.price}</h3>
                <p className="text-muted small">starting price</p>
              </div>
              
              <button className="btn btn-success w-100 mb-4">
                Book Consultation
              </button>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-clock text-success me-2"></i>
                  <h4 className="h6 mb-0">Duration</h4>
                </div>
                <p className="text-muted small ms-4 mb-0">{service.duration}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-map-marker-alt text-success me-2"></i>
                  <h4 className="h6 mb-0">Coverage Area</h4>
                </div>
                <p className="text-muted small ms-4 mb-0">{service.coverage}</p>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-users text-success me-2"></i>
                  <h4 className="h6 mb-0">Team Size</h4>
                </div>
                <p className="text-muted small ms-4 mb-0">2-5 professional landscapers</p>
              </div>

              <div>
                <h4 className="h6 mb-3">Have questions?</h4>
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-phone text-success me-2"></i>
                  <a href="tel:(020) 1234-5678" className="text-decoration-none text-muted small">
                    (020) 1234-5678
                  </a>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-envelope text-success me-2"></i>
                  <a href="mailto:info@greenthumb.com" className="text-decoration-none text-muted small">
                    info@greenthumb.com
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* You May Also Like */}
        {relatedServices.length > 0 && (
          <div className="mt-5">
            <h2 className="h4 text-success text-center mb-4">You May Also Like</h2>
            <Row className="g-4">
              {relatedServices.map((relatedService) => (
              <Col key={relatedService._id} md={4}>
                <div className="bg-white rounded-3 shadow-sm h-100">
                  <div style={{ height: '200px' }}>
                    <img
                      src={relatedService.photos[0]}
                      alt={relatedService.title}
                      className="w-100 h-100 rounded-top"
                      style={{ objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="h5 mb-3">{relatedService.title}</h3>
                    <p className="text-muted small mb-3">
                      {relatedService.description.substring(0, 100)}&hellip;
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success">£{relatedService.price}</span>
                      <Link 
                        href={`/services/${relatedService._id}`}
                        className="text-success text-decoration-none"
                      >
                        View Details <i className="fas fa-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
            </Row>
          </div>
        )}
      </Container>

      {/* Full Screen Image Modal */}
      {showModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1050,
            cursor: 'pointer'
          }}
          onClick={() => setShowModal(false)}
        >
          <button
            className="position-fixed start-3 top-50 translate-middle-y btn text-white"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            style={{ 
              zIndex: 1051,
              backgroundColor: 'transparent',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              transition: 'transform 0.2s',
              margin: '0 20px'
            }}
          >
            <i className="fas fa-chevron-left fa-2x"></i>
          </button>

          <img
            src={service.photos[selectedImageIndex]}
            alt="Full size"
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="position-fixed end-3 top-50 translate-middle-y btn text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            style={{ 
              zIndex: 1051,
              backgroundColor: 'transparent',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              transition: 'transform 0.2s',
              margin: '0 20px'
            }}
          >
            <i className="fas fa-chevron-right fa-2x"></i>
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function Services() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCategories(data);
      } catch (err) {
        setError('Nu s-au putut încărca categoriile');
      }
    };
    fetchCategories();
  }, []);

  const fetchServices = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.set('category', params.category);
      if (params.search) queryParams.set('search', params.search);
      
      const url = `/api/services?${queryParams.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setServices(data);
    } catch (err) {
      setError('Nu s-au putut încărca serviciile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices({ category: selectedCategory });
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices({ 
      category: selectedCategory,
      search: searchQuery 
    });
  };

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div className="bg-white py-5">
        <Container>
          <h1 className="text-center text-success mb-3" style={{ fontSize: '2.5rem' }}>
            Găsește Serviciul Perfect de Grădinărit
          </h1>
          <p className="text-center text-muted mb-5">
            Explorează selecția noastră de servicii profesionale de grădinărit pentru a-ți transforma
            spațiul exterior într-o oază frumoasă.
          </p>

          {/* Search Bar */}
          <Row className="justify-content-center mb-5">
            <Col md={8}>
              <Form onSubmit={handleSearch} className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Caută servicii de grădinărit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="me-2 py-2"
                />
                <Button type="submit" variant="success" className="px-4">
                  Caută
                </Button>
              </Form>
            </Col>
          </Row>

          {/* Category Filters */}
          <div className="text-center mb-5">
            <h2 className="h4 mb-4">Caută după Categorie</h2>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'success' : 'outline-success'}
                onClick={() => setSelectedCategory('')}
                className="rounded-pill px-4"
              >
                Toate Serviciile
              </Button>
              {categories.map(category => (
                <Button
                  key={category._id}
                  variant={selectedCategory === category._id ? 'success' : 'outline-success'}
                  onClick={() => setSelectedCategory(category._id)}
                  className="rounded-pill px-4"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Services Grid */}
      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5">Se încarcă...</div>
        ) : services.length === 0 ? (
          <div className="alert alert-info">
            Nu s-au găsit servicii în această categorie.
          </div>
        ) : (
          <Row className="g-4">
            {services.map(service => (
              <Col key={service._id} md={6} lg={4}>
                <div className="bg-white rounded-3 shadow-sm h-100 position-relative">
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={service.photos[0]}
                      alt={service.title}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="h5 mb-2">{service.title}</h3>
                    <div className="d-flex align-items-center mb-3">
                      <i className="fas fa-star text-warning me-1"></i>
                      <span className="fw-bold me-2">4.8</span>
                      <span className="text-muted">{service.category.name}</span>
                    </div>
                    <p className="text-muted mb-4">
                      {service.description.substring(0, 100)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h4 mb-0 text-success">£{service.price}</span>
                      <Link 
                        href={`/services/${service._id}`}
                        className="btn btn-success"
                      >
                        Rezervă Acum
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterested: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.phone || !formData.serviceInterested || !formData.message) {
        throw new Error('Te rugăm să completezi toate câmpurile obligatorii');
      }

      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Nu s-a putut trimite formularul');
      }

      // Clear form and show success message
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceInterested: '',
        message: ''
      });

      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message);
      // Scroll to top to show error message
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container className="py-5">
      <h1 className="text-center text-success mb-4">Contactează-ne</h1>
      <p className="text-center mb-5">
        Ai întrebări sau ești gata să începi? Contactează-ne folosind formularul de mai jos.
      </p>

      <div className="row">
        <div className="col-lg-6">
          <Form onSubmit={handleSubmit}>
            {success && (
              <Alert variant="success" className="mb-4">
                Îți mulțumim pentru mesaj! Te vom contacta în curând.
              </Alert>
            )}
            
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Numele tău</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Introdu numele tău"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adresa de email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Introdu adresa ta de email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Număr de telefon</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Introdu numărul tău de telefon"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Serviciul care te interesează</Form.Label>
              <Form.Select
                name="serviceInterested"
                value={formData.serviceInterested}
                onChange={handleChange}
                required
              >
                <option value="">Selectează un serviciu</option>
                <option value="Garden Design">Design de Grădină</option>
                <option value="Lawn Maintenance">Întreținere Gazon</option>
                <option value="Seasonal Planting">Plantare Sezonieră</option>
                <option value="Irrigation Systems">Sisteme de Irigații</option>
                <option value="Landscape Lighting">Iluminat Peisagistic</option>
                <option value="Hardscaping">Amenajări cu Materiale Dure</option>
                <option value="Other">Altele</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mesajul tău</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Spune-ne despre proiectul sau cerințele tale"
              />
            </Form.Group>

            <Button 
              type="submit" 
              variant="success" 
              size="lg" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Se trimite...' : 'Trimite Mesaj'}
            </Button>
          </Form>
        </div>

        <div className="col-lg-6 mt-4 mt-lg-0">
          <div className="bg-light p-4 rounded">
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

            <div className="mb-4">
              <h5>Program de lucru</h5>
              <p>
                Luni - Vineri: 8:00 - 18:00<br />
                Sâmbătă: 9:00 - 16:00<br />
                Duminică: Închis
              </p>
            </div>

            <div>
              <h5>Urmărește-ne</h5>
              <div className="d-flex gap-3 fs-4">
                <a href="#" className="text-success"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-success"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-success"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-success"><i className="bi bi-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
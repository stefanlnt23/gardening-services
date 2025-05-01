'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        throw new Error('Invalid email or password');
      }

      // Redirect to home page on successful login
      router.push('/');
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="auth-form-container">
            <h2 className="auth-form-heading">Welcome Back</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="d-flex justify-content-end mt-1">
                  <Link href="/forgot-password" className="text-success small">
                    Forgot password?
                  </Link>
                </div>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="success" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
              
              <div className="text-center mt-3">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-success">
                  Register here
                </Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

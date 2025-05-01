'use client';

import { useEffect, useState } from 'react';
import { Container, Table, Badge, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ManageInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState('New');
  const [scheduledDate, setScheduledDate] = useState('');

  // Define fetchInquiries outside useEffect to avoid the missing dependency warning
  const fetchInquiries = async () => {
    try {
      const url = filterStatus 
        ? `/api/contact?status=${filterStatus}`
        : '/api/contact';
      
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }
      
      const data = await response.json();
      console.log('Fetched inquiries:', data);
      setInquiries(data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus === 'loading') {
      console.log('Session loading...');
      return;
    }
    
    if (!session?.user?.isAdmin) {
      console.log('Not admin, redirecting...');
      router.push('/');
      return;
    }

    console.log('Session status:', sessionStatus);
    console.log('User:', session?.user);
    console.log('Fetching inquiries...');

    fetchInquiries();
  }, [filterStatus, session, sessionStatus, router, fetchInquiries]);

  const handleShowModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.adminNotes || '');
    setInquiryStatus(inquiry.status);
    setScheduledDate(inquiry.scheduledDate ? new Date(inquiry.scheduledDate).toISOString().split('T')[0] : '');
    setShowModal(true);
  };

  const handleUpdateInquiry = async () => {
    try {
      console.log('Updating inquiry:', selectedInquiry._id);
      const response = await fetch(`/api/contact/${selectedInquiry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminNotes,
          status: inquiryStatus,
          scheduledDate: scheduledDate || null,
        }),
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update inquiry');
      }

      // Refresh inquiries by updating filterStatus
      setFilterStatus(prev => prev);
      setShowModal(false);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error updating inquiry:', err);
      setError(err.message);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'New':
        return 'primary';
      case 'In Progress':
        return 'warning';
      case 'Completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  if (sessionStatus === 'loading' || loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Inquiries</h1>
        <Form.Select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Form.Select>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Contact Info</th>
            <th>Service</th>
            <th>Status</th>
            <th>Scheduled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry._id}>
              <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
              <td>{inquiry.name}</td>
              <td>
                <div>Email: {inquiry.email}</div>
                <div>Phone: {inquiry.phone}</div>
              </td>
              <td>{inquiry.serviceInterested}</td>
              <td>
                <Badge bg={getStatusBadgeVariant(inquiry.status)}>
                  {inquiry.status}
                </Badge>
              </td>
              <td>
                {inquiry.scheduledDate 
                  ? new Date(inquiry.scheduledDate).toLocaleDateString()
                  : 'Not scheduled'
                }
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleShowModal(inquiry)}
                >
                  Manage
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage Inquiry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInquiry && (
            <>
              <div className="mb-3">
                <h5>Customer Details</h5>
                <p><strong>Name:</strong> {selectedInquiry.name}</p>
                <p><strong>Email:</strong> {selectedInquiry.email}</p>
                <p><strong>Phone:</strong> {selectedInquiry.phone}</p>
                <p><strong>Service:</strong> {selectedInquiry.serviceInterested}</p>
                <p><strong>Message:</strong></p>
                <p className="border rounded p-3">{selectedInquiry.message}</p>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  value={inquiryStatus}
                  onChange={(e) => setInquiryStatus(e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Scheduled Date</Form.Label>
                <Form.Control
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Admin Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about customer requirements, follow-up details, etc."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateInquiry}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

export default function NavbarComponent() {
  const { data: session } = useSession();

  return (
    <Navbar bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/">
          <img
            src="https://i.postimg.cc/Rmgf9BZF/logo.png" // Add your logo in the public folder
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Logo Flori si Frunze"
          />
          Flori și Frunze
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">Acasă</Nav.Link>
            <Nav.Link as={Link} href="/services" className="nav-link">Servicii</Nav.Link>
            <Nav.Link as={Link} href="/projects" className="nav-link">Proiecte</Nav.Link>
            <Nav.Link as={Link} href="/about">Despre noi</Nav.Link>
            <Nav.Link as={Link} href="/contact">Contact</Nav.Link>
          </Nav>
          <Nav>
            {session ? (
              <>
                <span className="navbar-text me-3 text-white">
                  Bun venit, {session.user.name}
                </span>
                {session.user.isAdmin && (
                  <Nav.Link 
                    as={Link} 
                    href="/admin" 
                    className="btn btn-warning me-2"
                  >
                    Panou Administrator
                  </Nav.Link>
                )}
                <Button 
                  variant="outline-light" 
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Deconectare
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} href="/login" className="btn btn-outline-light me-2">
                  Autentificare
                </Nav.Link>
                <Nav.Link as={Link} href="/register" className="btn btn-light">
                  Înregistrare
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
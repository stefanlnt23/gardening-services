'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: 'Alexandru Popescu',
      role: 'Fondator & Director General',
      bio: 'Cu peste 20 de ani de experiență în horticultură și peisagistică, Alexandru a fondat Flori și Frunze în 2008 cu viziunea de a transforma spațiile exterioare în oaze de frumusețe și funcționalitate.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    },
    {
      name: 'Maria Ionescu',
      role: 'Designer Peisagist Principal',
      bio: 'Maria este absolventă a Universității de Științe Agronomice și are o pasiune pentru designul durabil. Ea creează grădini care sunt atât frumoase, cât și prietenoase cu mediul.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80'
    },
    {
      name: 'Mihai Dumitrescu',
      role: 'Specialist în Horticultură',
      bio: 'Cu o diplomă în botanică și o dragoste pentru plante, Mihai se asigură că fiecare grădină pe care o creăm este plină de viață și prosperă în toate anotimpurile.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    },
    {
      name: 'Elena Radu',
      role: 'Manager de Proiect',
      bio: 'Elena coordonează echipele noastre de teren și se asigură că fiecare proiect este livrat la timp și la cele mai înalte standarde de calitate.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    }
  ];

  // Company values
  const values = [
    {
      title: 'Sustenabilitate',
      description: 'Credem în practicile de grădinărit ecologice și utilizăm metode care conservă apa și promovează biodiversitatea.',
      icon: '🌱'
    },
    {
      title: 'Excelență',
      description: 'Ne străduim să oferim cele mai bune servicii și să depășim așteptările clienților noștri în fiecare proiect.',
      icon: '⭐'
    },
    {
      title: 'Inovație',
      description: 'Suntem mereu în căutarea celor mai noi tehnici și tendințe în peisagistică pentru a oferi soluții moderne și eficiente.',
      icon: '💡'
    },
    {
      title: 'Comunitate',
      description: 'Suntem dedicați îmbunătățirii comunităților locale prin crearea de spații verzi frumoase și accesibile.',
      icon: '🤝'
    }
  ];

  // Gallery images
  const galleryImages = [
    'https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
    'https://images.unsplash.com/photo-1626863905121-3b0c0ed7b8c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    'https://images.unsplash.com/photo-1599685315640-4a9ba2613518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
    'https://images.unsplash.com/photo-1598902108854-10e335adac99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
    'https://images.unsplash.com/photo-1611062725583-eb70b9368c63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="position-relative bg-success text-white py-5">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col md={8} className="mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">Despre Flori și Frunze</h1>
              <p className="lead mb-4">Transformăm spații exterioare în grădini frumoase și funcționale din 2008</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Our Story Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="position-relative" style={{ height: '500px' }}>
                <Image
                  src="https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  alt="Grădină frumoasă creată de Flori și Frunze"
                  fill
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  priority
                />
              </div>
            </Col>
            <Col lg={6}>
              <h2 className="text-success mb-4">Povestea Noastră</h2>
              <p>Flori și Frunze a fost fondată în 2008 de către Alexandru Popescu, un horticultor pasionat cu viziunea de a transforma spațiile exterioare obișnuite în grădini extraordinare. Începând cu o echipă mică și câțiva clienți dedicați, compania noastră a crescut pentru a deveni unul dintre cei mai respectați furnizori de servicii de grădinărit și peisagistică din regiune.</p>
              <p>De-a lungul anilor, ne-am extins serviciile pentru a include design peisagistic, întreținere regulată a grădinilor, instalare de sisteme de irigație, iluminat peisagistic și multe altele. Am avut privilegiul de a lucra la o varietate de proiecte, de la grădini rezidențiale intime până la spații comerciale extinse.</p>
              <p>Ceea ce ne diferențiază este angajamentul nostru față de calitate, atenția la detalii și abordarea personalizată pentru fiecare client. Înțelegem că fiecare spațiu exterior este unic, și lucrăm îndeaproape cu clienții noștri pentru a crea grădini care reflectă stilul lor personal și îndeplinesc nevoile lor specifice.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Mission Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col md={8} className="mx-auto text-center mb-5">
              <h2 className="text-success mb-4">Misiunea Noastră</h2>
              <p className="lead">Misiunea noastră este să creăm și să întreținem spații exterioare frumoase, durabile și funcționale care îmbunătățesc calitatea vieții clienților noștri și contribuie la un mediu mai sănătos.</p>
            </Col>
          </Row>

          <Row>
            {values.map((value, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="display-4 mb-3 text-success">{value.icon}</div>
                    <Card.Title className="mb-3">{value.title}</Card.Title>
                    <Card.Text>{value.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Our Team Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-success text-center mb-5">Echipa Noastră</h2>
          <Row>
            {teamMembers.map((member, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <div style={{ height: '250px', position: 'relative' }}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      style={{ objectFit: 'cover', borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem' }}
                      loading="lazy"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="mb-1">{member.name}</Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">{member.role}</Card.Subtitle>
                    <Card.Text>{member.bio}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-success text-center mb-5">Galerie de Proiecte</h2>
          <Row className="g-3">
            {galleryImages.map((image, index) => (
              <Col md={6} lg={4} key={index}>
                <div className="position-relative" style={{ height: '250px' }}>
                  <Image
                    src={image}
                    alt={`Proiect Flori și Frunze ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                    className="shadow-sm hover-shadow"
                    loading="lazy"
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-success text-white">
        <Container className="text-center">
          <h2 className="mb-4">Gata să Transformi Grădina Ta?</h2>
          <p className="lead mb-4">Contactează-ne astăzi pentru o consultație gratuită și lasă-ne să te ajutăm să creezi grădina visurilor tale.</p>
          <Link href="/contact" className="btn btn-warning btn-lg">Contactează-ne</Link>
        </Container>
      </section>
    </div>
  );
}

import NavbarComponent from '@/components/Navbar';
import Providers from '@/components/Providers';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';

export const metadata = {
  title: 'Flori și Frunze - Servicii Profesionale de Grădinărit',
  description: 'Servicii profesionale de grădinărit pentru toate nevoile tale de amenajare peisagistică',
  icons: {
    icon: [
      { url: '/icon' }
    ],
    shortcut: ['/icon'],
    apple: [
      { url: '/icon' }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <Providers>
          <NavbarComponent />
          {children}
          <footer className="bg-success text-white py-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <img src="/logo.png" alt="Flori și Frunze" width="30" height="30" className="me-2" />
                    <h5 className="mb-0">Flori și Frunze</h5>
                  </div>
                  <p className="mb-4">Servicii profesionale de grădinărit pentru a crea și întreține spații exterioare frumoase.</p>
                  <div className="d-flex gap-3 social-icons">
                    <a href="#" className="text-white"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="text-white"><i className="bi bi-instagram"></i></a>
                    <a href="#" className="text-white"><i className="bi bi-twitter"></i></a>
                    <a href="#" className="text-white"><i className="bi bi-youtube"></i></a>
                  </div>
                </div>
                
                <div className="col-lg-3 mb-4">
                  <h5 className="mb-3">Linkuri Rapide</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><Link href="/" className="text-white text-decoration-none">Acasă</Link></li>
                    <li className="mb-2"><Link href="/services" className="text-white text-decoration-none">Servicii</Link></li>
                    <li className="mb-2"><Link href="/about" className="text-white text-decoration-none">Despre Noi</Link></li>
                    <li className="mb-2"><Link href="/gallery" className="text-white text-decoration-none">Galerie</Link></li>
                    <li className="mb-2"><Link href="/testimonials" className="text-white text-decoration-none">Testimoniale</Link></li>
                    <li className="mb-2"><Link href="/contact" className="text-white text-decoration-none">Contact</Link></li>
                  </ul>
                </div>
                
                <div className="col-lg-3 mb-4">
                  <h5 className="mb-3">Servicii</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><Link href="/services/garden-design" className="text-white text-decoration-none">Design Grădină</Link></li>
                    <li className="mb-2"><Link href="/services/lawn-maintenance" className="text-white text-decoration-none">Întreținere Gazon</Link></li>
                    <li className="mb-2"><Link href="/services/seasonal-planting" className="text-white text-decoration-none">Plantare Sezonieră</Link></li>
                    <li className="mb-2"><Link href="/services/irrigation-systems" className="text-white text-decoration-none">Sisteme de Irigație</Link></li>
                    <li className="mb-2"><Link href="/services/landscape-lighting" className="text-white text-decoration-none">Iluminat Peisagistic</Link></li>
                    <li className="mb-2"><Link href="/services/hardscaping" className="text-white text-decoration-none">Amenajări Exterioare</Link></li>
                  </ul>
                </div>
                
                <div className="col-lg-3 mb-4">
                  <h5 className="mb-3">Newsletter</h5>
                  <p>Abonează-te la newsletter-ul nostru pentru sfaturi de grădinărit și oferte speciale.</p>
                  <form className="mb-3">
                    <div className="input-group">
                      <input type="email" className="form-control" placeholder="Adresa ta de email" />
                      <button className="btn btn-light" type="submit">→</button>
                    </div>
                  </form>
                  <small className="text-white-50">Acesta este un formular demonstrativ. Într-o implementare reală, te-ai abona la newsletter-ul nostru.</small>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="text-center">
                <p className="mb-0">© {new Date().getFullYear()} Flori și Frunze. Toate drepturile rezervate.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

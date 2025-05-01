import NavbarComponent from '@/components/Navbar';
import Providers from '@/components/Providers';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';

export const metadata = {
  title: 'GreenThumb Gardens - Professional Gardening Services',
  description: 'Professional gardening services for all your landscaping needs',
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
    <html lang="en">
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
                    <img src="/logo.png" alt="GreenThumb" width="30" height="30" className="me-2" />
                    <h5 className="mb-0">GreenThumb</h5>
                  </div>
                  <p className="mb-4">Professional gardening services to create and maintain beautiful outdoor spaces.</p>
                  <div className="d-flex gap-3 social-icons">
                    <a href="#" className="text-white"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="text-white"><i className="bi bi-instagram"></i></a>
                    <a href="#" className="text-white"><i className="bi bi-twitter"></i></a>
                    <a href="#" className="text-white"><i className="bi bi-youtube"></i></a>
                  </div>
                </div>
                
                <div className="col-lg-3 mb-4">
                  <h5 className="mb-3">Quick Links</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="/" className="text-white text-decoration-none">Home</a></li>
                    <li className="mb-2"><a href="/services" className="text-white text-decoration-none">Services</a></li>
                    <li className="mb-2"><a href="/about" className="text-white text-decoration-none">About Us</a></li>
                    <li className="mb-2"><a href="/gallery" className="text-white text-decoration-none">Gallery</a></li>
                    <li className="mb-2"><a href="/testimonials" className="text-white text-decoration-none">Testimonials</a></li>
                    <li className="mb-2"><a href="/contact" className="text-white text-decoration-none">Contact</a></li>
                  </ul>
                </div>
                
                <div className="col-lg-3 mb-4">
                  <h5 className="mb-3">Services</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="/services/garden-design" className="text-white text-decoration-none">Garden Design</a></li>
                    <li className="mb-2"><a href="/services/lawn-maintenance" className="text-white text-decoration-none">Lawn Maintenance</a></li>
                    <li className="mb-2"><a href="/services/seasonal-planting" className="text-white text-decoration-none">Seasonal Planting</a></li>
                    <li className="mb-2"><a href="/services/irrigation-systems" className="text-white text-decoration-none">Irrigation Systems</a></li>
                    <li className="mb-2"><a href="/services/landscape-lighting" className="text-white text-decoration-none">Landscape Lighting</a></li>
                    <li className="mb-2"><a href="/services/hardscaping" className="text-white text-decoration-none">Hardscaping</a></li>
                  </ul>
                </div>
                
                <div className="col-lg-3 mb-4">
                  <h5 className="mb-3">Newsletter</h5>
                  <p>Subscribe to our newsletter for gardening tips and special offers.</p>
                  <form className="mb-3">
                    <div className="input-group">
                      <input type="email" className="form-control" placeholder="Your email address" />
                      <button className="btn btn-light" type="submit">→</button>
                    </div>
                  </form>
                  <small className="text-white-50">This is a demo form. In a real implementation, this would subscribe you to our newsletter.</small>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="text-center">
                <p className="mb-0">© {new Date().getFullYear()} GreenThumb Gardening Services. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

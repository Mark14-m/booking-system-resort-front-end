import React from 'react'
import AdminNavbar from '../components/layouts/AdminNavbar'
import AdminSidebar from '../components/layouts/AdminSidebar'
import { NavLink, Outlet } from 'react-router-dom'
import UserNavbar from '../components/layouts/UserNavbar'
import {
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube
} from "react-icons/fa"

function UserLayout() {
  const socialIcons = [
    { name: "facebook", icon: <FaFacebookF /> },
    { name: "twitter", icon: <FaTwitter /> },
    { name: "instagram", icon: <FaInstagram /> },
    { name: "youtube", icon: <FaYoutube /> },
  ];

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <div className="layout-page">
          <UserNavbar />

          <div className="content-wrapper">
            <Outlet />

            {/* Footer */}
            <footer className="bg-dark text-white pt-5 pb-4" id="footer">
              <div className="container">
                <div className="row">
                  {/* Brand Description */}
                  <div className="col-md-4 mb-4">
                    <h3 className="text-primary fw-bold">Blue Belle Resort</h3>
                    <p className="text-light">
                      Experience luxury and tranquility in our exclusive beachfront paradise.
                    </p>
                    <div className="d-flex gap-3">
                      {socialIcons.map(({ name, icon }) => (
                        <a
                          key={name}
                          href="#"
                          className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '36px', height: '36px' }}
                          aria-label={`Follow us on ${name}`}
                        >
                          {icon}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="col-md-4 mb-4">
                    <h5 className="fw-semibold mb-3">Quick Links</h5>
                    <ul className="list-unstyled">
                      <li><a href="/" className="text-light text-decoration-none d-block mb-2">Home</a></li>
                      <li><a href="/#about" className="text-light text-decoration-none d-block mb-2">About</a></li>
                      <li><a href="/#amenities" className="text-light text-decoration-none d-block mb-2">Amenities</a></li>
                      <li><NavLink tp="/gallery" className="text-light text-decoration-none d-block mb-2">Gallery</NavLink></li>
                      <li><a href="/#contact" className="text-light text-decoration-none d-block mb-2">Contact</a></li>
                      <li><a href="/#booking-cta" className="text-light text-decoration-none d-block mb-2">Book Now</a></li>
                      <li><NavLink to="/login" className="text-light text-decoration-none d-block">Login & Register</NavLink></li>
                    </ul>
                  </div>

                  {/* Amenities */}
                  {/* <div className="col-md-3 mb-4">
                    <h5 className="fw-semibold mb-3">Amenities</h5>
                    <ul className="list-unstyled">
                      <li><a href="#" className="text-light text-decoration-none d-block mb-2">Amenity #1</a></li>
                      <li><a href="#" className="text-light text-decoration-none d-block mb-2">Amenity #2</a></li>
                      <li><a href="#" className="text-light text-decoration-none d-block mb-2">Amenity #3</a></li>
                      <li><a href="#" className="text-light text-decoration-none d-block mb-2">Amenity #4</a></li>
                    </ul>
                  </div> */}

                  {/* Contact Info */}
                  <div className="col-md-4 mb-4">
                    <h5 className="fw-semibold mb-3">Contact Us</h5>
                    <address className="text-light">
                      <p className="mb-1">BlueBelle Resort</p>
                      <p className="mb-1">Paliparan II</p>
                      <p className="mt-3 mb-1">Phone: +1 (555) 123-4567</p>
                      <p>Email: info@bluebelleresort.com</p>
                    </address>
                  </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-top border-secondary pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <p className="text-light mb-2 mb-md-0">
                    &copy; {new Date().getFullYear()} Blue Belle Hotel And Resort. All rights reserved.
                  </p>
                  <div className="d-flex gap-3">
                    <a href="#" className="text-light text-decoration-none small">Privacy Policy</a>
                    <a href="#" className="text-light text-decoration-none small">Terms of Service</a>
                    <a href="#" className="text-light text-decoration-none small">Cookie Policy</a>
                  </div>
                </div>
              </div>
            </footer>

            <div className="content-backdrop fade"></div>
          </div>
        </div>
      </div>

      <div className="layout-overlay layout-menu-toggle"></div>
    </div>
  )
}

export default UserLayout
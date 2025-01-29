import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="/">
          <img
            src="/path/to/your/logo.png" // Replace with your logo path
            alt="Logo"
            style={{ height: '40px' }} // Adjust logo height
          />
        </a>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/history">
                History
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about-us">
                About Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Custom CSS */}
      <style>
        {`
          .navbar {
            padding: 1rem 2rem;
          }
          .navbar-brand img {
            transition: transform 0.3s ease;
          }
          .navbar-brand img:hover {
            transform: scale(1.1);
          }
          .nav-link {
            color: #2c3e50 !important; /* Dark blue color */
            font-weight: 500;
            margin: 0 0.5rem;
            position: relative;
          }
          .nav-link:hover {
            color: #3498db !important; /* Light blue color on hover */
          }
          .nav-link::after {
            content: '';
            display: block;
            width: 0;
            height: 2px;
            background: #3498db; /* Light blue underline */
            transition: width 0.3s;
            position: absolute;
            bottom: -2px;
            left: 0;
          }
          .nav-link:hover::after {
            width: 100%;
          }
          .navbar-toggler {
            border: none;
          }
          .navbar-toggler:focus {
            box-shadow: none;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
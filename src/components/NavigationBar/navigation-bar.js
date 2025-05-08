// NavigationBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/LOGO_upscayl_4x_ultrasharp.png'; // Update this path to your actual logo file
import './navigation-bar.scss';

function NavigationBar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Pet Feeder Logo" className="logo-image" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dog-sizes">Dog Size</Link>
        </li>
        <li>
          <Link to="/schedule-feeding">Schedule</Link>
        </li>
        <li>
          <Link to="/auto-feed-times">Auto Schedule</Link>
        </li>
        <li>
          <Link to="/feed-now">Feed Now</Link>
        </li>
        <li>
          <Link to="/camera">Camera</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavigationBar;

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.scss';
import GROUPOFDOGS from '../../assets/Layer 1.png';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="side-by-side">
          <div className="text-block">
            <h1>Smart Feeding for Your Furry Friends</h1>
            <p className="description">
              Automated Pet Feeder is an innovative, IoT-enabled automatic feeding system 
              designed to make pet care simpler and smarter especially for busy pet owners. 
              Built with remote access and intelligent features, our solution allows users 
              to feed their pets from anywhere using a mobile app, ensuring they never miss a meal.
            </p>
            
            {/* Moved buttons here */}
            <div className="button-group">
              <Link to="/dog-sizes" className="primary-button">Get Started</Link>
              <Link to="/feed-now" className="secondary-button">Feed Now</Link>
            </div>
          </div>
          
          <div className="image-block">
            <img src={GROUPOFDOGS} alt="Happy dogs eating" />
          </div>
        </div>

        <div className="divider"></div>
        
        <h2>Features</h2>
        
        <div className="features-grid">
          <Link to="/dog-sizes" className="feature-card">
            <h3>Dog Size Selection</h3>
            <p>Customize feeding amounts based on your dog's size</p>
            <span className="learn-more">Learn More</span>
          </Link>
          
          <Link to="/feed-now" className="feature-card">
            <h3>Feed Now</h3>
            <p>Dispense food immediately with one tap</p>
            <span className="learn-more">Learn More</span>
          </Link>
          
          <Link to="/schedule-feeding" className="feature-card">
            <h3>Schedule Feeding</h3>
            <p>Set up regular feeding times for your pet</p>
            <span className="learn-more">Learn More</span>
          </Link>
          
          <Link to="/camera" className="feature-card">
            <h3>Camera Monitoring</h3>
            <p>Watch your pet enjoy their meal in real-time</p>
            <span className="learn-more">Learn More</span>
          </Link>
          
          <Link to="/auto-feed-times" className="feature-card">
            <h3>Auto Scheduling</h3>
            <p>Let us calculate the optimal feeding schedule</p>
            <span className="learn-more">Learn More</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;        
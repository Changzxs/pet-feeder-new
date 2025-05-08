// src/components/DogSize/DogSize.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './DogSizes.scss';
import SmallDogImage from '../../assets/SMALL DOGS.jpg';
import MediumDogImage from '../../assets/MEDIUM DOGS.jpg';
import LargeDogImage from '../../assets/LARGE DOGS.png';

const DogSize = () => {
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const apiUrl = "http://192.168.0.117"; // Match Arduino's static IP

  const portionSizes = {
    small: { 
      weight: "Up to 20 lbs",
      amount: "25g", 
      examples: "Chihuahua, Pomeranian, Yorkshire Terrier"
    },
    medium: { 
      weight: "20-50 lbs",
      amount: "50g", 
      examples: "Beagle, Bulldog, Cocker Spaniel"
    },
    large: { 
      weight: "50-90 lbs",
      amount: "100g", 
      examples: "Labrador, Golden Retriever, German Shepherd"
    }
  };

  const updateDogSize = async (size) => {
    if (loading) return;
    setLoading(true);
    setSelectedSize(size);

    try {
      const response = await fetch(`${apiUrl}/update-size`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: size.toLowerCase() }),
      });

      const data = await response.json();
      alert(`✅ ${size} portion set successfully!`);
    } catch (error) {
      console.error("Error updating size:", error);
      alert("❌ Error connecting to feeder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dog-size-container">
      <h1>Select Your Dog's Size</h1>
      <p className="description">
        Choose your dog's size to set the optimal feeding amount. 
        This will configure your pet feeder's portion size.
      </p>

      <div className="size-options">
        {/* Small Dog Card */}
        <div className={`size-card ${selectedSize === 'small' ? 'selected' : ''}`}>
          <div className="dog-image-container">
            <img src={SmallDogImage} alt="Small dog" className="dog-image" />
          </div>
          <h2>Small</h2>
          <p className="weight-range">{portionSizes.small.weight}</p>
          <div className="details">
            <p className="examples">
              <strong>Examples:</strong> {portionSizes.small.examples}
            </p>
            <p className="recommendation">
              <strong>Portion size:</strong> {portionSizes.small.amount}
            </p>
          </div>
          <button 
            className="select-button"
            onClick={() => updateDogSize('small')}
            disabled={loading}
          >
            {loading && selectedSize === 'small' ? 'Setting...' : 'Select Small'}
          </button>
        </div>

        {/* Medium Dog Card */}
        <div className={`size-card ${selectedSize === 'medium' ? 'selected' : ''}`}>
          <div className="dog-image-container">
            <img src={MediumDogImage} alt="Medium dog" className="dog-image" />
          </div>
          <h2>Medium</h2>
          <p className="weight-range">{portionSizes.medium.weight}</p>
          <div className="details">
            <p className="examples">
              <strong>Examples:</strong> {portionSizes.medium.examples}
            </p>
            <p className="recommendation">
              <strong>Portion size:</strong> {portionSizes.medium.amount}
            </p>
          </div>
          <button 
            className="select-button"
            onClick={() => updateDogSize('medium')}
            disabled={loading}
          >
            {loading && selectedSize === 'medium' ? 'Setting...' : 'Select Medium'}
          </button>
        </div>

        {/* Large Dog Card */}
        <div className={`size-card ${selectedSize === 'large' ? 'selected' : ''}`}>
          <div className="dog-image-container">
            <img src={LargeDogImage} alt="Large dog" className="dog-image" />
          </div>
          <h2>Large</h2>
          <p className="weight-range">{portionSizes.large.weight}</p>
          <div className="details">
            <p className="examples">
              <strong>Examples:</strong> {portionSizes.large.examples}
            </p>
            <p className="recommendation">
              <strong>Portion size:</strong> {portionSizes.large.amount}
            </p>
          </div>
          <button 
            className="select-button"
            onClick={() => updateDogSize('large')}
            disabled={loading}
          >
            {loading && selectedSize === 'large' ? 'Setting...' : 'Select Large'}
          </button>
        </div>
      </div>

      <div className="action-buttons">
  <div className="secondary-actions">
    <Link to="/" className="back-btn">
      ⬅ Back to Home
    </Link>
    <Link to="/schedule-feeding" className="continue-btn">
      Continue to Schedule ➡
    </Link>
  </div>
        </div>
    </div>
  );
};

export default DogSize;

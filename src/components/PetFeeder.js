import React, { useState } from "react";
import "./PetFeeder.scss";

// Import image if it's inside src/assets/images/
import dogImage from "../assets/DogImage.jpg";

const PetFeeder = () => {
  const [autoFeeds, setAutoFeeds] = useState([
    { time: "7:00 AM", amount: 8, days: 7 }, // Default: 7 days
    { time: "12:00 PM", amount: 2, days: 7 },
    { time: "6:00 PM", amount: 2, days: 7 },
  ]);

  const [dogSize, setDogSize] = useState("Small");

  const handleIncrease = (index) => {
    const newFeeds = [...autoFeeds];
    newFeeds[index].amount += 1;
    setAutoFeeds(newFeeds);
  };

  const handleDecrease = (index) => {
    const newFeeds = [...autoFeeds];
    if (newFeeds[index].amount > 0) {
      newFeeds[index].amount -= 1;
      setAutoFeeds(newFeeds);
    }
  };

  const handleFeedNow = async () => {
    try {
      const response = await fetch("http://192.168.1.200/feed-now", {
        method: "POST",
      });

      if (response.ok) {
        alert("Feeding Now! 🐾");
      } else {
        alert("Failed to feed.");
      }
    } catch (error) {
      console.error("Error sending feed request:", error);
      alert("Error connecting to feeder.");
    }
  };

  const handleDaysChange = (index, newDays) => {
    const newFeeds = [...autoFeeds];
    newFeeds[index].days = newDays;
    setAutoFeeds(newFeeds);
  };

  const handleSizeChange = (event) => {
    setDogSize(event.target.value);
  };

  const updateDogSize = async () => {
    try {
      const response = await fetch("http://your-arduino-ip/update-size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: dogSize }),
      });

      if (response.ok) {
        alert("Dog size updated successfully!");
      } else {
        alert("Failed to update dog size.");
      }
    } catch (error) {
      console.error("Error updating size:", error);
    }
  };

  return (
    <div className="pet-feeder">
      <h3>Schedule Feeding</h3>
      <div className="top-section">
        {/* ✅ Dog Size Selection (Aligned with Schedule Feeding) */}
        <div className="dog-size-selection">
          <label>Dog Size:</label>
          <select value={dogSize} onChange={handleSizeChange}>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
          <button className="update-btn" onClick={updateDogSize}>Update</button>
        </div>

        {/* ✅ Schedule Feeding (Without Amount Input) */}
        <div className="schedule">
          <input type="time" />
          <button className="feed-btn">Schedule Now</button>
        </div>
      </div>

      <h3>Auto Feed Times:</h3>
      <div className="auto-feeds">
        {autoFeeds.map((feed, index) => (
          <div key={index} className="feed-item">
            <span>{feed.time}</span>
            <input type="number" value={feed.amount} readOnly />
            <button className="plus" onClick={() => handleIncrease(index)}>+</button>
            <button className="minus" onClick={() => handleDecrease(index)}>-</button>

            {/* ✅ New Input for Scheduling Days */}
            <input
              type="number"
              value={feed.days}
              onChange={(e) => handleDaysChange(index, Number(e.target.value))}
              className="days-input"
            />
            <button className="schedule-btn">Set Days</button>
          </div>
        ))}
      </div>

      {/* ✅ "Feed Now" Button - Works with Arduino R4 WiFi */}
      <button className="feed-now-btn" onClick={handleFeedNow}>
        Feed Now
      </button>
    </div>
  );
};

export default PetFeeder;

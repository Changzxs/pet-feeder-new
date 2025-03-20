import React, { useState } from "react";
import "./PetFeeder.scss";

// Import image if it's inside src/assets/images/
import dogImage from "../assets/DogImage.jpg";

const PetFeeder = () => {
  const [autoFeeds, setAutoFeeds] = useState([
    { time: "7:00 AM", days: 7 }, // Default: 7 days
    { time: "12:00 PM", days: 7 },
    { time: "6:00 PM", days: 7 },
  ]);

  const [dogSize, setDogSize] = useState("Small");
  const apiUrl = "http://192.168.1.200"; // Replace with your Arduino R4 WiFi IP

  // ✅ Function to send dog size update to Arduino R4 WiFi
  const updateDogSize = async () => {
    try {
      const response = await fetch(`${apiUrl}/update-size`, {
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

  // ✅ Function to send "Feed Now" command to Arduino R4 WiFi
  const handleFeedNow = async () => {
    try {
      const response = await fetch(`${apiUrl}/feed-now`, {
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

  // ✅ Function to schedule feeding on Arduino R4 WiFi
  const handleScheduleFeed = async (time, days) => {
    try {
      const response = await fetch(`${apiUrl}/schedule-feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time, days }),
      });

      if (response.ok) {
        alert(`Feeding scheduled at ${time} for ${days} days!`);
      } else {
        alert("Failed to schedule feeding.");
      }
    } catch (error) {
      console.error("Error scheduling feeding:", error);
      alert("Error connecting to feeder.");
    }
  };

  // ✅ Function to update scheduled days
  const handleDaysChange = (index, newDays) => {
    const newFeeds = [...autoFeeds];
    newFeeds[index].days = newDays;
    setAutoFeeds(newFeeds);
  };

  return (
    <div className="pet-feeder">
      <h3>Schedule Feeding</h3>
      <div className="top-section">
        {/* ✅ Dog Size Selection (Aligned with Schedule Feeding) */}
        <div className="dog-size-selection">
          <label>Dog Size:</label>
          <select value={dogSize} onChange={(e) => setDogSize(e.target.value)}>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
          <button className="update-btn" onClick={updateDogSize}>
            Update
          </button>
        </div>

        {/* ✅ Schedule Feeding (With Working Connection) */}
        <div className="schedule">
          <input type="time" id="customTime" />
          <button
            className="feed-btn"
            onClick={() => {
              const time = document.getElementById("customTime").value;
              handleScheduleFeed(time, 1); // Default 1 day for manual scheduling
            }}
          >
            Schedule Now
          </button>
        </div>
      </div>

      <h3>Auto Feed Times:</h3>
      <div className="auto-feeds">
        {autoFeeds.map((feed, index) => (
          <div key={index} className="feed-item">
             <span>{feed.time}</span>

            {/* ✅ New Input for Scheduling Days */}
            <input
              type="number"
              value={feed.days}
              onChange={(e) => handleDaysChange(index, Number(e.target.value))}
              className="days-input"
            />
            <button
              className="schedule-btn"
              onClick={() => handleScheduleFeed(feed.time, feed.days)}
            >
              Set Days
            </button>
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

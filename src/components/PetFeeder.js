import React, { useState } from "react";
import "./PetFeeder.scss";

const PetFeeder = () => {
  // 🟢 State Variables
  const [autoFeeds, setAutoFeeds] = useState([
    { time: "7:00 AM", enabled: true },
    { time: "12:00 PM", enabled: true },
    { time: "6:00 PM", enabled: true },
  ]);

  const [dogSize, setDogSize] = useState("Small");
  const [feedTime, setFeedTime] = useState("");
  const [loading, setLoading] = useState(false); // Prevent multiple clicks

  const apiUrl = "http://192.168.0.117"; // Match Arduino's static IP

  // 🟢 Update Dog Size
  const updateDogSize = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/update-size`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: dogSize }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error updating size:", error);
      alert("❌ Error connecting to feeder");
    }
    setLoading(false);
  };

  // 🟢 Feed Now Function
  const handleFeedNow = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/feed-now`, { method: "POST" });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error sending feed request:", error);
      alert("❌ Error connecting to feeder");
    }
    setLoading(false);
  };

  // 🟢 Toggle Auto-Feed
  const toggleAutoFeed = async (index) => {
    const newFeeds = [...autoFeeds];
    newFeeds[index].enabled = !newFeeds[index].enabled;
    setAutoFeeds(newFeeds);

    try {
      const scheduleData = {
        "7AM": newFeeds[0].enabled,
        "12PM": newFeeds[1].enabled,
        "6PM": newFeeds[2].enabled,
      };

      const response = await fetch(`${apiUrl}/auto-feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });

      const data = await response.json();
      if (data.status !== "success") {
        alert("❌ Failed to update feed schedule");
      }
    } catch (error) {
      console.error("Error toggling feed:", error);
      alert("❌ Error connecting to feeder");
    }
  };

  // 🟢 Schedule a Custom Feed Time
  const updateSchedule = async () => {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;

    if (!timeRegex.test(feedTime)) {
      alert("⏰ Enter a valid time in HH:MM AM/PM format (e.g., 07:30 AM).");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/schedule-feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time: feedTime }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error scheduling feeding:", error);
      alert("❌ Error connecting to feeder");
    }
    setLoading(false);
  };

  return (
    <div className="pet-feeder">
      <h3>Schedule Feeding</h3>

      {/* 🟢 Dog Size Selection */}
      <div className="top-section">
        <div className="dog-size-selection">
          <label>Dog Size:</label>
          <select value={dogSize} onChange={(e) => setDogSize(e.target.value)}>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
          <button className="update-btn" onClick={updateDogSize} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

        {/* 🟢 Schedule Custom Feeding Time */}
        <div className="schedule">
          <input
            type="text"
            placeholder="HH:MM AM/PM"
            value={feedTime}
            onChange={(e) => setFeedTime(e.target.value)}
          />
          <button className="feed-btn" onClick={updateSchedule} disabled={loading}>
            {loading ? "Updating..." : "Update Schedule"}
          </button>
        </div>
      </div>

      {/* 🟢 Auto Feed Times */}
      <h3>Auto Feed Times:</h3>
      <div className="auto-feeds">
        {autoFeeds.map((feed, index) => (
          <div key={index} className="feed-item">
            <span>{feed.time}</span>
            <button
              className={feed.enabled ? "on-btn" : "off-btn"}
              onClick={() => toggleAutoFeed(index)}
            >
              {feed.enabled ? "ON" : "OFF"}
            </button>
          </div>
        ))}
      </div>

      {/* 🟢 Feed Now Button */}
      <button className="feed-now-btn" onClick={handleFeedNow} disabled={loading}>
        {loading ? "Feeding..." : "Feed Now"}
      </button>
    </div>
  );
};

export default PetFeeder;

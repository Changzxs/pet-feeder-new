import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ScheduleFeeding.scss';

const FeedingSchedule = () => {
  // Load from localStorage if available
  const [autoFeeds, setAutoFeeds] = useState(() => {
    const saved = localStorage.getItem('autoFeeds');
    return saved ? JSON.parse(saved) : [
      { id: 1, time: '7:00 AM', enabled: true },
      { id: 2, time: '12:00 PM', enabled: true },
      { id: 3, time: '6:00 PM', enabled: true }
    ];
  });

  const apiUrl = "http://192.168.0.117"; // Arduino R4 WiFi IP

  // Save to localStorage whenever autoFeeds changes
  useEffect(() => {
    localStorage.setItem('autoFeeds', JSON.stringify(autoFeeds));
  }, [autoFeeds]);

  const toggleAutoFeed = async (id) => {
    const updatedFeeds = autoFeeds.map(feed =>
      feed.id === id ? { ...feed, enabled: !feed.enabled } : feed
    );
    
    // Optimistic UI update
    setAutoFeeds(updatedFeeds);

    try {
      const scheduleData = {
        "7AM": updatedFeeds[0].enabled,
        "12PM": updatedFeeds[1].enabled,
        "6PM": updatedFeeds[2].enabled,
      };

      const response = await fetch(`${apiUrl}/auto-feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.status !== "success") {
        // Revert if API call fails
        setAutoFeeds(autoFeeds);
        alert("❌ Failed to update feed schedule");
      }
    } catch (error) {
      console.error("Error toggling feed:", error);
      // Revert on error
      setAutoFeeds(autoFeeds);
      alert("❌ Error connecting to feeder");
    }
  };

  return (
    <div className="feeding-schedule">
      <h1>Schedule Feeding Time</h1>
      <p className="description">
        Set up regular feeding times for your pet. You can add multiple feeding times throughout the day.
      </p>

      <div className="feeding-container">
        {autoFeeds.map((feed) => (
          <div className="feeding-card" key={feed.id}>
            <div className="card-header">
              <h2>Feeding #{feed.id}</h2>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={feed.enabled}
                  onChange={() => toggleAutoFeed(feed.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="time-display">
              <span>Feeding Time</span>
              <p>{feed.time}</p>
            </div>
          </div>
        ))}

        <div className="divider"></div>

        <div className="button-group">
          <Link to="/dog-sizes" className="primary-button">⬅ Back to Dog Sizes</Link>
          <Link to="/auto-feed-times" className="secondary-button">Continue to auto-Schedule ➡</Link>
        </div>
      </div>
    </div>
  );
};

export default FeedingSchedule;

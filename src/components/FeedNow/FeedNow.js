import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./FeedNow.scss";

const FeedNow = () => {
  const [isFeeding, setIsFeeding] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const apiUrl = "http://192.168.0.117";

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const scheduledFeedings = [
    { time: "7:00 AM", completed: false },
    { time: "12:00 PM", completed: false },
    { time: "6:00 PM", completed: false },
  ];

  // Determine which feedings are completed based on current time
  const updateFeedingsStatus = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    return scheduledFeedings.map(feeding => {
      const [time, period] = feeding.time.split(' ');
      const [feedingHour, feedingMinute] = time.split(':').map(Number);
      let feeding24Hour = period === 'PM' && feedingHour !== 12 ? feedingHour + 12 : feedingHour;
      if (period === 'AM' && feedingHour === 12) feeding24Hour = 0;
      
      const isCompleted = 
        hours > feeding24Hour ||
        (hours === feeding24Hour && minutes >= feedingMinute);
      
      return { ...feeding, completed: isCompleted };
    });
  };

  const updatedFeedings = updateFeedingsStatus();

  const handleFeedNow = async () => {
    setIsFeeding(true);
    try {
      const response = await fetch(`${apiUrl}/feed-now`, { method: "POST" });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error sending feed request:", error);
      alert("❌ Error connecting to feeder");
    }
    setTimeout(() => {
      setIsFeeding(false);
    }, 2000);
  };

  return (
    <div className="feed-now">
      <h1>Feed Now</h1>
      <p className="description">
        Dispense food immediately with one tap. Start feeding your pet right away.
      </p>

      <div className="manual-feeding">
        <h2>Manual Feeding</h2>
        <p className="subtitle">Dispense food immediately!</p>

        <button 
          className={`feed-button ${isFeeding ? 'feeding' : ''}`}
          onClick={handleFeedNow}
          disabled={isFeeding}
        >
          {isFeeding ? 'Feeding...' : 'Feed Now'}
        </button>
      </div>

      <div className="scheduled-feedings">
        <h2>Scheduled Feedings Today</h2>
        <p className="subtitle">Upcoming feeding times</p>

        <div className="feedings-list">
          {updatedFeedings.map((feeding, index) => (
            <div key={index} className={`feeding-item ${feeding.completed ? 'completed' : 'upcoming'}`}>
              <span className="feeding-time">{feeding.time}</span>
              <span className="feeding-status">
                {feeding.completed ? 'Completed' : 'Upcoming'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="button-group navigation-buttons">
        <Link to="/auto-feed-times" className="secondary-button">
        ⬅ Back to Auto Schedule
        </Link>
        <Link to="/camera" className="primary-button">
          Continue to Camera ➡ 
        </Link>
      </div>
    </div>
  );
};

export default FeedNow;
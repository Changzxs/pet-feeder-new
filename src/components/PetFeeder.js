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

  const handleFeedNow = () => {
    alert("Feeding Now! 🐾"); // Replace with actual feeding logic
  };

  const handleDaysChange = (index, newDays) => {
    const newFeeds = [...autoFeeds];
    newFeeds[index].days = newDays;
    setAutoFeeds(newFeeds);
  };

  return (
    <div className="pet-feeder">
      <h3>Schedule Feeding</h3>
      <div className="schedule">
        <input type="time" />
        <input type="number" placeholder="Amount" />
        <button className="feed-btn">Feed Now</button>
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

      {/* ✅ Add the "Feed Now" Button Below */}
      <button className="feed-now-btn" onClick={handleFeedNow}>
        Feed Now
      </button>
    </div>
  );
};

export default PetFeeder;

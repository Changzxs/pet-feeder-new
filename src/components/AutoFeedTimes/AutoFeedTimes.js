import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AutoFeedTimes.scss';

const AutoScheduling = () => {
  const [schedule, setSchedule] = useState([{ time: '08:00 AM' }]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTime, setTempTime] = useState('');
  const [tempPeriod, setTempPeriod] = useState('AM');
  const [loading, setLoading] = useState(false);
  const apiUrl = 'http://192.168.0.117';

  const handleApplySchedule = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const promises = schedule.map((entry) =>
        fetch(`${apiUrl}/schedule-feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ time: entry.time }),
        })
      );

      const results = await Promise.all(promises);
      const allSucceeded = results.every(res => res.ok);

      if (allSucceeded) {
        alert('✅ All times scheduled successfully!');
      } else {
        alert('❌ One or more schedule requests failed.');
      }
    } catch (error) {
      console.error('Error applying schedule:', error);
      alert('❌ Error connecting to feeder');
    }

    setLoading(false);
  };

  const handleTimeEdit = (index) => {
    setEditingIndex(index);
    const [time, period] = schedule[index].time.split(' ');
    setTempTime(time);
    setTempPeriod(period);
  };

  const handleTimeSave = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].time = `${tempTime} ${tempPeriod}`;
    setSchedule(newSchedule);
    setEditingIndex(null);
  };

  const handleAddTime = () => {
    setSchedule([...schedule, { time: '08:00 AM' }]);
  };

  const handleRemoveTime = (index) => {
    const newSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(newSchedule);
  };

  return (
    <div className="auto-scheduling">
      <h1>Auto Scheduling</h1>
      <p className="description">
        Set your preferred feeding time below.
      </p>

      <div className="recommended-schedule">
        <h2>Recommended Schedule</h2>

        <div className="schedule-card">
          <div className="food-amount">
            <h3>Schedule feeder</h3>
            <p className="amount">One time schedule feeder</p>
          </div>

          <div className="feeding-times">
            {schedule.map((meal, index) => (
              <div key={index} className="meal-item">
                {editingIndex === index ? (
                  <div className="time-edit-container">
                    <div className="time-input-group">
                      <input
                        type="text"
                        value={tempTime}
                        onChange={(e) => setTempTime(e.target.value)}
                        placeholder="HH:MM"
                        className="time-input"
                      />
                      <select
                        value={tempPeriod}
                        onChange={(e) => setTempPeriod(e.target.value)}
                        className="ampm-select"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    <button 
                      className="save-btn"
                      onClick={() => handleTimeSave(index)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="time-display">
                    <span className="meal-time">{meal.time}</span>
                    <button 
                      className="edit-btn"
                      onClick={() => handleTimeEdit(index)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleRemoveTime(index)}
                    >
                      ❌
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button className="add-btn" onClick={handleAddTime}>
              ➕ Add Time
            </button>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="apply-btn" 
          onClick={handleApplySchedule}
          disabled={loading}
        >
          {loading ? 'Applying...' : 'Apply This Schedule'}
        </button>
        <div className="action-buttons">
  <div className="secondary-actions">
    <Link to="/schedule-feeding" className="back-btn">
      ⬅ Back to schedule
    </Link>
    <Link to="/feed-now" className="continue-btn">
      Continue to Feed now  ➡
    </Link>
  </div>
        </div>
      </div>
    </div>
  );
};

export default AutoScheduling;

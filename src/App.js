// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/Homepage';
import FeedNow from './components/FeedNow/FeedNow';
import ScheduleFeeding from './components/ScheduleFeeding/ScheduleFeeding';
import AutoFeedTimes from './components/AutoFeedTimes/AutoFeedTimes';
import DogSizes from './components/DogSizes/DogSizes';
import CameraPage from './components/CameraPage/CameraPage';
import NavigationBar from './components/NavigationBar/navigation-bar';
import './App.scss'; // Make sure this import is present

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavigationBar />
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dog-sizes" element={<DogSizes />} />
            <Route path="/schedule-feeding" element={<ScheduleFeeding />} />
            <Route path="/auto-feed-times" element={<AutoFeedTimes />} />
            <Route path="/feed-now" element={<FeedNow />} />
            <Route path="/camera" element={<CameraPage />} />
          </Routes>
        </main>
        {/* You might have a footer here as well */}
      </div>
    </Router>
  );
}

export default App;

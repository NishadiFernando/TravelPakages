import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './MainPage.css'; // Importing CSS
import profileImage from './defaultProfile.jpg'; // Import a default profile image

const MainPage = () => {
  const [requests, setRequests] = useState([
    { id: 1, name: 'John Doe', requestType: 'Tour Guide', status: 'Pending', image: profileImage },
    { id: 2, name: 'Jane Smith', requestType: 'Driver', status: 'Pending', image: profileImage },
    { id: 3, name: 'Michael Johnson', requestType: 'Driver', status: 'Pending', image: profileImage },
  ]);

  const navigate = useNavigate();

  const handleAccept = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: 'Accepted' } : request
      )
    );
  };

  const handleDecline = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: 'Declined' } : request
      )
    );
  };

  const navigateToHomePage = () => {
    navigate('/home');
  };

  const scheduleDriverAppointment = () => {
    navigate('/schedule-driver');
  };

  const scheduleTourGuideAppointment = () => {
    navigate('/schedule-tourguide');
  };

  return (
    <div className="main-page">
      <header className="header">
        <h1>Lucky Car Enterprises</h1>
        <nav className="navbar">
          <a href="#">Dashboard</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
          <a href="#">About Us</a>
        </nav>
      </header>

      <section className="dashboard">
        <h2>Driver & Tour Guide Management Dashboard</h2>
        <p>Manage requests from drivers and tour guides here.</p>
      </section>

      <div className="request-list">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <img src={request.image} alt="Profile" className="profile-image" />
            <h3>{request.name}</h3>
            <p>Request Type: {request.requestType}</p>
            <p>Status: <span className={request.status.toLowerCase()}>{request.status}</span></p>
            {request.status === 'Pending' && (
              <div className="button-group">
                <button onClick={() => handleAccept(request.id)} className="accept-btn">Accept</button>
                <button onClick={() => handleDecline(request.id)} className="decline-btn">Decline</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="schedule-appointment">
        <h3>Schedule an Appointment</h3>
        <div className="button-group">
          <button className="btn schedule-btn" onClick={scheduleDriverAppointment}>
            Schedule for Drivers
          </button>
          <button className="btn schedule-btn" onClick={scheduleTourGuideAppointment}>
            Schedule for Tour Guides
          </button>
        </div>
      </div>

      <button className="btn navigate-btn" onClick={navigateToHomePage}>Add Driver or Tour Guide</button>

      <footer className="footer">
        <p>&copy; 2024 Lucky Car Enterprises. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPage;

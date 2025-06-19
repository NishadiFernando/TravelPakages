import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentsList from './AppointmentsList'; // Import AppointmentsList
import './SchedulePage.css';

const ScheduleDriver = () => {
    const [appointmentDate, setAppointmentDate] = useState('');
    const [driverId, setDriverId] = useState('');
    const [details, setDetails] = useState('');
    const [drivers, setDrivers] = useState([]);

    // Fetch all drivers
    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/todos');
            const driverList = response.data.filter(todo => todo.role === 'driver');
            setDrivers(driverList);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    // Schedule an appointment
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/appointments', {
                todoId: driverId,
                appointmentDate,
                details
            });
            alert('Appointment scheduled successfully!');
        } catch (error) {
            console.error('Error scheduling appointment:', error);
        }
    };

    // Fetch drivers when the component is mounted
    useEffect(() => {
        fetchDrivers();
    }, []);

    return (
        <div className="schedule-page"> {/* Apply the CSS class */}
            <h2 className="schedule-heading">Schedule Driver Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group"> {/* Add form-group class */}
                    <label>Select Driver:</label>
                    <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="form-control"> {/* Add form-control class */}
                        <option value="">Select Driver</option>
                        {drivers.map(driver => (
                            <option key={driver._id} value={driver._id}>{driver.title}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group"> {/* Add form-group class */}
                    <label>Appointment Date:</label>
                    <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="form-control" /> {/* Add form-control class */}
                </div>

                <div className="form-group"> {/* Add form-group class */}
                    <label>Details:</label>
                    <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="form-control" /> {/* Add form-control class */}
                </div>

                <button type="submit" className="schedule-btn">Schedule Appointment</button> {/* Add schedule-btn class */}
            </form>

            {/* Show list of scheduled appointments for the selected driver */}
            {driverId && <AppointmentsList todoId={driverId} />}
        </div>
    );
};

export default ScheduleDriver;

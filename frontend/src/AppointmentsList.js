import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentsList = ({ todoId }) => {
    const [appointments, setAppointments] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [details, setDetails] = useState('');

    // Fetch appointments for a specific driver or tour guide
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/appointments/${todoId}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [todoId]);

    // Update appointment
    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:8000/appointments/${id}`, {
                appointmentDate,
                details
            });
            setEditMode(null);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    // Delete appointment
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/appointments/${id}`);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <div>
            <h3>Appointments</h3>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                appointments.map((appointment) => (
                    <div key={appointment._id}>
                        {editMode === appointment._id ? (
                            <div>
                                <input
                                    type="date"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                />
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                />
                                <button onClick={() => handleUpdate(appointment._id)}>Update</button>
                                <button onClick={() => setEditMode(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>
                                    <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Details:</strong> {appointment.details}
                                </p>
                                <button onClick={() => {
                                    setEditMode(appointment._id);
                                    setAppointmentDate(appointment.appointmentDate);
                                    setDetails(appointment.details);
                                }}>Edit</button>
                                <button onClick={() => handleDelete(appointment._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default AppointmentsList;

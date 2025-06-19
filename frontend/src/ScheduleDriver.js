import React, { useState, useEffect } from "react";
import axios from "axios";
import './ScheduleDriver.css'; // Import the custom CSS file

const ScheduleDriver = () => {
    const [driverId, setDriverId] = useState("");
    const [date, setDate] = useState("");
    const [details, setDetails] = useState(""); // Added details state
    const [drivers, setDrivers] = useState([]);

    // Fetch drivers from API when component mounts
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get("/api/drivers");
                setDrivers(response.data);
            } catch (error) {
                console.error("Error fetching drivers:", error);
            }
        };

        fetchDrivers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/api/schedule", { driverId, date, details }); // Include details in the submission
            alert("Driver scheduled successfully!");
        } catch (error) {
            console.error("Error scheduling driver:", error);
        }
    };

    return (
        <div className="schedule-page">
            <h2>Schedule a Driver</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Driver:</label>
                    <select
                        className="form-control"
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
                    >
                        <option value="">Select a driver</option>
                        {drivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                                {driver.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Schedule Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="form-group"> {/* Add form-group class */}
                    <label>Details:</label>
                    <textarea 
                        value={details} 
                        onChange={(e) => setDetails(e.target.value)} 
                        className="form-control" 
                    /> {/* Add form-control class */}
                </div>

                <button type="submit" className="schedule-btn">
                    Schedule Driver
                </button>
            </form>
        </div>
    );
};

export default ScheduleDriver;

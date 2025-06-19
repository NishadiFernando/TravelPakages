import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../styles/PackageDetails.css';

const PackageDetails = () => {
    const { id } = useParams();
    const [packageData, setPackageData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get-package/${id}`);
                setPackageData(response.data);
            } catch (error) {
                console.error('Error fetching package', error);
            }
        };

        fetchPackage();
    }, [id]);

    const handleEdit = () => {
        navigate(`/edit-package/${id}`);
    };

    if (!packageData) {
        return (
            <div className="loading-container">
                <div className="loading-circle"></div>
                <p className="loading-message">Loading</p>
            </div>
        );
    }

    return (
        <div className="package-details-container" style={{ position: 'relative', top: '-70px' }}>
            <div className="cover-image-section" style={{ backgroundImage: `url(http://localhost:8000${packageData.days[0].image})` }}>
                <div className="image-overlay">
                    <h2 className="pkg-title">{packageData.name}</h2>
                
                    <p className="day-price"> USD {packageData.price}.00</p>
                    
                    
                </div>
            </div>
            
            <div className="package-content">
                {packageData.days.map((day, index) => (
                    <div key={index} className="day-section">
                        <div className="day-content-wrapper">
                            <div className="day-image-container">
                                <img src={`http://localhost:8000${day.image}`} alt={day.title} className="day-image" />
                                <div className="day-image-overlay">
                                    <span className="day-number">Day {day.dayNumber}</span>
                                    <h3 className="day-title">{day.title}</h3>
                                </div>
                            </div>
                            <div className="day-content">
                                <p className="day-description">{day.description}</p>
                                <div className="activities-section">
                                    <h4>Activities</h4>
                                    <ul className="activities-list">
                                        {day.activities.map((activity, idx) => (
                                            <li key={idx}>
                                                <FontAwesomeIcon icon={faCheck} className="check-icon" /> {activity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='btndiv'>
            <button className="edit-button" onClick={handleEdit}>
                <FontAwesomeIcon icon={faEdit} /> Edit Package
            </button>
            </div>
        </div>
    );
};

export default PackageDetails;

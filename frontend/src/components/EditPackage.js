import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/editPackage.css';

const EditPackage = () => {
    const { id } = useParams();
    const [packageData, setPackageData] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [days, setDays] = useState([]);
    const [previewImages, setPreviewImages] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get-package/${id}`);
                setPackageData(response.data);
                setName(response.data.name);
                setPrice(response.data.price || '');
                setDays(response.data.days);
                
                // Set preview images for existing days
                const images = {};
                response.data.days.forEach((day, index) => {
                    if (day.image) {
                        images[index] = `http://localhost:8000${day.image}`; // Adjust this URL as needed
                    }
                });
                setPreviewImages(images);
            } catch (error) {
                console.error('Error fetching package', error);
            }
        };

        fetchPackage();
    }, [id]);

    const handleDayChange = (index, field, value) => {
        const newDays = [...days];
        newDays[index][field] = value;
        setDays(newDays);
    };

    const handleActivityChange = (dayIndex, activityIndex, value) => {
        const newDays = [...days];
        newDays[dayIndex].activities[activityIndex] = value;
        setDays(newDays);
    };

    const handleAddActivity = (dayIndex) => {
        const newDays = [...days];
        newDays[dayIndex].activities.push('');
        setDays(newDays);
    };

    const handleRemoveActivity = (dayIndex, activityIndex) => {
        const newDays = [...days];
        newDays[dayIndex].activities = newDays[dayIndex].activities.filter((_, i) => i !== activityIndex);
        setDays(newDays);
    };

    const handleAddDay = () => {
        setDays([...days, { title: '', description: '', activities: [], image: null }]);
    };

    const handleRemoveDay = (index) => {
        const newDays = days.filter((_, i) => i !== index);
        setDays(newDays);
        const newPreviewImages = { ...previewImages };
        delete newPreviewImages[index];
        setPreviewImages(newPreviewImages);
    };

    const handleFileChange = (event, dayIndex) => {
        const file = event.target.files[0];
        if (file) {
            const newDays = [...days];
            newDays[dayIndex].image = file;
            setDays(newDays);

            // Create a preview URL for the new file
            const previewUrl = URL.createObjectURL(file);
            setPreviewImages(prev => ({
                ...prev,
                [dayIndex]: previewUrl
            }));
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
    
            days.forEach((day, dayIndex) => {
                formData.append(`days[${dayIndex}][title]`, day.title);
                formData.append(`days[${dayIndex}][description]`, day.description);
                day.activities.forEach((activity, activityIndex) => {
                    formData.append(`days[${dayIndex}][activities][${activityIndex}]`, activity);
                });
    
                if (day.image instanceof File) {
                    formData.append(`days[${dayIndex}][image]`, day.image);
                } else if (day.image && typeof day.image === 'string') {
                    formData.append(`days[${dayIndex}][existingImage]`, day.image);
                }
            });

            await axios.put(`http://localhost:8000/api/edit-package/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            toast.success('Package updated successfully!', {
                onClose: () => navigate(`/view`)
            });
        } catch (error) {
            console.error('Error updating package', error);
            toast.error('Failed to update package.');
        }
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
        <div className="edit-package">
            <ToastContainer />
            <h1>Edit Package</h1>
            <div className="form-container">
                <div className="left-side">
                    <div className="input-group">
                        <label>Package Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter package name"
                        />
                    </div>
                    <div className="input-group">
                        <label>Price:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter package price"
                        />
                    </div>
                    {days.map((day, dayIndex) => (
                        <div key={dayIndex}>
                            <h2>Day {dayIndex + 1}</h2>
                            <div className="input-group">
                                <label>Title:</label>
                                <input
                                    type="text"
                                    value={day.title}
                                    onChange={(e) => handleDayChange(dayIndex, 'title', e.target.value)}
                                    placeholder="Enter day title"
                                />
                            </div>
                            <div className="input-group">
                                <label>Description:</label>
                                <textarea
                                    value={day.description}
                                    onChange={(e) => handleDayChange(dayIndex, 'description', e.target.value)}
                                    placeholder="Enter day description"
                                />
                            </div>
                            <div className="input-group">
                                <label>Activities:</label>
                                {day.activities.map((activity, activityIndex) => (
                                    <div key={activityIndex} className="activity-input">
                                        <input
                                            type="text"
                                            value={activity}
                                            onChange={(e) => handleActivityChange(dayIndex, activityIndex, e.target.value)}
                                            placeholder="Enter activity"
                                            className='input-type'
                                        />
                                        <button className="AddActivity" onClick={() => handleRemoveActivity(dayIndex, activityIndex)}>Remove</button>
                                    </div>
                                ))}
                                <button className="AddActivity" onClick={() => handleAddActivity(dayIndex)}>Add Activity</button>
                            </div>
                            <button className="Removeday" onClick={() => handleRemoveDay(dayIndex)}>Remove Day</button>
                        </div>
                    ))}
                </div>
                <div className="right-side">
                    {days.map((day, dayIndex) => (
                        <div className="image-upload-container" key={dayIndex}>
                            <label htmlFor={`file-upload-${dayIndex}`} style={{ cursor: 'pointer' }}>
                                Click or drag to upload image for Day {dayIndex + 1} (JPEG only)
                                <input
                                    id={`file-upload-${dayIndex}`}
                                    type="file"
                                    accept="image/jpeg"
                                    onChange={(e) => handleFileChange(e, dayIndex)}
                                    style={{ display: 'none' }} // Hide the input itself
                                />
                            </label>
                            {previewImages[dayIndex] && (
                                <img 
                                    src={previewImages[dayIndex]} 
                                    alt={`Day ${dayIndex + 1}`} 
                                    style={{ maxWidth: '100%', marginTop: '10px' }}
                                />
                            )}
                        </div>
                    ))}
                    <button className="addDay" onClick={handleAddDay}>Add Another Day</button>
                    <button className="submit" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditPackage;

import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../styles/pkgcreate.css';

const CreatePackage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [days, setDays] = useState([{ title: '', description: '', activities: [''], image: null }]);
    const navigate = useNavigate(); // Initialize navigate hook

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

    const addActivity = (dayIndex) => {
        const newDays = [...days];
        if (newDays[dayIndex].activities.length < 5) {
            newDays[dayIndex].activities.push('');
            setDays(newDays);
        } else {
            toast.warning('A maximum of 5 activities is allowed.');
        }
    };

    const removeActivity = (dayIndex, activityIndex) => {
        const newDays = [...days];
        newDays[dayIndex].activities.splice(activityIndex, 1);
        setDays(newDays);
    };

    const handleImageChange = (index, file) => {
        const allowedExtensions = ['image/jpeg', 'image/jpg'];
        if (!allowedExtensions.includes(file.type)) {
            toast.error('Only JPG and JPEG formats are allowed.');
            return;
        }
        const newDays = [...days];
        newDays[index].image = file;
        setDays(newDays);
    };

    const addDay = () => {
        setDays([...days, { title: '', description: '', activities: [''], image: null }]);
    };

    const removeDay = (index) => {
        const newDays = [...days];
        newDays.splice(index, 1);
        setDays(newDays);
    };

    const validateForm = () => {
        if (name.length > 20) {
            toast.error('Package name must be 20 characters or less.');
            return false;
        }

        if (!/^\d+$/.test(price) || parseFloat(price) <= 0) {
            toast.error('Price must be a positive number.');
            return false;
        }

        for (const day of days) {
            const wordCount = day.description.split(/\s+/).length;
            if (wordCount < 30) {
                toast.error('Description must be at least 50 words.');
                return false;
            }

            if (day.activities.length > 5) {
                toast.error('A maximum of 5 activities is allowed.');
                return false;
            }

            if (!day.image) {
                toast.error('An image is required for each day.');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        days.forEach((day, index) => {
            formData.append(`days[${index}][title]`, day.title);
            formData.append(`days[${index}][description]`, day.description);
            day.activities.forEach((activity, activityIndex) => {
                formData.append(`days[${index}][activities][${activityIndex}]`, activity);
            });
            if (day.image) {
                formData.append(`images`, day.image);
            }
        });

        try {
            const response = await axios.post('http://localhost:8000/api/create-package', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Package created successfully!', {
                onClose: () => navigate('/view'), // Redirect after toast closes
            });
        } catch (error) {
            console.error('Error creating package', error);
            toast.error('Failed to create package.');
        }
    };

    return (
        <div className="maindiv">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="form-container">
                <div className="left-column">
                    <h2 className="titleclass">Create Package</h2>
                    <div className="packagenamediv">
                        <label>Package Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input"
                            placeholder="Enter package name"
                        />
                    </div>
                    <div className="packagenamediv">
                        <label>Price:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="input"
                            placeholder="Enter package price"
                            min="0"
                        />
                    </div>
                    {days.map((day, dayIndex) => (
                        <div key={dayIndex} className="days">
                            <h3>Day {dayIndex + 1}</h3>
                            <div className="packagenamediv">
                                <label>Title:</label>
                                <input
                                    type="text"
                                    value={day.title}
                                    onChange={(e) => handleDayChange(dayIndex, 'title', e.target.value)}
                                    required
                                    className="input"
                                    placeholder="Enter day title"
                                />
                            </div>
                            <div className="packagenamediv">
                                <label>Description:</label>
                                <textarea
                                    value={day.description}
                                    onChange={(e) => handleDayChange(dayIndex, 'description', e.target.value)}
                                    required
                                    className="input"
                                    placeholder="Enter day description"
                                />
                            </div>
                            <div className="packagenamediv">
                                <label>Activities:</label>
                                {day.activities.map((activity, activityIndex) => (
                                    <div key={activityIndex} className="activity-input" >
                                        <input
                                            type="text"
                                            value={activity}
                                            onChange={(e) => handleActivityChange(dayIndex, activityIndex, e.target.value)}
                                            required
                                            className="input"
                                            placeholder="Enter activity"
                                        />
                                        {day.activities.length > 1 && (
                                            <button type="button" onClick={() => removeActivity(dayIndex, activityIndex)} className="RemoveActivity">
                                                Remove Activity
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addActivity(dayIndex)} className="AddActivity">
                                    Add Another Activity
                                </button>
                            </div>
                            {days.length > 1 && (
                                <button type="button" onClick={() => removeDay(dayIndex)} className="RemoveActivity">
                                    Remove Day
                                </button>
                            )}
                        </div>
                    ))}
                    
                </div>
                <div className="right-column">
                    {days.map((day, dayIndex) => (
                        <div key={dayIndex} className="image-upload">
                            <label htmlFor={`file-input-${dayIndex}`}>
                                {day.image ? (
                                    <img src={URL.createObjectURL(day.image)} alt={`Day ${dayIndex + 1}`} />
                                ) : (
                                    <p className="upload-text">Click or drag to upload image for Day {dayIndex + 1} <br></br>(JPEG only)</p>
                                )}
                            </label>
                            <input
                                id={`file-input-${dayIndex}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(dayIndex, e.target.files[0])}
                                required
                            />
                        </div>
                    ))}
                    <div className="button-container">
                        <button type="button" onClick={addDay} className="addDay">Add Another Day</button>
                        <button type="submit" className="submit">Create Package</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePackage;

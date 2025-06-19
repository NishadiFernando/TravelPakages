import React, { useEffect, useState } from 'react';
import './TodosPage.css';

export default function TodosPage() {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [editingTodo, setEditingTodo] = useState(null);
    const [updatedTodo, setUpdatedTodo] = useState({
        title: '',
        description: '',
        email: '',
        dob: '',
        contactNumber: '',
        nic: '',
        role: '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    const apiUrl = "http://localhost:8000";

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            })
            .catch(() => {
                setError("Error fetching data");
            });
    };

    const handleDelete = (id) => {
        fetch(apiUrl + `/todos/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.ok) {
                    setTodos(todos.filter(todo => todo._id !== id));
                } else {
                    setError("Error deleting item");
                }
            })
            .catch(() => setError("Error deleting item"));
    };

    const handleEdit = (todo) => {
        setEditingTodo(todo._id);
        setUpdatedTodo({
            title: todo.title,
            description: todo.description,
            email: todo.email,
            dob: new Date(todo.dob).toISOString().substr(0, 10),
            contactNumber: todo.contactNumber,
            nic: todo.nic || '',
            role: todo.role,
        });
    };

    const handleUpdate = (id) => {
        fetch(apiUrl + `/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTodo),
        })
            .then((res) => {
                if (res.ok) {
                    setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
                    setEditingTodo(null);
                } else {
                    setError("Error updating item");
                }
            })
            .catch(() => setError("Error updating item"));
    };

    const generateReport = () => {
        const csvData = filteredTodos.map(todo => ({
            Title: todo.title,
            Description: todo.description,
            Email: todo.email,
            DOB: new Date(todo.dob).toLocaleDateString(),
            Contact: todo.contactNumber,
            NIC: todo.nic,
            Role: todo.role
        }));

        const csvRows = [
            Object.keys(csvData[0]).join(','), 
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'todos_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="todos-container fade-in">
            <h1 className="title">All Entries</h1>
            {error && <p className="error-message">{error}</p>}
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control mb-3"
            />
            <button className="btn btn-primary mb-3" onClick={generateReport}>Generate Report</button>
            <ul className="todos-list">
                {filteredTodos.map((item) =>
                    <li key={item._id} className="todo-item shadow-sm">
                        {editingTodo === item._id ? (
                            <div className="edit-form">
                                <input 
                                    type="text" 
                                    value={updatedTodo.title} 
                                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, title: e.target.value })}
                                    className="form-control mb-2"
                                />
                                <textarea 
                                    value={updatedTodo.description} 
                                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, description: e.target.value })} 
                                    className="form-control mb-2"
                                />
                                <input 
                                    type="email" 
                                    value={updatedTodo.email} 
                                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, email: e.target.value })} 
                                    className="form-control mb-2"
                                />
                                <input 
                                    type="date" 
                                    value={updatedTodo.dob} 
                                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, dob: e.target.value })}
                                    className="form-control mb-2"
                                />
                                <input 
                                    type="text" 
                                    value={updatedTodo.contactNumber} 
                                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, contactNumber: e.target.value })}
                                    className="form-control mb-2"
                                />
                                <input 
                                    type="text" 
                                    value={updatedTodo.nic} 
                                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, nic: e.target.value })}
                                    className="form-control mb-2"
                                    placeholder="NIC Number"
                                />
                                <select
                                    value={updatedTodo.role}
                                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, role: e.target.value })}
                                    className="form-select mb-2"
                                >
                                    <option value="driver">Driver</option>
                                    <option value="tour guide">Tour Guide</option>
                                </select>
                                <button className="btn btn-success me-2" onClick={() => handleUpdate(item._id)}>Save</button>
                                <button className="btn btn-secondary" onClick={() => setEditingTodo(null)}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                <h5 className="todo-title">{item.title}</h5>
                                <p className="todo-description">{item.description}</p>
                                <div className="todo-details">
                                    <p>Email: <span>{item.email}</span></p>
                                    <p>DOB: <span>{new Date(item.dob).toLocaleDateString()}</span></p>
                                    <p>Contact: <span>{item.contactNumber}</span></p>
                                    <p>NIC: <span>{item.nic}</span></p>
                                    <p>Role: <span>{item.role}</span></p>
                                </div>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                            </>
                        )}
                    </li>
                )}
            </ul>
        </div>
    );
}

import React, { useState } from 'react';
import '../styles/login.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hardcoded email and password for demonstration purposes
  const correctEmail = 'user@gmail.com';
  const correctPassword = 'user123';
  
  const adminEmail = 'admin@gmail.com'; // Admin email for role-based access
  const adminPassword = 'admin123'; // Hardcoded admin password for demonstration purposes

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === correctEmail && password === correctPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'user'); // Set user role
      window.location.href = '/view'; // Redirect to the main page after login
    } else if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'admin'); // Set admin role
      window.location.href = '/admin-pkgview'; // Redirect to admin dashboard after login
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container">
      <form className="loginForm" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>} {/* Apply error class here */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import './App.css';

const Form = () => {
    const [email, setEmail] = useState('');
    const [passNumber, setPassNumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/mark-visited', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, passNumber }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Success! You can now take your seat.');
                setError('');
            } else {
                setMessage('');
                setError(data.error || 'An error occurred.');
            }
        } catch (error) {
            setMessage('');
            setError('Failed to connect to the server. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form">
                <h2>Techniche '24 Comedy Night Entry</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="passNumber">Pass Number</label>
                    <input
                        type="text"
                        id="passNumber"
                        value={passNumber}
                        onChange={(e) => setPassNumber(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Submit</button>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Form;

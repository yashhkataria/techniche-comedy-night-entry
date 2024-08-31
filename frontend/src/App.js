import React, { useState } from 'react';
import './App.css';

const Form = () => {
    const [email, setEmail] = useState('');
    const [passNumber, setPassNumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const response = await fetch('https://techniche-comedy-night-entry-api.vercel.app/api/mark-visited', {
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
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form">
                <h2>Techniche '24 Comedy Night Entry</h2>
                <div className="form-group">
                    <label htmlFor="email">Outlook Email (including iitg.ac.in)</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="passNumber">Pass Number (as received on mail)</label>
                    <input
                        type="text"
                        id="passNumber"
                        value={passNumber}
                        onChange={(e) => setPassNumber(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}> {/* Disable button while loading */}
                    {loading ? 'Loading...' : 'Submit'}
                </button>
                {loading && <div className="loader"></div>} {/* Loader element */}
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Form;

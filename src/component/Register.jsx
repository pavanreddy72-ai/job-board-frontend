import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '', email: '', password: '', password2: '',
        role: 'seeker', company_name: '', phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (form.password !== form.password2) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await API.post('/register/', form);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const messages = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
                setError(messages);
            } else {
                setError('Registration failed. Try again.');
            }
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>Create Account</h2>
                {error && <pre style={styles.error}>{error}</pre>}
                <input style={styles.input} name="username" placeholder="Username" onChange={handleChange} />
                <input style={styles.input} name="email" placeholder="Email" type="email" onChange={handleChange} />
                <input style={styles.input} name="phone" placeholder="Phone (optional)" onChange={handleChange} />
                <select style={styles.input} name="role" onChange={handleChange}>
                    <option value="seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                </select>
                {form.role === 'employer' && (
                    <input style={styles.input} name="company_name" placeholder="Company Name" onChange={handleChange} />
                )}
                <input style={styles.input} name="password" placeholder="Password (min 8 chars, 1 uppercase, 1 number)" type="password" onChange={handleChange} />
                <input style={styles.input} name="password2" placeholder="Confirm Password" type="password" onChange={handleChange} />
                <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <p style={styles.text}>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' },
    box: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', color: '#1a1a2e', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
    error: { color: 'red', fontSize: '13px', marginBottom: '10px', whiteSpace: 'pre-wrap' },
    text: { textAlign: 'center', marginTop: '15px' },
};

export default Register;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/login/', form);
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('username', res.data.username);
            if (res.data.role === 'employer') navigate('/employer/dashboard');
            else navigate('/jobs');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>Login</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input style={styles.input} name="username" placeholder="Username" onChange={handleChange} />
                <input style={styles.input} name="password" placeholder="Password" type="password" onChange={handleChange} />
                <button style={styles.btn} onClick={handleSubmit}>Login</button>
                <p style={styles.text}>Don't have an account? <Link to="/register">Register</Link></p>
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
    error: { color: 'red', fontSize: '13px', marginBottom: '10px' },
    text: { textAlign: 'center', marginTop: '15px' },
};

export default Login;
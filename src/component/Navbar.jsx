import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.brand}>JobBoard</Link>
            <div style={styles.links}>
                <Link to="/jobs" style={styles.link}>Jobs</Link>
                {role === 'employer' && <Link to="/employer/dashboard" style={styles.link}>Dashboard</Link>}
                {role === 'seeker' && <Link to="/seeker/dashboard" style={styles.link}>My Applications</Link>}
                {username ? (
                    <>
                        <span style={styles.username}>Hi, {username}</span>
                        <button onClick={handleLogout} style={styles.btn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#1a1a2e', color: 'white' },
    brand: { color: '#e94560', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none' },
    links: { display: 'flex', alignItems: 'center', gap: '20px' },
    link: { color: 'white', textDecoration: 'none' },
    username: { color: '#e94560' },
    btn: { backgroundColor: '#e94560', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' },
};

export default Navbar;
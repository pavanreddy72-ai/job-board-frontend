import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const SeekerDashboard = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        API.get('/applications/my/').then(res => setApplications(res.data)).catch(console.error);
    }, []);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>My Applications</h2>
            {applications.length === 0 && <p>You haven't applied to any jobs yet.</p>}
            {applications.map(app => (
                <div key={app.id} style={styles.card}>
                    <h3 style={styles.jobTitle}>{app.job_title}</h3>
                    <p style={styles.info}>Cover Letter: {app.cover_letter}</p>
                    <p style={styles.status}>Status: <span style={getStatusStyle(app.status)}>{app.status.toUpperCase()}</span></p>
                    <p style={styles.info}>Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

const getStatusStyle = (status) => ({
    color: status === 'accepted' ? 'green' : status === 'rejected' ? 'red' : status === 'reviewed' ? 'orange' : '#666',
    fontWeight: 'bold',
});

const styles = {
    container: { padding: '30px', maxWidth: '800px', margin: '0 auto' },
    title: { color: '#1a1a2e', marginBottom: '20px' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '15px' },
    jobTitle: { color: '#1a1a2e', marginBottom: '10px' },
    info: { color: '#666', marginBottom: '5px' },
    status: { marginBottom: '5px' },
};

export default SeekerDashboard;
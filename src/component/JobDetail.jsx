import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [message, setMessage] = useState('');
    const role = localStorage.getItem('role');

    useEffect(() => {
        API.get(`/jobs/${id}/`).then(res => setJob(res.data)).catch(console.error);
    }, [id]);

    const handleApply = async () => {
        try {
            await API.post('/applications/', { job: id, cover_letter: coverLetter });
            setMessage('Applied successfully!');
        } catch (err) {
            setMessage('Error applying. You may have already applied.');
        }
    };

    if (!job) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>{job.title}</h2>
                <p style={styles.company}>🏢 {job.company}</p>
                <p style={styles.info}>📍 {job.location}</p>
                <p style={styles.info}>💼 {job.job_type.replace('_', ' ')}</p>
                <p style={styles.info}>💰 {job.salary || 'Not specified'}</p>
                <h3 style={styles.section}>Job Description</h3>
                <p style={styles.text}>{job.description}</p>
                <h3 style={styles.section}>Requirements</h3>
                <p style={styles.text}>{job.requirements}</p>
                {role === 'seeker' && (
                    <div style={styles.applySection}>
                        <h3 style={styles.section}>Apply Now</h3>
                        <textarea
                            style={styles.textarea}
                            placeholder="Write your cover letter..."
                            onChange={(e) => setCoverLetter(e.target.value)}
                        />
                        <button style={styles.btn} onClick={handleApply}>Submit Application</button>
                        {message && <p style={styles.message}>{message}</p>}
                    </div>
                )}
                <button style={styles.backBtn} onClick={() => navigate('/jobs')}>← Back to Jobs</button>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '30px', maxWidth: '800px', margin: '0 auto' },
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    title: { color: '#1a1a2e', marginBottom: '10px' },
    company: { color: '#e94560', fontWeight: 'bold', marginBottom: '5px' },
    info: { color: '#666', marginBottom: '5px' },
    section: { color: '#1a1a2e', marginTop: '20px', borderBottom: '2px solid #e94560', paddingBottom: '5px' },
    text: { color: '#444', lineHeight: '1.6' },
    applySection: { marginTop: '20px' },
    textarea: { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', height: '150px', boxSizing: 'border-box' },
    btn: { marginTop: '10px', padding: '12px 30px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    message: { color: 'green', marginTop: '10px' },
    backBtn: { marginTop: '20px', padding: '10px 20px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
};

export default JobDetail;
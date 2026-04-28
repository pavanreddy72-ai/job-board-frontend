import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState({});
    const [form, setForm] = useState({ title: '', company: '', location: '', job_type: 'full_time', description: '', requirements: '', salary: '' });
    const [message, setMessage] = useState('');

    const fetchJobs = async () => {
        const res = await API.get('/jobs/my/');
        setJobs(res.data);
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handlePostJob = async () => {
        try {
            await API.post('/jobs/', form);
            setMessage('Job posted successfully!');
            fetchJobs();
        } catch (err) {
            setMessage('Error posting job.');
        }
    };

    const fetchApplications = async (jobId) => {
        const res = await API.get(`/jobs/${jobId}/applications/`);
        setApplications(prev => ({ ...prev, [jobId]: res.data }));
    };

    const updateStatus = async (appId, status) => {
        await API.patch(`/applications/${appId}/status/`, { status });
        alert('Status updated!');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Employer Dashboard</h2>
            <div style={styles.card}>
                <h3 style={styles.section}>Post a New Job</h3>
                <input style={styles.input} name="title" placeholder="Job Title" onChange={handleChange} />
                <input style={styles.input} name="company" placeholder="Company Name" onChange={handleChange} />
                <input style={styles.input} name="location" placeholder="Location" onChange={handleChange} />
                <select style={styles.input} name="job_type" onChange={handleChange}>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                </select>
                <input style={styles.input} name="salary" placeholder="Salary (e.g. 5-8 LPA)" onChange={handleChange} />
                <textarea style={styles.textarea} name="description" placeholder="Job Description" onChange={handleChange} />
                <textarea style={styles.textarea} name="requirements" placeholder="Requirements" onChange={handleChange} />
                <button style={styles.btn} onClick={handlePostJob}>Post Job</button>
                {message && <p style={styles.message}>{message}</p>}
            </div>
            <h3 style={styles.section}>My Posted Jobs</h3>
            {jobs.map(job => (
                <div key={job.id} style={styles.jobCard}>
                    <h4>{job.title} — {job.company}</h4>
                    <p>{job.location} | {job.job_type}</p>
                    <button style={styles.smallBtn} onClick={() => fetchApplications(job.id)}>View Applications</button>
                    {applications[job.id] && (
                        <div style={styles.appList}>
                            {applications[job.id].length === 0 && <p>No applications yet.</p>}
                            {applications[job.id].map(app => (
                                <div key={app.id} style={styles.appCard}>
                                    <p><strong>{app.applicant_name}</strong></p>
                                    <p>{app.cover_letter}</p>
                                    <p>Status: <strong>{app.status}</strong></p>
                                    <select onChange={(e) => updateStatus(app.id, e.target.value)} defaultValue={app.status}>
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const styles = {
    container: { padding: '30px', maxWidth: '900px', margin: '0 auto' },
    title: { color: '#1a1a2e', marginBottom: '20px' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' },
    section: { color: '#1a1a2e', borderBottom: '2px solid #e94560', paddingBottom: '5px', marginBottom: '15px' },
    input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '5px', border: '1px solid #ddd', height: '100px', boxSizing: 'border-box' },
    btn: { padding: '12px 30px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    smallBtn: { padding: '8px 16px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' },
    message: { color: 'green', marginTop: '10px' },
    jobCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '15px' },
    appList: { marginTop: '15px' },
    appCard: { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '10px' },
};

export default EmployerDashboard;
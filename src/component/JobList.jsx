import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const JOB_SUGGESTIONS = [
    'React Developer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Developer', 'Django Developer', 'Python Developer',
    'Java Developer', 'Web Developer', 'Software Developer',
    'UI/UX Designer', 'Data Analyst', 'DevOps Engineer',
    'Android Developer', 'iOS Developer', 'Machine Learning Engineer',
    'Node.js Developer', 'Flutter Developer', 'Cloud Engineer',
    'QA Engineer', 'Data Engineer', 'Blockchain Developer',
];

const LOCATION_SUGGESTIONS = [
    'Bangalore', 'Hyderabad', 'Chennai', 'Mumbai', 'Delhi',
    'Pune', 'Noida', 'Gurgaon', 'Kolkata', 'Ahmedabad', 'Remote',
];

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchJobs = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await API.get(`/jobs/?search=${search}&location=${location}&job_type=${jobType}&page=${page}`);
            setJobs(res.data.results);
            setTotalJobs(res.data.count);
            setTotalPages(Math.ceil(res.data.count / 6));
            setCurrentPage(page);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }, [search, location, jobType]);

    useEffect(() => { fetchJobs(1); }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        setSearchSuggestions(val.length > 0
            ? JOB_SUGGESTIONS.filter(s => s.toLowerCase().includes(val.toLowerCase()))
            : []
        );
    };

    const handleLocationChange = (e) => {
        const val = e.target.value;
        setLocation(val);
        setLocationSuggestions(val.length > 0
            ? LOCATION_SUGGESTIONS.filter(l => l.toLowerCase().includes(val.toLowerCase()))
            : []
        );
    };

    const selectSearch = (val) => { setSearch(val); setSearchSuggestions([]); };
    const selectLocation = (val) => { setLocation(val); setLocationSuggestions([]); };

    const handleSearch = () => { fetchJobs(1); };

    const getJobTypeColor = (type) => {
        const colors = { full_time: '#27ae60', part_time: '#f39c12', internship: '#3498db', remote: '#9b59b6' };
        return colors[type] || '#666';
    };

    return (
        <div style={styles.container}>
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>Find Your Dream Job</h1>
                <p style={styles.heroSub}>{totalJobs} jobs available across India</p>
            </div>

            <div style={styles.filterBox}>
                <div style={styles.autocompleteWrapper}>
                    <input
                        style={styles.input}
                        placeholder="🔍 Search job title..."
                        value={search}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {searchSuggestions.length > 0 && (
                        <div style={styles.dropdown}>
                            {searchSuggestions.map((s, i) => (
                                <div key={i} style={styles.dropdownItem} onClick={() => selectSearch(s)}>🔎 {s}</div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={styles.autocompleteWrapper}>
                    <input
                        style={styles.input}
                        placeholder="📍 Location..."
                        value={location}
                        onChange={handleLocationChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {locationSuggestions.length > 0 && (
                        <div style={styles.dropdown}>
                            {locationSuggestions.map((l, i) => (
                                <div key={i} style={styles.dropdownItem} onClick={() => selectLocation(l)}>📍 {l}</div>
                            ))}
                        </div>
                    )}
                </div>

                <select style={styles.select} onChange={(e) => setJobType(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                </select>

                <button style={styles.btn} onClick={handleSearch}>Search</button>
            </div>

            {loading ? (
                <p style={styles.loading}>Loading jobs...</p>
            ) : (
                <>
                    <div style={styles.grid}>
                        {jobs.map(job => (
                            <div key={job.id} style={styles.card}>
                                <div style={styles.cardTop}>
                                    <span style={{ ...styles.badge, backgroundColor: getJobTypeColor(job.job_type) }}>
                                        {job.job_type.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <h3 style={styles.jobTitle}>{job.title}</h3>
                                <p style={styles.company}>🏢 {job.company}</p>
                                <p style={styles.info}>📍 {job.location}</p>
                                <p style={styles.info}>💰 {job.salary || 'Not specified'}</p>
                                <p style={styles.info}>👤 {job.employer_name}</p>
                                <p style={styles.description}>{job.description.substring(0, 100)}...</p>
                                <button style={styles.applyBtn} onClick={() => navigate(`/jobs/${job.id}`)}>
                                    View Details →
                                </button>
                            </div>
                        ))}
                        {jobs.length === 0 && (
                            <div style={styles.noJobs}>
                                <p>😕 No jobs found. Try different search terms.</p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div style={styles.pagination}>
                            <button
                                style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                                onClick={() => fetchJobs(currentPage - 1)}
                                disabled={currentPage === 1}
                            >← Prev</button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    style={{ ...styles.pageBtn, backgroundColor: currentPage === i + 1 ? '#e94560' : 'white', color: currentPage === i + 1 ? 'white' : '#1a1a2e' }}
                                    onClick={() => fetchJobs(i + 1)}
                                >{i + 1}</button>
                            ))}

                            <button
                                style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1 }}
                                onClick={() => fetchJobs(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '0 0 50px 0', maxWidth: '1200px', margin: '0 auto' },
    hero: { backgroundColor: '#1a1a2e', padding: '50px 30px', textAlign: 'center', marginBottom: '30px' },
    heroTitle: { color: 'white', fontSize: '36px', margin: '0 0 10px 0' },
    heroSub: { color: '#e94560', fontSize: '18px', margin: 0 },
    filterBox: { display: 'flex', gap: '10px', padding: '0 30px', marginBottom: '30px', flexWrap: 'wrap', alignItems: 'flex-start' },
    autocompleteWrapper: { position: 'relative', flex: 2, minWidth: '200px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' },
    select: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minWidth: '150px' },
    dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', zIndex: 100, boxShadow: '0 4px 15px rgba(0,0,0,0.15)', maxHeight: '200px', overflowY: 'auto' },
    dropdownItem: { padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', transition: 'background 0.2s' },
    btn: { padding: '12px 30px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
    loading: { textAlign: 'center', padding: '50px', color: '#666', fontSize: '18px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', padding: '0 30px' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', transition: 'transform 0.2s', border: '1px solid #f0f0f0' },
    cardTop: { marginBottom: '12px' },
    badge: { padding: '4px 12px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: 'bold' },
    jobTitle: { color: '#1a1a2e', marginBottom: '8px', fontSize: '18px' },
    company: { color: '#e94560', fontWeight: 'bold', marginBottom: '5px' },
    info: { color: '#666', marginBottom: '4px', fontSize: '14px' },
    description: { color: '#888', fontSize: '13px', marginTop: '10px', lineHeight: '1.5' },
    applyBtn: { marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    noJobs: { gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#666' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' },
    pageBtn: { padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
};

export default JobList;
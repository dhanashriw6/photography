import React, { useRef, useState } from 'react';
import '../index.css';
import { FiPlus, FiUpload, FiX } from 'react-icons/fi';

const PhotographerPortfolio = ({ onSave, onCancel }) => {
    const portfolioRef = useRef();

    const [bio, setBio]             = useState('');
    const [portfolioFiles, setPortfolioFiles] = useState([]);
    const [videoLinks, setVideoLinks]         = useState(['']);
    const [instagram, setInstagram]   = useState('');
    const [facebook, setFacebook]     = useState('');
    const [telegram, setTelegram]     = useState('');
    const [pinterest, setPinterest]   = useState('');
    const [googleDrive, setGoogleDrive] = useState('');
    const [awards, setAwards]         = useState('');

    /* ── Video Links ── */
    const addVideoLink = () => setVideoLinks(v => [...v, '']);
    const removeVideoLink = (i) => setVideoLinks(v => v.filter((_, idx) => idx !== i));
    const updateVideoLink = (i, val) =>
        setVideoLinks(v => v.map((x, idx) => (idx === i ? val : x)));

    /* ── Portfolio file upload ── */
    const handlePortfolioFiles = (e) => {
        const files = Array.from(e.target.files);
        setPortfolioFiles(prev => [...prev, ...files.map(f => f.name)]);
    };
    const removePortfolioFile = (i) =>
        setPortfolioFiles(prev => prev.filter((_, idx) => idx !== i));

    return (
        <div>
            <h2 style={{
                margin: '0 0 24px', fontSize: '28px', fontWeight: 700,
                color: '#1a1a1a', letterSpacing: '-0.02em',
            }}>
                Portfolio
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Bio / Add About Me */}
                <div className="su-field">
                    <label>Bio / Add About Me</label>
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Add About You"
                        rows={4}
                        style={{ resize: 'vertical', minHeight: '100px' }}
                    />
                </div>

                {/* Portfolio Upload */}
                <div className="su-field">
                    <label>Portfolio Upload</label>
                    <div
                        onClick={() => portfolioRef.current.click()}
                        style={{
                            border: '1.5px solid #d1d5db', borderRadius: '8px',
                            padding: '28px 20px', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: '10px',
                            cursor: 'pointer', background: '#fff', minHeight: '100px',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#f5a623';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.15)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {portfolioFiles.length === 0 ? (
                            <>
                                <FiUpload size={20} color="#bbb" />
                                <p style={{ margin: 0, fontSize: '13px', color: '#aaa', textAlign: 'center' }}>
                                    Click to upload your document (JPG, JPEG, PNG or PDF)
                                </p>
                            </>
                        ) : (
                            <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                {portfolioFiles.map((name, i) => (
                                    <span key={i} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: '#FFF3D6', color: '#1a1a1a',
                                        borderRadius: '6px', padding: '3px 10px',
                                        fontSize: '12px', fontWeight: 600,
                                    }}>
                                        ✓ {name}
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); removePortfolioFile(i); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0, display: 'flex', alignItems: 'center' }}
                                        ><FiX size={12} /></button>
                                    </span>
                                ))}
                                <span style={{ fontSize: '12px', color: '#aaa', alignSelf: 'center' }}>+ click to add more</span>
                            </div>
                        )}
                    </div>
                    <input
                        ref={portfolioRef}
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handlePortfolioFiles}
                    />
                </div>

                {/* Add Video Links */}
                <div className="su-field">
                    <label>Add Video Links</label>
                    {videoLinks.map((link, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: i < videoLinks.length - 1 ? '8px' : 0 }}>
                            <input
                                type="url"
                                value={link}
                                onChange={e => updateVideoLink(i, e.target.value)}
                                placeholder="Add youtube video link"
                                style={{ flex: 1 }}
                            />
                            {i === videoLinks.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={addVideoLink}
                                    style={{
                                        width: '36px', height: '36px', borderRadius: '8px',
                                        background: '#f5a623', border: 'none', color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.18s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    <FiPlus size={18} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => removeVideoLink(i)}
                                    style={{
                                        width: '36px', height: '36px', borderRadius: '8px',
                                        background: '#fee2e2', border: 'none', color: '#ef4444',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.18s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Social Links — 2 column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>

                    <div className="su-field">
                        <label>Add Instagram Profile link</label>
                        <input
                            type="url"
                            value={instagram}
                            onChange={e => setInstagram(e.target.value)}
                            placeholder="www.Instagram.com"
                        />
                    </div>

                    <div className="su-field">
                        <label>Add Facebook Profile Link</label>
                        <input
                            type="url"
                            value={facebook}
                            onChange={e => setFacebook(e.target.value)}
                            placeholder="www.Facebook.com"
                        />
                    </div>

                    <div className="su-field">
                        <label>Add Telegram profile Link</label>
                        <input
                            type="url"
                            value={telegram}
                            onChange={e => setTelegram(e.target.value)}
                            placeholder="johndoe@gmail.com"
                        />
                    </div>

                    <div className="su-field">
                        <label>Add Pinterest Profile link</label>
                        <input
                            type="url"
                            value={pinterest}
                            onChange={e => setPinterest(e.target.value)}
                            placeholder="www.Pintrest.com"
                        />
                    </div>

                </div>

                {/* Google Drive — full width */}
                <div className="su-field">
                    <label>Add Google Drive Link</label>
                    <input
                        type="url"
                        value={googleDrive}
                        onChange={e => setGoogleDrive(e.target.value)}
                        placeholder="www.drive.com"
                    />
                </div>

                {/* Awards — full width */}
                <div className="su-field">
                    <label>Add Awards</label>
                    <input
                        type="text"
                        value={awards}
                        onChange={e => setAwards(e.target.value)}
                        placeholder="lorem"
                    />
                </div>

            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                 <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
                <button
                    type="button"
                    onClick={onSave}
                    className="su-btn-primary"
                    style={{ padding: '11px 32px', borderRadius: '50px' }}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default PhotographerPortfolio;
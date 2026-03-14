import React, { useState, useRef } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiX, FiFile } from 'react-icons/fi';

const KYCVerification = () => {
  const [docType, setDocType] = useState('Aadhaar Card');
  const [files, setFiles] = useState([]);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files).map(f => ({
      name: f.name,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      type: f.type,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).map(f => ({
      name: f.name,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      type: f.type,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  return (
    <ViewsLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">

          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            KYC Verification
          </p>
          <h1 style={{
            fontSize: '32px', fontWeight: 700, color: '#1a1a1a',
            marginBottom: '28px', letterSpacing: '-0.02em',
          }}>
            Complete Your KYC
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Document type select */}
            <div>
              <div className="su-field">
                <label>Please Complete Your KYC</label>
                <select value={docType} onChange={e => { setDocType(e.target.value); setFiles([]); }}>
                  <option>Aadhaar Card</option>
                  <option>PAN Card</option>
                  <option>Passport</option>
                  <option>Driving Licence</option>
                  <option>Voter ID</option>
                </select>
              </div>
              <p className="su-field-hint">This helps build a safer, more trusted space.</p>
            </div>

            {/* Upload area */}
            <div className="su-field">
              <label>Upload {docType}</label>
              <div
                onClick={() => fileRef.current.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                style={{
                  border: '1.5px dashed #d1d5db', borderRadius: '8px',
                  padding: '32px 20px', cursor: 'pointer',
                  background: '#fafafa', minHeight: '120px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'border-color 0.2s, background 0.2s',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.background = '#FFF9EE'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa'; }}
              >
                {files.length === 0 ? (
                  <>
                    <FiUploadCloud size={28} color="#bbb" />
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#888', textAlign: 'center' }}>
                      Click to upload or drag &amp; drop
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#bbb', textAlign: 'center' }}>
                      JPG, JPEG, PNG or PDF — max 5MB
                    </p>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                    {files.map((f, i) => (
                      <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                        {f.url ? (
                          <img
                            src={f.url}
                            alt={f.name}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #f5a623', display: 'block' }}
                          />
                        ) : (
                          <div style={{
                            width: '80px', height: '80px', borderRadius: '8px',
                            border: '2px solid #f5a623', background: '#FFF3D6',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: '4px',
                          }}>
                            <FiFile size={24} color="#f5a623" />
                            <span style={{ fontSize: '9px', color: '#888', textAlign: 'center', padding: '0 4px', wordBreak: 'break-all', lineHeight: 1.3 }}>
                              {f.name.length > 12 ? f.name.slice(0, 10) + '…' : f.name}
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={ev => { ev.stopPropagation(); removeFile(i); }}
                          style={{
                            position: 'absolute', top: '-7px', right: '-7px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: '#ef4444', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 0, color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                          }}
                        >
                          <FiX size={11} />
                        </button>
                      </div>
                    ))}
                    <div style={{
                      width: '80px', height: '80px', border: '2px dashed #f5a623',
                      borderRadius: '8px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#f5a623', fontSize: '26px',
                      background: '#fff', flexShrink: 0,
                    }}>
                      +
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
                style={{ display: 'none' }}
                onChange={handleFiles}
              />
              <p className="su-field-hint">Upload front &amp; back of your {docType} if applicable.</p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
              <button onClick={() => navigate(-1)} className="su-btn-primary-outline">Cancel</button>
              <button onClick={() => navigate('/join-as-photographer/verification-ip')} className="su-btn-primary">Save</button>
            </div>

          </div>
        </div>
      </div>
    </ViewsLayout>
  );
};

export default KYCVerification;
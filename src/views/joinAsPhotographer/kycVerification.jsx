import React, { useState, useRef } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiX, FiFile, FiLoader } from 'react-icons/fi';
import PhotographerLayout from './PhotographerLayout';
import { submitKyc } from '../../services/kyc';
import { getUploadLink, uploadtoAWS } from '../../services/common'; // adjust import path as needed

const KYCVerification = () => {
  const [docType, setDocType] = useState('Aadhaar Card');
  const [documentNo, setDocumentNo] = useState('');
  // Each file entry: { name, url, type, rawFile, key, uploading, uploadError }
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef();
  const navigate = useNavigate();

  const getDocTypeEnum = (type) => {
    switch (type) {
      case 'Aadhaar Card': return 'aadhar';
      // case 'PAN Card': return 'pan';
      // case 'Passport': return 'passport';
      // case 'Driving Licence': return 'driving_license';
      // case 'Voter ID': return 'voter_id';
      default: return 'aadhar';
    }
  };

  /**
   * For each new file:
   * 1. Add it to state immediately with uploading: true
   * 2. Call getUploadLink to get { url, key } (adjust request body per your API contract)
   * 3. PUT the raw file binary to the AWS pre-signed URL
   * 4. Store the key on the file entry; set uploading: false
   */
  const processAndUploadFile = async (f, index) => {
    const tempId = `${Date.now()}-${index}`;

    // Add placeholder entry immediately so user sees progress
    const entry = {
      id: tempId,
      name: f.name,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      type: f.type,
      rawFile: f,
      key: null,
      uploading: true,
      uploadError: null,
    };

    setFiles(prev => [...prev, entry]);

    try {
      // Step 1: Get pre-signed upload link from your backend
      const linkRes = await getUploadLink({
        document_for: 'kyc_document',
        document_type: f.type === 'application/pdf' ? 'pdf' : 'image',
        mimetype: f.type,         // e.g. "image/jpeg", "application/pdf"
        side: index === 0 ? 'front' : 'back',
      });

      const { presignedUrl: awsUploadUrl, key } = linkRes.data.data;

      // Step 2: Upload binary to AWS S3 pre-signed URL
      await fetch(awsUploadUrl, {
        method: 'PUT',
        body: f,
      });

      // Step 3: Mark upload done, store key
      setFiles(prev =>
        prev.map(item =>
          item.id === tempId
            ? { ...item, key, uploading: false }
            : item
        )
      );
    } catch (err) {
      console.error('Upload failed for', f.name, err);
      setFiles(prev =>
        prev.map(item =>
          item.id === tempId
            ? { ...item, uploading: false, uploadError: 'Upload failed' }
            : item
        )
      );
    }
  };

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    newFiles.forEach((f, i) => processAndUploadFile(f, i));
    // Reset input so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    newFiles.forEach((f, i) => processAndUploadFile(f, i));
  };

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!documentNo.trim()) {
      setError('Please enter your document number.');
      return;
    }

    if (files.length === 0) {
      setError('Please upload at least the front side of the document.');
      return;
    }

    const stillUploading = files.some(f => f.uploading);
    if (stillUploading) {
      setError('Please wait for all files to finish uploading.');
      return;
    }

    const hasErrors = files.some(f => f.uploadError);
    if (hasErrors) {
      setError('One or more files failed to upload. Please remove them and try again.');
      return;
    }

    const missingKeys = files.some(f => !f.key);
    if (missingKeys) {
      setError('Some files are missing upload keys. Please re-upload them.');
      return;
    }

    const payload = {
      kyc_doc_type: getDocTypeEnum(docType),
      document_no: documentNo,
      document_keys: files.map((f, i) => ({
        key: f.key,
        side: i === 0 ? 'front' : 'back',
      })),
    };

    try {
      setLoading(true);
      await submitKyc(payload);
      setSuccess('KYC details submitted successfully!');
      setTimeout(() => navigate('/join-as-photographer/verification-ip'), 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to submit KYC. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhotographerLayout>
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

          {error && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#fee2e2', color: '#b91c1c', fontSize: '13px',
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#dcfce7', color: '#15803d', fontSize: '13px',
            }}>
              {success}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Document type */}
            <div className="su-field">
              <label>Please Complete Your KYC</label>
              <select
                value={docType}
                onChange={e => {
                  setDocType(e.target.value);
                  setFiles([]); // clear files when doc type changes
                }}
              >
                <option>Aadhaar Card</option>
                <option>PAN Card</option>
                <option>Passport</option>
                <option>Driving Licence</option>
                <option>Voter ID</option>
              </select>
            </div>

            {/* Document Number */}
            <div className="su-field">
              <label>Document Number</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="text"
                  value={documentNo}
                  onChange={e => setDocumentNo(e.target.value)}
                  placeholder="Enter Document Number"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <p className="su-field-hint" style={{ marginTop: '-15px' }}>This helps build a safer, more trusted space.</p>

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
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#f5a623';
                  e.currentTarget.style.background = '#FFF9EE';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.background = '#fafafa';
                }}
              >
                {files.length === 0 ? (
                  <>
                    <FiUploadCloud size={28} color="#bbb" />
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#888', textAlign: 'center' }}>
                      Click to upload or drag &amp; drop
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#bbb', textAlign: 'center' }}>
                     Upload front &amp; back image of your {docType}
                    </p>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                    {files.map((f) => (
                      <div key={f.id} style={{ position: 'relative', flexShrink: 0 }}>
                        {/* Thumbnail */}
                        {f.url ? (
                          <img
                            src={f.url}
                            alt={f.name}
                            style={{
                              width: '80px', height: '80px', objectFit: 'cover',
                              borderRadius: '8px',
                              border: f.uploadError ? '2px solid #ef4444' : '2px solid #f5a623',
                              display: 'block',
                              opacity: f.uploading ? 0.5 : 1,
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '80px', height: '80px', borderRadius: '8px',
                            border: f.uploadError ? '2px solid #ef4444' : '2px solid #f5a623',
                            background: '#FFF3D6',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: '4px',
                            opacity: f.uploading ? 0.5 : 1,
                          }}>
                            <FiFile size={24} color="#f5a623" />
                            <span style={{ fontSize: '9px', color: '#888', textAlign: 'center', padding: '0 4px', wordBreak: 'break-all', lineHeight: 1.3 }}>
                              {f.name.length > 12 ? f.name.slice(0, 10) + '…' : f.name}
                            </span>
                          </div>
                        )}

                        {/* Uploading spinner overlay */}
                        {f.uploading && (
                          <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '8px', background: 'rgba(255,255,255,0.6)',
                          }}>
                            <div style={{
                              width: '20px', height: '20px', border: '2px solid #f5a623',
                              borderTopColor: 'transparent', borderRadius: '50%',
                              animation: 'spin 0.7s linear infinite',
                            }} />
                          </div>
                        )}

                        {/* Error indicator */}
                        {f.uploadError && !f.uploading && (
                          <div style={{
                            position: 'absolute', bottom: '-18px', left: 0, right: 0,
                            fontSize: '9px', color: '#ef4444', textAlign: 'center',
                          }}>
                            Failed
                          </div>
                        )}

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={ev => { ev.stopPropagation(); removeFile(f.id); }}
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

                    {/* Add more button */}
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
    accept=".jpg,.jpeg,.png,.pdf,.txt,.mp4,.mov,.avi,.mp3,.wav,.doc,.docx"
    multiple
    style={{ display: 'none' }}
    onChange={handleFiles}
/>
              <p className="su-field-hint">Upload front &amp; back of your {docType} if applicable.</p>
            </div>

            {/* Spinner keyframe (inline style tag via a style element rendered once) */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
              <button onClick={() => navigate(-1)} className="su-btn-primary-outline" disabled={loading}>Cancel</button>
              <button
                onClick={handleSubmit}
                className="su-btn-primary"
                disabled={loading || files.some(f => f.uploading)}
              >
                {loading ? 'Saving...' : files.some(f => f.uploading) ? 'Uploading...' : 'Save'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </PhotographerLayout>
  );
};

export default KYCVerification;
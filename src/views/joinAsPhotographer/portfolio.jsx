import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../index.css';
import { FiPlus, FiUpload, FiX, FiFile } from 'react-icons/fi';
import { getProfile, updateProfile } from '../../services/profile';
import { getUploadLink } from '../../services/common';

/* ─── Upload helper (same pattern as KYC) ────────────────────────────────── */
const uploadFileToAWS = async (file, documentFor = 'portfolio', side = 'front') => {
    const linkRes = await getUploadLink({
        document_for: documentFor,
        document_type: file.type === 'application/pdf' ? 'pdf' : 'image',
        mimetype: file.type,
        side,
    });
    const { presignedUrl, key } = linkRes.data.data;
    await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
    });
    return key;
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const PhotographerPortfolio = ({ onSave, onCancel }) => {
    const portfolioRef = useRef();
    const awardFileRefs = useRef({});

    const [bio, setBio] = useState('');
    const [equipment, setEquipment] = useState('');

    /*
     * portfolioFiles: existing docs from API  →  { id, key, document_type, previewUrl, source: 'existing' }
     * newFiles:       newly added by user     →  { tempId, name, previewUrl, file, key, document_type, uploading, uploadError }
     * deletedIds:     ids of existing docs the user removed
     */
    const [portfolioFiles, setPortfolioFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [deletedIds, setDeletedIds] = useState([]);

    /*
     * socialLinks: { instagram, facebook, telegram, pinterest }
     * originalSocials: same shape loaded from profile (to compute insert/update/delete diff)
     */
    const [socials, setSocials] = useState({ instagram: '', facebook: '', telegram: '', pinterest: '', googleDrive: '' });
    const [originalSocials, setOriginalSocials] = useState({});

    /*
     * videoLinks: [{ id?, url, title }]   (id present = existing from API)
     * originalVideoLinks: snapshot from API
     */
    const [videoLinks, setVideoLinks] = useState([{ url: '', title: 'video' }]);
    const [originalVideoLinks, setOriginalVideoLinks] = useState([]);

    /*
     * awards: [{ id?, name, images: [ { id?, tempId?, previewUrl, key, uploading, uploadError, source } ] }]
     * A single award has ONE name but can have MANY images — mirrors the Portfolio Upload
     * section: existing images + newly uploaded images + a trailing "+" tile to add more.
     * id on an image  = existing image loaded from API
     * tempId on image = newly added, not yet (or currently) uploading
     */
    const [awards, setAwards] = useState([{ name: '', images: [] }]);

    const [saving, setSaving] = useState(false);
    const [saveErr, setSaveErr] = useState('');
    const [saveOk, setSaveOk] = useState('');
    const [originalAwards, setOriginalAwards] = useState([]);
    const [deletedAwardIds, setDeletedAwardIds] = useState([]);
    const [deletedAwardImageIds, setDeletedAwardImageIds] = useState([]);

    /* ── Load existing profile data ── */
    useEffect(() => {
        const load = async () => {
            try {
                const res = await getProfile();
                const user = res?.data?.data?.user;
                if (!user) return;

                if (user.bio) setBio(user.bio);
                if (user.equipment) setEquipment(user.equipment);

                // Portfolio docs
                if (user.portfolio_documents?.length) {
                    setPortfolioFiles(user.portfolio_documents.map(d => ({
                        id: d.id,
                        key: d.key || d.document_key,
                        document_type: d.document_type || 'image',
                        previewUrl: d.url || d.key,
                        source: 'existing',
                    })));
                }

                // Social links — API returns array [{link_type, url}]
                const socialsFromApi = {};
                if (user.social_links?.length) {
                    user.social_links.forEach(s => { socialsFromApi[s.link_type] = s.url; });
                }
                setSocials(prev => ({ ...prev, ...socialsFromApi }));
                setOriginalSocials(socialsFromApi);

                // Video links
                if (user.video_links?.length) {
                    const mapped = user.video_links.map(v => ({ id: v.id, url: v.url, title: v.title || '' }));
                    setVideoLinks(mapped.length ? mapped : [{ url: '', title: 'video' }]);
                    setOriginalVideoLinks(mapped);
                }

                // Awards — each award may have multiple images (a.images / a.award_images)
                if (user.awards?.length) {
                    const mappedAwards = user.awards.map(a => ({
                        id: a.id,
                        name: a.name || '',
                        images: (a.images || a.award_images || []).map(img => ({
                            id: img.id,
                            previewUrl: img.url || img.image_url || img.key,
                            key: img.key,
                            uploading: false,
                            uploadError: null,
                            source: 'existing',
                        })),
                    }));
                    setAwards(mappedAwards);
                    setOriginalAwards(mappedAwards); // NEW
                }
            } catch (err) {
                console.error('Portfolio profile fetch error:', err);
            }
        };
        load();
    }, []);

    /* ── Portfolio file upload (mirrors KYC processAndUploadFile) ── */
    const processAndUploadFile = async (file, idx) => {
        const tempId = `${Date.now()}-${idx}`;
        const entry = {
            tempId,
            name: file.name,
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            file,
            document_type: file.type === 'application/pdf' ? 'pdf' : 'image',
            key: null,
            uploading: true,
            uploadError: null,
        };
        setNewFiles(prev => [...prev, entry]);

        try {
            const key = await uploadFileToAWS(file, 'portfolio');
            setNewFiles(prev =>
                prev.map(f => f.tempId === tempId ? { ...f, key, uploading: false } : f)
            );
        } catch (err) {
            console.error('Portfolio file upload failed:', file.name, err);
            setNewFiles(prev =>
                prev.map(f => f.tempId === tempId ? { ...f, uploading: false, uploadError: 'Upload failed' } : f)
            );
        }
    };

    const handlePortfolioFiles = (e) => {
        Array.from(e.target.files).forEach((f, i) => processAndUploadFile(f, i));
        e.target.value = '';
    };

    const removeExistingFile = (id) => {
        setPortfolioFiles(prev => prev.filter(f => f.id !== id));
        setDeletedIds(prev => [...prev, id]);
    };

    const removeNewFile = (tempId) =>
        setNewFiles(prev => prev.filter(f => f.tempId !== tempId));

    /* ── Video links helpers ── */
    const addVideoLink = () => setVideoLinks(v => [...v, { url: '', title: 'video' }]);
    const removeVideoLink = (i) => setVideoLinks(v => v.filter((_, idx) => idx !== i));
    const updateVideoLink = (i, field, val) =>
        setVideoLinks(v => v.map((x, idx) => idx === i ? { ...x, [field]: val } : x));

    /* ── Award images upload — multiple images per award, same pattern as Portfolio Upload ── */
    const handleAwardImages = (awardIndex, files) => {
        Array.from(files || []).forEach((file, i) => {
            const tempId = `award-${awardIndex}-${Date.now()}-${i}`;
            const entry = {
                tempId,
                previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                key: null,
                uploading: true,
                uploadError: null,
            };
            setAwards(prev => prev.map((a, idx) =>
                idx === awardIndex ? { ...a, images: [...a.images, entry] } : a
            ));

            uploadFileToAWS(file, 'award')
                .then(key => {
                    setAwards(prev => prev.map((a, idx) =>
                        idx === awardIndex
                            ? { ...a, images: a.images.map(img => img.tempId === tempId ? { ...img, key, uploading: false } : img) }
                            : a
                    ));
                })
                .catch(err => {
                    console.error('Award image upload failed:', file.name, err);
                    setAwards(prev => prev.map((a, idx) =>
                        idx === awardIndex
                            ? { ...a, images: a.images.map(img => img.tempId === tempId ? { ...img, uploading: false, uploadError: 'Upload failed' } : img) }
                            : a
                    ));
                });
        });
    };

    const removeAwardImage = (awardIndex, identifier) => {
        const award = awards[awardIndex];
        const img = award?.images.find(im => (im.tempId || im.id) === identifier);
        if (img?.id) {
            setDeletedAwardImageIds(ids => [...ids, img.id]); // NEW
        }
        setAwards(prev => prev.map((a, idx) =>
            idx === awardIndex
                ? { ...a, images: a.images.filter(im => (im.tempId || im.id) !== identifier) }
                : a
        ));
    };

    const addAward = () => setAwards(a => [...a, { name: '', images: [] }]);
    const removeAward = (i) => {
        const award = awards[i];
        if (award?.id) {
            setDeletedAwardIds(ids => [...ids, award.id]); // NEW
        }
        setAwards(a => a.filter((_, idx) => idx !== i));
    };

    /* ── Build social_links diff ── */
    const buildSocialsDiff = () => {
        const LINK_TYPES = ['instagram', 'facebook', 'telegram', 'pinterest', 'googleDrive'];
        const result = [];
        LINK_TYPES.forEach(type => {
            const apiKey = type === 'googleDrive' ? 'google_drive' : type;
            const current = socials[type]?.trim() || '';
            const original = originalSocials[apiKey]?.trim() || '';
            if (current && !original) result.push({ type: 'insert', link_type: apiKey, url: current });
            if (current && original && current !== original) result.push({ type: 'update', link_type: apiKey, url: current });
            if (!current && original) result.push({ type: 'delete', link_type: apiKey });
        });
        return result;
    };

    /* ── Build video_links diff ── */
    const buildVideoDiff = () => {
        const result = [];
        // Inserts: links in current state with no id
        videoLinks.forEach(v => {
            if (!v.id && v.url?.trim()) {
                result.push({ type: 'insert', url: v.url.trim(), title: v.title?.trim() || 'video' });
            }
        });
        // Updates: links with id where url or title changed
        videoLinks.forEach(v => {
            if (v.id) {
                const orig = originalVideoLinks.find(o => o.id === v.id);
                if (orig && (orig.url !== v.url || orig.title !== v.title)) {
                    result.push({ type: 'update', id: v.id, url: v.url.trim(), title: v.title?.trim() || 'video' });
                }
            }
        });
        // Deletes: original links no longer in current state
        originalVideoLinks.forEach(orig => {
            if (!videoLinks.find(v => v.id === orig.id)) {
                result.push({ type: 'delete', id: orig.id });
            }
        });
        return result;
    };

    /* ── Build portfolios diff ── */
    const buildPortfolioDiff = () => {
        const result = [];
        // Inserts: newly uploaded files that finished successfully
        newFiles.forEach(f => {
            if (f.key && !f.uploading && !f.uploadError) {
                result.push({ type: 'insert', key: f.key, document_type: f.document_type });
            }
        });
        // Deletes: existing docs that were removed
        deletedIds.forEach(id => {
            result.push({ type: 'delete', id });
        });
        return result;
    };

    /* ── Build awards payload (each award: one name, many image keys) ── */
    const buildAwardsPayload = () => {
        const result = [];

        // Inserts: brand new awards (no id) with a name
        awards.forEach(a => {
            if (!a.id && a.name.trim()) {
                result.push({
                    type: 'insert',
                    name: a.name.trim(),
                    keys: a.images.filter(img => img.key && !img.uploading && !img.uploadError).map(img => img.key),
                });
            }
        });

        // Updates: existing awards whose name changed or that got new images
        awards.forEach(a => {
            if (a.id) {
                const orig = originalAwards.find(o => o.id === a.id);
                const nameChanged = orig && orig.name.trim() !== a.name.trim();
                const newImageKeys = a.images
                    .filter(img => img.key && !img.uploading && !img.uploadError && img.source !== 'existing')
                    .map(img => img.key);

                if (nameChanged || newImageKeys.length) {
                    result.push({
                        type: 'update',
                        id: a.id,
                        ...(nameChanged && { name: a.name.trim() }),
                        ...(newImageKeys.length && { keys: newImageKeys }),
                    });
                }
            }
        });

        // Deletes: whole awards removed by the user
        deletedAwardIds.forEach(id => {
            result.push({ type: 'delete', id });
        });

        // Deletes: individual existing images removed while the award itself stays
        deletedAwardImageIds.forEach(id => {
            result.push({ type: 'delete', image_id: id });
        });

        return result;
    };
    // ── Save ──
    const handleSave = async () => {
        setSaveErr('');
        setSaveOk('');

        const awardImagesUploading = awards.some(a => a.images.some(img => img.uploading));
        const stillUploading = newFiles.some(f => f.uploading) || awardImagesUploading;
        if (stillUploading) {
            setSaveErr('Please wait for all files to finish uploading.');
            toast.warning('Please wait for all files to finish uploading.');
            return;
        }
        const awardImagesErrored = awards.some(a => a.images.some(img => img.uploadError));
        const hasErrors = newFiles.some(f => f.uploadError) || awardImagesErrored;
        if (hasErrors) {
            setSaveErr('One or more files failed to upload. Remove them and try again.');
            toast.error('One or more files failed to upload. Remove them and try again.');
            return;
        }

        const portfolioDiff = buildPortfolioDiff();
        const socialsDiff = buildSocialsDiff();
        const videoDiff = buildVideoDiff();
        const awardsPayload = buildAwardsPayload();

        const payload = {
            ...(bio.trim() && { bio: bio.trim() }),
            ...(equipment.trim() && { equipment: equipment.trim() }),
            ...(portfolioDiff.length && { portfolio_documents: portfolioDiff }),
            ...(socialsDiff.length && { social_links: socialsDiff }),
            ...(videoDiff.length && { video_links: videoDiff }),
            ...(awardsPayload.length && { awards: awardsPayload }),
        };

        if (!Object.keys(payload).length) {
            setSaveOk('Nothing to update.');
            toast.info('Nothing to update.');
            return;
        }

        try {
            setSaving(true);
            await updateProfile(payload);
            setDeletedAwardIds([]);
            setDeletedAwardImageIds([]);
            setOriginalAwards(awards); // re-baseline so the next diff is accurate
            // Commit: move new files into existing, clear deleted
            setPortfolioFiles(prev => [
                ...prev,
                ...newFiles
                    .filter(f => f.key && !f.uploadError)
                    .map(f => ({ id: null, key: f.key, document_type: f.document_type, previewUrl: f.previewUrl, source: 'existing' })),
            ]);
            setNewFiles([]);
            setDeletedIds([]);
            setOriginalSocials({
                ...originalSocials, ...Object.fromEntries(
                    socialsDiff.filter(s => s.type !== 'delete').map(s => [s.link_type, s.url])
                )
            });
            setOriginalVideoLinks(videoLinks.filter(v => v.url?.trim()));
            setSaveOk('Portfolio saved successfully!');
            toast.success('Portfolio saved successfully!');
            onSave?.();
        } catch (err) {
            const msg = err?.response?.data?.error?.message || err?.response?.data?.message || 'Failed to save portfolio.';
            setSaveErr(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const anyUploading = newFiles.some(f => f.uploading) || awards.some(a => a.images.some(img => img.uploading));

    return (
        <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                Portfolio
            </h2>

            {/* {saveErr && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '13px' }}>
                    {saveErr}
                </div>
            )}
            {saveOk && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#dcfce7', color: '#15803d', fontSize: '13px' }}>
                    {saveOk}
                </div>
            )} */}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Bio */}
                <div className="su-field">
                    <label>Bio / Add About Me</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)}
                        placeholder="Add About You" rows={4}
                        style={{ resize: 'vertical', minHeight: '100px' }} />
                </div>

                {/* Equipment */}
                <div className="su-field">
                    <label>Equipment</label>
                    <textarea value={equipment} onChange={e => setEquipment(e.target.value)}
                        placeholder="List the cameras, lenses, lighting, and other gear you use" rows={3}
                        style={{ resize: 'vertical', minHeight: '80px' }} />
                </div>

                {/* ── Portfolio Upload ── */}
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
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        {portfolioFiles.length === 0 && newFiles.length === 0 ? (
                            <>
                                <FiUpload size={20} color="#bbb" />
                                <p style={{ margin: 0, fontSize: '13px', color: '#aaa', textAlign: 'center' }}>
                                    Click to upload (document must be one of [image, video, audio, document])
                                </p>
                            </>
                        ) : (
                            <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>

                                {/* Existing files */}
                                {portfolioFiles.map((f, i) => (
                                    <div key={`existing-${i}`} style={{ position: 'relative', flexShrink: 0 }}>
                                        {f.document_type === 'image' && f.previewUrl ? (
                                            <img src={f.previewUrl} alt="" style={{
                                                width: '80px', height: '80px', objectFit: 'cover',
                                                borderRadius: '8px', border: '2px solid #f5a623', display: 'block',
                                            }} />
                                        ) : (
                                            <div style={{
                                                width: '80px', height: '80px', borderRadius: '8px',
                                                border: '2px solid #f5a623', background: '#FFF3D6',
                                                display: 'flex', flexDirection: 'column',
                                                alignItems: 'center', justifyContent: 'center', gap: '4px',
                                            }}>
                                                <FiFile size={24} color="#f5a623" />
                                                <span style={{ fontSize: '9px', color: '#888', textAlign: 'center', padding: '0 4px', wordBreak: 'break-all' }}>
                                                    {f.key?.split('/').pop()?.slice(0, 12) || 'file'}
                                                </span>
                                            </div>
                                        )}
                                        <button type="button" onClick={ev => { ev.stopPropagation(); removeExistingFile(f.id); }}
                                            style={{
                                                position: 'absolute', top: '-7px', right: '-7px',
                                                width: '20px', height: '20px', borderRadius: '50%',
                                                background: '#ef4444', border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                padding: 0, color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                                            }}>
                                            <FiX size={11} />
                                        </button>
                                    </div>
                                ))}

                                {/* New files (uploading or done) */}
                                {newFiles.map((f) => (
                                    <div key={f.tempId} style={{ position: 'relative', flexShrink: 0 }}>
                                        {f.previewUrl ? (
                                            <img src={f.previewUrl} alt={f.name} style={{
                                                width: '80px', height: '80px', objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: f.uploadError ? '2px solid #ef4444' : '2px solid #f5a623',
                                                display: 'block', opacity: f.uploading ? 0.5 : 1,
                                            }} />
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
                                                <span style={{ fontSize: '9px', color: '#888', textAlign: 'center', padding: '0 4px', wordBreak: 'break-all' }}>
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

                                        {f.uploadError && !f.uploading && (
                                            <div style={{ position: 'absolute', bottom: '-18px', left: 0, right: 0, fontSize: '9px', color: '#ef4444', textAlign: 'center' }}>
                                                Failed
                                            </div>
                                        )}

                                        <button type="button" onClick={ev => { ev.stopPropagation(); removeNewFile(f.tempId); }}
                                            style={{
                                                position: 'absolute', top: '-7px', right: '-7px',
                                                width: '20px', height: '20px', borderRadius: '50%',
                                                background: '#ef4444', border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                padding: 0, color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                                            }}>
                                            <FiX size={11} />
                                        </button>
                                    </div>
                                ))}

                                {/* Add more */}
                                <div style={{
                                    width: '80px', height: '80px', border: '2px dashed #f5a623',
                                    borderRadius: '8px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: '#f5a623', fontSize: '26px',
                                    background: '#fff', flexShrink: 0,
                                }}>+</div>
                            </div>
                        )}
                    </div>
                    <input ref={portfolioRef} type="file" accept="image/*,.pdf" multiple style={{ display: 'none' }} onChange={handlePortfolioFiles} />
                    {anyUploading && <p className="su-field-hint" style={{ color: '#f5a623' }}>Uploading files…</p>}
                </div>

                {/* ── Video Links ── */}
                <div className="su-field">
                    <label>Add Video Links</label>
                    {videoLinks.map((link, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: i < videoLinks.length - 1 ? '8px' : 0 }}>
                            <input
                                type="url"
                                value={link.url}
                                onChange={e => updateVideoLink(i, 'url', e.target.value)}
                                placeholder="Add YouTube video link"
                                style={{ flex: 1 }}
                            />
                            {i === videoLinks.length - 1 ? (
                                <button type="button" onClick={addVideoLink} style={{
                                    width: '36px', height: '36px', borderRadius: '8px',
                                    background: '#f5a623', border: 'none', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.18s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                    <FiPlus size={18} />
                                </button>
                            ) : (
                                <button type="button" onClick={() => removeVideoLink(i)} style={{
                                    width: '36px', height: '36px', borderRadius: '8px',
                                    background: '#fee2e2', border: 'none', color: '#ef4444',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.18s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Social Links — 2 column grid ── */}
                <div className="profile-grid">
                    <div className="su-field">
                        <label>Instagram Profile Link</label>
                        <input type="url" value={socials.instagram}
                            onChange={e => setSocials(s => ({ ...s, instagram: e.target.value }))}
                            placeholder="https://instagram.com/yourprofile" />
                    </div>
                    <div className="su-field">
                        <label>Facebook Profile Link</label>
                        <input type="url" value={socials.facebook}
                            onChange={e => setSocials(s => ({ ...s, facebook: e.target.value }))}
                            placeholder="https://facebook.com/yourprofile" />
                    </div>
                    <div className="su-field">
                        <label>Telegram Profile Link</label>
                        <input type="url" value={socials.telegram}
                            onChange={e => setSocials(s => ({ ...s, telegram: e.target.value }))}
                            placeholder="https://t.me/yourhandle" />
                    </div>
                    <div className="su-field">
                        <label>Pinterest Profile Link</label>
                        <input type="url" value={socials.pinterest}
                            onChange={e => setSocials(s => ({ ...s, pinterest: e.target.value }))}
                            placeholder="https://pinterest.com/yourprofile" />
                    </div>
                </div>

                {/* Google Drive */}
                <div className="su-field">
                    <label>Google Drive Link</label>
                    <input type="url" value={socials.googleDrive}
                        onChange={e => setSocials(s => ({ ...s, googleDrive: e.target.value }))}
                        placeholder="https://drive.google.com/…" />
                </div>

                {/* ── Awards — one name, many images (mirrors Portfolio Upload) ── */}
                <div className="su-field">
                    <label>Add Awards</label>
                    {awards.map((award, i) => {
                        const hasImages = award.images.length > 0;
                        return (
                            <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px 16px', marginBottom: i < awards.length - 1 ? '12px' : 0, background: '#fafafa', position: 'relative' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <input
                                        type="text"
                                        value={award.name}
                                        onChange={e => setAwards(prev => prev.map((a, idx) => idx === i ? { ...a, name: e.target.value } : a))}
                                        placeholder="e.g. Best Wedding Photographer"
                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                    />
                                </div>

                                {/* Award images upload — multiple images, same pattern as Portfolio Upload */}
                                <div
                                    onClick={() => awardFileRefs.current[i]?.click()}
                                    style={{
                                        border: '1.5px solid #d1d5db', borderRadius: '8px',
                                        padding: hasImages ? '14px' : '20px 16px',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        cursor: 'pointer', background: '#fff', minHeight: '90px',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.15)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {!hasImages ? (
                                        <>
                                            <FiUpload size={20} color="#bbb" />
                                            <p style={{ margin: 0, fontSize: '13px', color: '#aaa', textAlign: 'center' }}>
                                                Click to upload award images
                                            </p>
                                        </>
                                    ) : (
                                        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                                            {award.images.map((img) => {
                                                const identifier = img.tempId || img.id;
                                                return (
                                                    <div key={identifier} style={{ position: 'relative', flexShrink: 0 }}>
                                                        {img.previewUrl ? (
                                                            <img src={img.previewUrl} alt="" style={{
                                                                width: '80px', height: '80px', objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                border: img.uploadError ? '2px solid #ef4444' : '2px solid #f5a623',
                                                                display: 'block', opacity: img.uploading ? 0.5 : 1,
                                                            }} />
                                                        ) : (
                                                            <div style={{
                                                                width: '80px', height: '80px', borderRadius: '8px',
                                                                border: img.uploadError ? '2px solid #ef4444' : '2px solid #f5a623',
                                                                background: '#FFF3D6',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                opacity: img.uploading ? 0.5 : 1,
                                                            }}>
                                                                <FiFile size={24} color="#f5a623" />
                                                            </div>
                                                        )}

                                                        {img.uploading && (
                                                            <div style={{
                                                                position: 'absolute', inset: 0,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                borderRadius: '8px', background: 'rgba(255,255,255,0.6)',
                                                            }}>
                                                                <div style={{
                                                                    width: '18px', height: '18px', border: '2px solid #f5a623',
                                                                    borderTopColor: 'transparent', borderRadius: '50%',
                                                                    animation: 'spin 0.7s linear infinite',
                                                                }} />
                                                            </div>
                                                        )}

                                                        {img.uploadError && !img.uploading && (
                                                            <div style={{ position: 'absolute', bottom: '-18px', left: 0, right: 0, fontSize: '9px', color: '#ef4444', textAlign: 'center' }}>
                                                                Failed
                                                            </div>
                                                        )}

                                                        <button type="button" onClick={ev => { ev.stopPropagation(); removeAwardImage(i, identifier); }}
                                                            style={{
                                                                position: 'absolute', top: '-7px', right: '-7px',
                                                                width: '20px', height: '20px', borderRadius: '50%',
                                                                background: '#ef4444', border: 'none', cursor: 'pointer',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                padding: 0, color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                                                            }}>
                                                            <FiX size={11} />
                                                        </button>
                                                    </div>
                                                );
                                            })}

                                            {/* Add more tile */}
                                            <div style={{
                                                width: '80px', height: '80px', border: '2px dashed #f5a623',
                                                borderRadius: '8px', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', color: '#f5a623', fontSize: '26px',
                                                background: '#fff', flexShrink: 0,
                                            }}>+</div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={el => awardFileRefs.current[i] = el}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={e => { handleAwardImages(i, e.target.files); e.target.value = ''; }}
                                />

                                {awards.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeAward(i)}
                                        style={{
                                            position: 'absolute', top: '10px', right: '10px',
                                            background: '#fee2e2', border: 'none', borderRadius: '6px',
                                            color: '#ef4444', cursor: 'pointer', padding: '4px 8px', fontSize: '12px',
                                        }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    <button
                        type="button"
                        onClick={addAward}
                        style={{
                            marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'none', border: '1px dashed #f5a623', borderRadius: '8px',
                            color: '#f5a623', cursor: 'pointer', padding: '8px 14px', fontSize: '13px',
                        }}
                    >
                        <FiPlus size={14} /> Add another award
                    </button>
                </div>

            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="su-btn-primary"
                    style={{ padding: '11px 32px', opacity: (saving || anyUploading) ? 0.7 : 1, cursor: (saving || anyUploading) ? 'not-allowed' : 'pointer' }}
                    disabled={saving || anyUploading}
                >
                    {saving ? 'Saving…' : anyUploading ? 'Uploading…' : 'Save'}
                </button>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default PhotographerPortfolio;
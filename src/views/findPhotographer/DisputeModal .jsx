import React, { useEffect, useState } from 'react';
import { FiX, FiUploadCloud, FiCalendar, FiMapPin } from 'react-icons/fi';
import { getUploadLink } from '../../services/common';
import { postDispute, getDisputeProviders } from '../../services/dispute';

const DISPUTE_TYPES = [
  { value: 'poor_image_quality', label: 'Poor Image Quality' },
  { value: 'late_delivery', label: 'Late Delivery' },
  { value: 'no_show', label: 'No Show' },
  { value: 'unprofessional_behavior', label: 'Unprofessional Behavior' },
  { value: 'wrong_deliverables', label: 'Wrong Deliverables' },
  { value: 'other', label: 'Other' },
];

const DisputeModal = ({ order, onClose, showToast }) => {
  const [disputeType, setDisputeType] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');

  const updatePhotoById = (photoId, patch) => {
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, ...patch } : p)));
  };

  const removePhotoById = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const processAndUploadPhoto = async (file, tempId) => {
    try {
      const linkRes = await getUploadLink({
        document_for: 'dispute',
        document_type: 'image',
        mimetype: file.type,
      });

      const { presignedUrl, key } = linkRes.data.data;

      await fetch(presignedUrl, { method: 'PUT', body: file });

      updatePhotoById(tempId, { key, uploading: false });
    } catch (err) {
      console.error('Dispute photo upload failed', err);
      removePhotoById(tempId);
      showToast?.('Failed to upload photo. Please try again.');
    }
  };

  const handlePhotoUpload = (files) => {
    if (photos.length >= 5) {
      showToast?.('Maximum 5 photos allowed per dispute');
      return;
    }

    const filesArr = Array.from(files).slice(0, 5 - photos.length);

    const newPhotos = filesArr.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      previewUrl: URL.createObjectURL(file),
      key: null,
      uploading: true,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    newPhotos.forEach((p, i) => processAndUploadPhoto(filesArr[i], p.id));
  };

  const removePhoto = (photoId) => removePhotoById(photoId);

  const listProviders = async () => {
    setLoadingProviders(true);
    try {
      const res = await getDisputeProviders(order.id);
      const list = res?.data?.data || [];
      setProviders(list);

      // auto-select if there's exactly one provider for this order
      if (list.length === 1) {
        setSelectedProviderId(String(list[0].service_provider_id));
      }
    } catch (error) {
      console.error(error);
      showToast?.('Failed to load service providers for this order');
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    if (order?.id) {
      listProviders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  const submitDispute = async () => {
    if (!selectedProviderId) {
      showToast?.('Please select a service provider');
      return;
    }
    if (!disputeType) {
      showToast?.('Please select a dispute type');
      return;
    }
    if (!description.trim()) {
      showToast?.('Please describe the issue');
      return;
    }
    if (description.length > 2000) {
      showToast?.('Description must be 2000 characters or less');
      return;
    }
    if (photos.some((p) => p.uploading)) {
      showToast?.('Please wait for photos to finish uploading');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        order_id: order.id,
        photographer_id: Number(selectedProviderId),
        dispute_type: disputeType,
        description,
        images: photos.map((p) => ({
          type: 'insert',
          key: p.key,
          document_type: 'image',
        })),
      };

      await postDispute(payload);

      setSubmitting(false);
      showToast?.('Dispute submitted successfully!');
      onClose?.();
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      showToast?.(
        error?.response?.data?.message || 'Failed to submit dispute. Please try again.'
      );
    }
  };

  if (!order) return null;

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="review-modal-header">
          <div>
            <h3 className="review-modal-title">Raise a Dispute</h3>
            <p className="review-modal-subtitle">
              Tell us what went wrong and we'll look into it.
            </p>
          </div>
          <button type="button" className="review-modal-close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="review-modal-body">
          {/* Left: Order summary */}
          <div className="review-modal-left">
            <img src={order.image} alt={order.eventName} className="review-order-image" />
            <h4 className="review-order-name">{order.eventName}</h4>
            <div className="review-order-meta-row">
              <FiCalendar size={12} />
              <span>{order.dateTime}</span>
            </div>
            <div className="review-order-meta-row">
              <FiMapPin size={12} />
              <span>{order.location}</span>
            </div>
            <span className="review-package-tag">{order.packageName}</span>
          </div>

          {/* Right: Dispute form */}
          <div className="review-modal-right">
            <label className="review-field-label">Service Provider</label>
            <select
              className="filter-select"
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              disabled={loadingProviders || providers.length === 0}
            >
              <option value="">
                {loadingProviders
                  ? 'Loading service providers...'
                  : providers.length === 0
                    ? 'No service providers found'
                    : 'Select a service provider'}
              </option>
              {providers.map((p) => (
                <option key={p.service_provider_id} value={p.service_provider_id}>
                  {p.full_name} 
                </option>
              ))}
            </select>

            <label className="review-field-label">Dispute Type</label>
            <select
              className="filter-select"
              value={disputeType}
              onChange={(e) => setDisputeType(e.target.value)}
            >
              <option value="">Select a reason</option>
              {DISPUTE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <label className="review-field-label">Description</label>
            <textarea
              className="review-text-area"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
              maxLength={2000}
              rows={5}
            />
            <div className="review-char-count">{description.length} / 2000</div>

            <label className="review-field-label">Add Photos (Optional)</label>
            <div className="review-photos-grid">
              <label className="review-upload-tile">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                  disabled={photos.length >= 5}
                />
                <FiUploadCloud size={18} color="#a8a29e" />
                <span className="review-upload-tile-text">Drag & drop images here</span>
                <span className="browse-files-trigger">Browse Files</span>
              </label>

              {photos.map((photo) => (
                <div key={photo.id} className="review-photo-tile">
                  <img
                    src={photo.previewUrl}
                    alt="evidence"
                    style={{ opacity: photo.uploading ? 0.5 : 1 }}
                  />
                  {photo.uploading && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #E8A317',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.7s linear infinite',
                        }}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    className="remove-review-photo-btn"
                    onClick={() => removePhoto(photo.id)}
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="review-modal-footer">
          <button type="button" className="review-modal-close-action-btn" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="review-modal-publish-btn"
            onClick={submitDispute}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Dispute'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisputeModal;
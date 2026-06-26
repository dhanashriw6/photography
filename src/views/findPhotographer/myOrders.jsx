import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getCustomerOrders } from '../../services/order';
import { 
  FiGrid, FiList, FiSearch, FiCalendar, FiClock, FiMapPin, 
  FiX, FiUploadCloud, FiLink, FiSend, FiEye, FiChevronDown, 
  FiChevronUp, FiFilter, FiRefreshCw 
} from 'react-icons/fi';
import { BsCurrencyRupee } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';



const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Filters State
  const [uiFilters, setUiFilters] = useState({
    bookingStatus: 'AllStatuses',
    paymentStatus: 'AllStatuses',
    startDate: '',
    endDate: '',
    category: 'AllCategories',
    city: 'AllCities',
    sortBy: 'Most Recent'
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...uiFilters });

  // References state (stored in localStorage per order)
  const [referenceState, setReferenceState] = useState({});

  // Toast / Status messages
  const [toastMessage, setToastMessage] = useState(null);

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getCustomerOrders();

      console.log(response);

      const orders = response?.data?.data || [];
      console.log("API Orders:", orders);
console.log("Length:", orders.length);

      if (orders.length) {
        setOrders(orders.map(parseApiOrder));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

  // Helper to parse API order into clean client UI structure
  const parseApiOrder = (order) => {
    let dateObj = null;
    if (order.event_date) dateObj = new Date(order.event_date);
    else if (order.created_at) dateObj = new Date(order.created_at);
    
    const dateDisplay = dateObj && !isNaN(dateObj)
      ? dateObj.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Date not set";

    const eventName = order.event_name || order.category_name || "Photoshoot";
    
    // Map categories to high-quality Unsplash image URLs
    let categoryImage = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&auto=format&fit=crop&q=60";
    const nameLower = eventName.toLowerCase();
    if (nameLower.includes("wedding")) {
      categoryImage = "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=60";
    } else if (nameLower.includes("baby")) {
      categoryImage = "https://images.unsplash.com/photo-1519689680058-324335c77ebe?w=500&auto=format&fit=crop&q=60";
    } else if (nameLower.includes("engagement")) {
      categoryImage = "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&auto=format&fit=crop&q=60";
    } else if (nameLower.includes("pre-wedding") || nameLower.includes("couple")) {
      categoryImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60";
    } else if (nameLower.includes("corporate")) {
      categoryImage = "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop&q=60";
    }

    const durationVal = order.duration_value || 1;
    const durationType = order.duration_type || "days";
    const status = (order.status || "draft").toUpperCase();

    // Dynamically calculate paid & due amounts based on status for realistic display
    const totalAmount = parseFloat(order.total_amount || 25000);
    const paidAmount = status === "CONFIRMED" || status === "COMPLETED" ? totalAmount : 0;
    const dueAmount = totalAmount - paidAmount;

    return {
      id: order.id,
      orderNumber: order.order_number || `ORD-${order.id}`,
      eventName,
      dateTime: dateDisplay,
      location: order.location || "Rajkot, Gujarat, India",
      packageName: `${durationVal} ${durationType} Package`,
      bookingStatus: status,
      paymentStatus:
        status === "CONFIRMED" || status === "COMPLETED"
          ? "PAID"
          : status === "CANCELLED"
          ? "REFUNDED"
          : "PENDING",

      paidAmount,
      dueAmount,
      totalAmount,

    //   teamName: "Amit & Team",
    //   avatars: [
    //     "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
    //     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    //     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
    //   ],

      image: categoryImage,
      rawOrder: order,
    };
  };

  // Unique lists for filters derived from active orders
  const categories = useMemo(() => {
    const list = new Set(orders.map(o => o.eventName));
    return ['All Categories', ...Array.from(list)];
  }, [orders]);

  const cities = useMemo(() => {
    const list = new Set(orders.map(o => o.location.split(',')[0].trim()));
    return ['All Cities', ...Array.from(list)];
  }, [orders]);

  // Load references state from localStorage
  const loadReferenceForOrder = (orderId) => {
    if (referenceState[orderId]) return referenceState[orderId];
    try {
      const saved = localStorage.getItem(`order_reference_${orderId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setReferenceState(prev => ({ ...prev, [orderId]: parsed }));
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    const defaultVal = {
      inspirationPhotos: [],
      sampleReels: [],
      videoLink: '',
      creativeNotes: '',
      shared: false
    };
    return defaultVal;
  };

  // Helper to save reference state
  const saveReferenceForOrder = (orderId, data) => {
    const updated = { ...referenceState, [orderId]: data };
    setReferenceState(updated);
    try {
      localStorage.setItem(`order_reference_${orderId}`, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  // Filter & Sort logic
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Sorting
    if (appliedFilters.sortBy === 'Most Recent') {
      result.sort((a, b) => {
        const dateA = a.dateTime ? new Date(a.dateTime.split(' • ')[0]) : new Date(0);
        const dateB = b.dateTime ? new Date(b.dateTime.split(' • ')[0]) : new Date(0);
        return dateB - dateA;
      });
    } else if (appliedFilters.sortBy === 'Oldest First') {
      result.sort((a, b) => {
        const dateA = a.dateTime ? new Date(a.dateTime.split(' • ')[0]) : new Date(0);
        const dateB = b.dateTime ? new Date(b.dateTime.split(' • ')[0]) : new Date(0);
        return dateA - dateB;
      });
    } else if (appliedFilters.sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (appliedFilters.sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    return result;
  }, [orders, appliedFilters.sortBy]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setUiFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...uiFilters });
  };

  const resetFilters = () => {
    const defaults = {
      bookingStatus: 'AllStatuses',
      paymentStatus: 'AllStatuses',
      startDate: '',
      endDate: '',
      category: 'AllCategories',
      city: 'AllCities',
      sortBy: 'Most Recent'
    };
    setUiFilters(defaults);
    setAppliedFilters(defaults);
  };

  // Card expansion toggle
  const toggleExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      loadReferenceForOrder(orderId);
      setExpandedOrderId(orderId);
    }
  };

  // Simulated Reference Uploads
  const handleFileDrop = (orderId, files, type) => {
    const currentRef = loadReferenceForOrder(orderId);
    
    if (type === 'image') {
      if (currentRef.inspirationPhotos.length >= 10) {
        showToast("Maximum 10 inspiration photos allowed");
        return;
      }
      
      const newPhotos = Array.from(files).map((file, index) => {
        const id = `${Date.now()}-${index}`;
        const previewUrl = URL.createObjectURL(file);
        
        // Start simulated upload progress
        simulateUpload(orderId, id, 'image');
        
        return {
          id,
          name: file.name,
          previewUrl,
          progress: 10,
          uploading: true
        };
      });

      const updatedPhotos = [...currentRef.inspirationPhotos, ...newPhotos].slice(0, 10);
      saveReferenceForOrder(orderId, {
        ...currentRef,
        inspirationPhotos: updatedPhotos
      });
    } else if (type === 'video') {
      if (files.length === 0) return;
      const file = files[0];
      
      if (file.size > 100 * 1024 * 1024) {
        showToast("Video size must be less than 100MB");
        return;
      }

      const id = `${Date.now()}`;
      const videoEntry = {
        id,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        progress: 10,
        uploading: true
      };

      simulateUpload(orderId, id, 'video');

      saveReferenceForOrder(orderId, {
        ...currentRef,
        sampleReels: [videoEntry]
      });
    }
  };

  const simulateUpload = (orderId, fileId, fileType) => {
    let progress = 10;
    const interval = setInterval(() => {
      progress += 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setReferenceState(prev => {
        const currentRef = prev[orderId];
        if (!currentRef) return prev;

        if (fileType === 'image') {
          const updatedPhotos = currentRef.inspirationPhotos.map(p => {
            if (p.id === fileId) {
              return { ...p, progress, uploading: progress < 100 };
            }
            return p;
          });
          const newState = { ...prev, [orderId]: { ...currentRef, inspirationPhotos: updatedPhotos } };
          localStorage.setItem(`order_reference_${orderId}`, JSON.stringify(newState[orderId]));
          return newState;
        } else {
          const updatedReels = currentRef.sampleReels.map(r => {
            if (r.id === fileId) {
              return { ...r, progress, uploading: progress < 100 };
            }
            return r;
          });
          const newState = { ...prev, [orderId]: { ...currentRef, sampleReels: updatedReels } };
          localStorage.setItem(`order_reference_${orderId}`, JSON.stringify(newState[orderId]));
          return newState;
        }
      });
    }, 200);
  };

  const removePhotoReference = (orderId, photoId) => {
    const currentRef = loadReferenceForOrder(orderId);
    const updatedPhotos = currentRef.inspirationPhotos.filter(p => p.id !== photoId);
    saveReferenceForOrder(orderId, {
      ...currentRef,
      inspirationPhotos: updatedPhotos
    });
  };

  const removeVideoReference = (orderId) => {
    const currentRef = loadReferenceForOrder(orderId);
    saveReferenceForOrder(orderId, {
      ...currentRef,
      sampleReels: []
    });
  };

  const handleNotesChange = (orderId, text) => {
    const currentRef = loadReferenceForOrder(orderId);
    saveReferenceForOrder(orderId, {
      ...currentRef,
      creativeNotes: text.slice(0, 1000)
    });
  };

  const handleVideoLinkChange = (orderId, url) => {
    const currentRef = loadReferenceForOrder(orderId);
    saveReferenceForOrder(orderId, {
      ...currentRef,
      videoLink: url
    });
  };

  const sendReferenceToPhotographer = (orderId) => {
    const currentRef = loadReferenceForOrder(orderId);
    
    // Set loading indicator
    saveReferenceForOrder(orderId, {
      ...currentRef,
      sending: true
    });

    setTimeout(() => {
      saveReferenceForOrder(orderId, {
        ...currentRef,
        sending: false,
        shared: true
      });
      showToast("References shared with your photographer successfully!");
    }, 1200);
  };

  // Toast Utility
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Get status pill styling
  const getBookingStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return { bg: '#FEF3C7', color: '#D97706' }; // Yellow/Orange
      case 'PENDING':
        return { bg: '#FFF8E6', color: '#B7791F' }; // Lighter Yellow
      case 'COMPLETED':
        return { bg: '#E2F6EE', color: '#0D9488' }; // Green
      case 'CANCELLED':
        return { bg: '#FDE6E5', color: '#E0473C' }; // Red
      case 'DRAFT':
        return { bg: '#E0F2FE', color: '#0369A1' }; // Sky Blue
      default:
        return { bg: '#F3F4F6', color: '#4B5563' };
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'PAID':
        return { bg: '#E2F6EE', color: '#0D9488' }; // Green
      case 'PARTIALLY PAID':
        return { bg: '#FEF3C7', color: '#D97706' }; // Orange
      case 'REFUNDED':
        return { bg: '#F3F4F6', color: '#4B5563' }; // Grey
      case 'FAILED':
        return { bg: '#FDE6E5', color: '#E0473C' }; // Red
      default:
        return { bg: '#FFF8E6', color: '#B7791F' };
    }
  };

  return (
    <div className="bookings-page-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-alert">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="bookings-header-row">
        <div>
          <h1 className="bookings-title">My Bookings</h1>
          <p className="bookings-subtitle">View and manage all your bookings in one place.</p>
        </div>

        <div className="bookings-meta-controls">
          <span className="bookings-count-label">
            Showing 1 – {filteredOrders.length} of {orders.length} bookings
          </span>
          <div className="view-toggle-buttons">
            <button 
              type="button"
              className={`toggle-btn ${!isGridView ? 'active' : ''}`}
              onClick={() => setIsGridView(false)}
              title="List View"
            >
              <FiList size={18} />
            </button>
            <button 
              type="button"
              className={`toggle-btn ${isGridView ? 'active' : ''}`}
              onClick={() => setIsGridView(true)}
              title="Grid View"
            >
              <FiGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters on left, Bookings on right */}
      <div className="bookings-layout-grid">
        
        {/* Left Column: Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-sidebar-header">
            <span className="filters-title">Filters</span>
            <button 
              type="button" 
              className="reset-filters-btn"
              onClick={resetFilters}
            >
              <FiRefreshCw size={12} style={{ marginRight: '4px' }} />
              Reset
            </button>
          </div>

          <div className="filter-group">
            <label className="filter-label">Booking Status</label>
            <select 
              className="filter-select"
              value={uiFilters.bookingStatus}
              onChange={(e) => handleFilterChange('bookingStatus', e.target.value)}
            >
              <option value="AllStatuses">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Payment Status</label>
            <select 
              className="filter-select"
              value={uiFilters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            >
              <option value="AllStatuses">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PARTIALLY PAID">Partially Paid</option>
              <option value="REFUNDED">Refunded</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Date Range</label>
            <div className="date-range-inputs">
              <div className="date-input-wrapper">
                <FiCalendar className="date-icon" />
                <input 
                  type="date" 
                  className="filter-date-input"
                  placeholder="From"
                  value={uiFilters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div className="date-input-wrapper" style={{ marginTop: '8px' }}>
                <FiCalendar className="date-icon" />
                <input 
                  type="date" 
                  className="filter-date-input"
                  placeholder="To"
                  value={uiFilters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Event Category</label>
            <select 
              className="filter-select"
              value={uiFilters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">City</label>
            <select 
              className="filter-select"
              value={uiFilters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              {cities.map((city, i) => (
                <option key={i} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select 
              className="filter-select"
              value={uiFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="Most Recent">Most Recent</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Price: Low to High">Price: Low to High</option>
            </select>
          </div>

          <button 
            type="button" 
            className="apply-filters-btn"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </aside>

        {/* Right Column: Bookings list */}
        <main className="bookings-list-content">
          {loading ? (
            <div className="bookings-loading-state">
              <div className="spinner" />
              <p>Fetching your bookings...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bookings-empty-state">
              <div className="empty-icon-wrapper">
                <FiSearch size={32} color="#94a3b8" />
              </div>
              <h3>No Bookings Found</h3>
              <p>Try modifying your filter settings to view other orders.</p>
              <button 
                type="button" 
                className="reset-filters-btn-accent"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`orders-layout-container ${isGridView ? 'grid' : 'list'}`}>
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const refData = referenceState[order.id] || {
                  inspirationPhotos: [],
                  sampleReels: [],
                  videoLink: '',
                  creativeNotes: '',
                  shared: false
                };
                
                const bStyle = getBookingStatusStyle(order.bookingStatus);
                const pStyle = getPaymentStatusStyle(order.paymentStatus);

                return (
                  <div 
                    key={order.id} 
                    className={`order-card-wrapper ${isExpanded ? 'expanded' : ''}`}
                  >
                    {/* Main Card Content */}
                    <div className="order-card-main">
                      {/* Left: Thumbnail Image */}
                      <div className="card-thumbnail-section">
                        <img 
                          src={order.image} 
                          alt={order.eventName} 
                          className="card-thumbnail"
                        />
                      </div>

                      {/* Middle: Details */}
                      <div className="card-details-section">
                        <span className="card-order-number">{order.orderNumber}</span>
                        <h3 className="card-event-name">{order.eventName}</h3>
                        
                        <div className="card-meta-info-row">
                          <span className="meta-info-item">
                            <FiCalendar size={13} className="meta-icon" />
                            {order.dateTime}
                          </span>
                          <span className="meta-info-item">
                            <FiMapPin size={13} className="meta-icon" />
                            {order.location}
                          </span>
                        </div>

                        <span className="card-package-tag">{order.packageName}</span>
                      </div>

                      {/* Status Badges Section */}
                      <div className="card-status-section">
                        <span 
                          className="status-pill"
                          style={{ background: bStyle.bg, color: bStyle.color }}
                        >
                          {order.bookingStatus}
                        </span>
                        <span 
                          className="status-pill"
                          style={{ background: pStyle.bg, color: pStyle.color, marginTop: '6px' }}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      {/* Right: Payment pricing */}
                      <div className="card-pricing-section">
                        <div className="pricing-col">
                          <span className="price-label">Paid</span>
                          <span className="price-value paid">
                            ₹{order.paidAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="pricing-col">
                          <span className="price-label">Due</span>
                          <span className="price-value due">
                            ₹{order.dueAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Far Right: Actions */}
                      <div className="card-actions-section">
                        {/* Photographer info */}
                        {/* <div className="photographer-team-info">
                          <div className="avatar-stack">
                            {order.avatars.slice(0, 3).map((av, index) => (
                              <img 
                                key={index}
                                src={av} 
                                alt="photographer" 
                                className="stacked-avatar"
                                style={{ zIndex: 3 - index }}
                              />
                            ))}
                            {order.avatars.length > 3 && (
                              <div className="stacked-avatar-more">
                                +{order.avatars.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="team-name">{order.teamName}</span>
                        </div> */}

                        <div className="button-group">
                          <button 
                            type="button" 
                            className="view-details-action-btn"
                            onClick={() => navigate(`/booking-summary?orderId=${order.id}`)}
                          >
                            <FiEye size={14} style={{ marginRight: '6px' }} />
                            View Details
                          </button>

                          <button 
                            type="button" 
                            className={`expand-toggle-btn ${isExpanded ? 'active' : ''}`}
                            onClick={() => toggleExpand(order.id)}
                            title={isExpanded ? "Collapse" : "Share References"}
                          >
                            {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Section: Share references */}
                    {isExpanded && (
                      <div className="expanded-reference-section">
                        <div className="reference-section-header">
                          <div>
                            <h4 className="reference-title">Share Your References</h4>
                            <p className="reference-desc">
                              Help your photographer understand your vision by sharing inspiration and notes.
                            </p>
                          </div>

                          <div className="reference-status-badge">
                            <span className={`badge-dot ${refData.shared ? 'active' : ''}`} />
                            <span>{refData.shared ? 'Shared with photographer' : 'Not shared yet'}</span>
                          </div>
                        </div>

                        <div className="reference-content-grid">
                          {/* Col 1: Inspiration Photos */}
                          <div className="reference-col">
                            <h5 className="col-title">Inspiration Photos</h5>
                            <span className="col-hint">Upload reference images (Max 10 images, up to 10MB each)</span>

                            <label className="drag-drop-uploader">
                              <input 
                                type="file" 
                                accept="image/*" 
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileDrop(order.id, e.target.files, 'image')}
                                disabled={refData.shared}
                              />
                              <FiUploadCloud size={24} color="#a8a29e" />
                              <p className="drag-drop-text">Drag & drop images here</p>
                              <span className="browse-files-trigger">Browse Files</span>
                            </label>

                            {/* Image thumbnails list */}
                            {refData.inspirationPhotos.length > 0 && (
                              <div className="uploaded-list-progress">
                                <span className="upload-counter">
                                  Uploaded ({refData.inspirationPhotos.length}/10)
                                </span>
                                <div className="thumbnails-grid">
                                  {refData.inspirationPhotos.map((photo) => (
                                    <div key={photo.id} className="thumbnail-card">
                                      <img src={photo.previewUrl} alt="preview" />
                                      {photo.uploading && (
                                        <div className="thumbnail-upload-overlay">
                                          <div className="progress-circle">
                                            <span>{photo.progress}%</span>
                                          </div>
                                        </div>
                                      )}
                                      {!refData.shared && (
                                        <button 
                                          type="button" 
                                          className="remove-thumb-btn"
                                          onClick={() => removePhotoReference(order.id, photo.id)}
                                        >
                                          <FiX size={12} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Col 2: Reels / Videos */}
                          <div className="reference-col">
                            <h5 className="col-title">Sample Reels / Videos</h5>
                            <span className="col-hint">Upload short video or paste Instagram / YouTube link</span>

                            {refData.sampleReels.length === 0 ? (
                              <label className="drag-drop-uploader">
                                <input 
                                  type="file" 
                                  accept="video/*" 
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleFileDrop(order.id, e.target.files, 'video')}
                                  disabled={refData.shared}
                                />
                                <FiUploadCloud size={24} color="#a8a29e" />
                                <p className="drag-drop-text">Drag & drop video (Max 100MB)</p>
                                <span className="browse-files-trigger">Upload Video</span>
                              </label>
                            ) : (
                              <div className="uploaded-video-card">
                                <div className="video-info">
                                  <span className="video-name">{refData.sampleReels[0].name}</span>
                                  <span className="video-size">{refData.sampleReels[0].size}</span>
                                  <span className="video-status-text">
                                    {refData.sampleReels[0].uploading ? `Uploading ${refData.sampleReels[0].progress}%` : 'Uploaded'}
                                  </span>
                                </div>
                                {refData.sampleReels[0].uploading && (
                                  <div className="video-progress-bar">
                                    <div 
                                      className="video-progress-fill" 
                                      style={{ width: `${refData.sampleReels[0].progress}%` }}
                                    />
                                  </div>
                                )}
                                {!refData.shared && (
                                  <button 
                                    type="button"
                                    className="remove-video-btn"
                                    onClick={() => removeVideoReference(order.id)}
                                  >
                                    <FiX size={14} />
                                  </button>
                                )}
                              </div>
                            )}

                            <div className="or-divider">
                              <span>OR</span>
                            </div>

                            <div className="link-input-wrapper">
                              <FiLink className="input-link-icon" />
                              <input 
                                type="url" 
                                className="video-link-input"
                                placeholder="Paste Instagram or YouTube link here"
                                value={refData.videoLink}
                                onChange={(e) => handleVideoLinkChange(order.id, e.target.value)}
                                disabled={refData.shared}
                              />
                            </div>
                          </div>

                          {/* Col 3: Creative Notes */}
                          <div className="reference-col">
                            <h5 className="col-title">Creative Notes / Expectations</h5>
                            <span className="col-hint">Share your ideas, must-have shots, moods, colors, etc.</span>

                            <textarea 
                              className="creative-notes-textarea"
                              placeholder="Describe your creative notes or shot expectations here..."
                              value={refData.creativeNotes}
                              onChange={(e) => handleNotesChange(order.id, e.target.value)}
                              disabled={refData.shared}
                              maxLength={1000}
                              rows={5}
                            />
                            
                            <div className="character-count-row">
                              <span>{refData.creativeNotes.length} / 1000 characters</span>
                            </div>
                          </div>
                        </div>

                        {/* Submit Row */}
                        <div className="reference-submit-row">
                          <button
                            type="button"
                            className="send-photographer-btn"
                            onClick={() => sendReferenceToPhotographer(order.id)}
                            disabled={refData.shared || refData.sending}
                          >
                            <FiSend size={14} style={{ marginRight: '8px' }} />
                            {refData.sending ? 'Sending...' : refData.shared ? 'Sent to Photographer' : 'Send to Photographer'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Styled JSX (incorporating premium aesthetics, clean shadows, smooth transitions, and exact styling matching the screenshot) */}
      <style>{`
        .bookings-page-container {
          width: 100%;
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
          color: #1e293b;
        }

        .bookings-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .bookings-title {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }

        .bookings-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .bookings-meta-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .bookings-count-label {
          font-size: 13.5px;
          color: #64748b;
          font-weight: 500;
        }

        .view-toggle-buttons {
          display: flex;
          background: #f1f5f9;
          padding: 3px;
          border-radius: 8px;
        }

        .toggle-btn {
          background: transparent;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          color: #64748b;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }

        .toggle-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .bookings-layout-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 28px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .bookings-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Sidebar Uploader and Filters styles */
        .filters-sidebar {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          position: sticky;
          top: 24px;
        }

        .filters-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .filters-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .reset-filters-btn {
          background: none;
          border: none;
          color: #64748b;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .reset-filters-btn:hover {
          color: #ef4444;
        }

        .filter-group {
          margin-bottom: 16px;
        }

        .filter-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .filter-select {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13.5px;
          color: #1e293b;
          background: #ffffff;
          outline: none;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .filter-select:focus {
          border-color: #E8A317;
        }

        .date-range-inputs {
          display: flex;
          flex-direction: column;
        }

        .date-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .date-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .filter-date-input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13px;
          color: #1e293b;
          outline: none;
          font-family: inherit;
        }

        .apply-filters-btn {
          width: 100%;
          background: #E8A317;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.2s, transform 0.1s;
        }

        .apply-filters-btn:hover {
          background: #d69110;
        }

        .apply-filters-btn:active {
          transform: scale(0.98);
        }

        /* Loading & Empty States */
        .bookings-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          color: #64748b;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top-color: #E8A317;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .bookings-empty-state {
          text-align: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 48px;
        }

        .empty-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .bookings-empty-state h3 {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .bookings-empty-state p {
          margin: 0 0 20px;
          font-size: 14px;
          color: #64748b;
        }

        .reset-filters-btn-accent {
          background: #E8A317;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .reset-filters-btn-accent:hover {
          background: #d69110;
        }

        /* Orders Container Grid / List layouts */
        .orders-layout-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .orders-layout-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .order-card-wrapper {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .order-card-wrapper:hover {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
          border-color: #cbd5e1;
        }

        .order-card-wrapper.expanded {
          border-color: #E8A317;
          box-shadow: 0 12px 24px rgba(232, 163, 23, 0.06);
        }

        .order-card-main {
          display: flex;
          padding: 18px;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .grid .order-card-main {
          flex-direction: column;
          align-items: stretch;
        }

        /* Thumbnail Image layout */
        .card-thumbnail-section {
          width: 90px;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .grid .card-thumbnail-section {
          width: 100%;
          height: 180px;
        }

        .card-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Details layout */
        .card-details-section {
          flex: 2;
          min-width: 200px;
        }

        .grid .card-details-section {
          min-width: 0;
          margin-top: 12px;
        }

        .card-order-number {
          font-family: monospace;
          font-size: 11.5px;
          color: #94a3b8;
          display: block;
          margin-bottom: 2px;
        }

        .card-event-name {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
        }

        .card-meta-info-row {
          display: flex;
          gap: 14px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .meta-info-item {
          display: flex;
          align-items: center;
          font-size: 12.5px;
          color: #64748b;
        }

        .meta-icon {
          margin-right: 5px;
          color: #94a3b8;
        }

        .card-package-tag {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          padding: 3px 8px;
          border-radius: 6px;
          display: inline-block;
        }

        /* Status Pills */
        .card-status-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex-shrink: 0;
        }

        .grid .card-status-section {
          flex-direction: row;
          gap: 8px;
          margin-top: 8px;
        }

        .status-pill {
          font-size: 10.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* Pricing layout */
        .card-pricing-section {
          display: flex;
          gap: 20px;
          border-left: 1px solid #f1f5f9;
          border-right: 1px solid #f1f5f9;
          padding: 0 20px;
          flex-shrink: 0;
        }

        .grid .card-pricing-section {
          border-left: none;
          border-right: none;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          padding: 12px 0;
          margin-top: 12px;
          justify-content: space-between;
        }

        .pricing-col {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .price-value {
          font-size: 16px;
          font-weight: 800;
        }

        .price-value.paid {
          color: #0d9488;
        }

        .price-value.due {
          color: #334155;
        }

        /* Far Right Actions section */
        .card-actions-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          margin-left: auto;
          flex-shrink: 0;
        }

        .grid .card-actions-section {
          align-items: stretch;
          margin-left: 0;
          margin-top: 12px;
        }

        .photographer-team-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .avatar-stack {
          display: flex;
          align-items: center;
        }

        .stacked-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          object-fit: cover;
          margin-right: -8px;
        }

        .stacked-avatar-more {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          background: #f1f5f9;
          color: #475569;
          font-size: 9px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
        }

        .team-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
        }

        .button-group {
          display: flex;
          gap: 8px;
        }

        .view-details-action-btn {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          color: #475569;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
          font-family: inherit;
        }

        .view-details-action-btn:hover {
          border-color: #cbd5e1;
          color: #0f172a;
          background: #f8fafc;
        }

        .expand-toggle-btn {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          color: #64748b;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .expand-toggle-btn.active {
          background: #FFF3D6;
          border-color: #E8A317;
          color: #E8A317;
        }

        .expand-toggle-btn:hover:not(.active) {
          border-color: #cbd5e1;
          color: #0f172a;
        }

        /* Expanded section styles */
        .expanded-reference-section {
          border-top: 1px solid #f1f5f9;
          background: #fafaf9;
          padding: 24px;
        }

        .reference-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .reference-title {
          font-size: 15px;
          font-weight: 800;
          color: #1c1917;
          margin: 0 0 3px;
        }

        .reference-desc {
          font-size: 12.5px;
          color: #78716c;
          margin: 0;
        }

        .reference-status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #78716c;
          background: #f5f5f4;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d97706; /* orange */
        }

        .badge-dot.active {
          background: #0d9488; /* green */
        }

        .reference-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .reference-content-grid {
            grid-template-columns: 1fr;
          }
        }

        .reference-col {
          display: flex;
          flex-direction: column;
        }

        .col-title {
          font-size: 13px;
          font-weight: 700;
          color: #292524;
          margin: 0 0 3px;
        }

        .col-hint {
          font-size: 11px;
          color: #a8a29e;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        /* File Uploaders */
        .drag-drop-uploader {
          border: 1.5px dashed #d6d3d1;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          background: #ffffff;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .drag-drop-uploader:hover {
          border-color: #E8A317;
          background: #fffdf9;
        }

        .drag-drop-text {
          font-size: 12.5px;
          color: #78716c;
          margin: 8px 0 4px;
        }

        .browse-files-trigger {
          font-size: 12px;
          font-weight: 700;
          color: #E8A317;
          text-decoration: underline;
        }

        /* Previews grids */
        .uploaded-list-progress {
          margin-top: 14px;
        }

        .upload-counter {
          font-size: 11px;
          font-weight: 700;
          color: #78716c;
          margin-bottom: 8px;
          display: block;
        }

        .thumbnails-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .thumbnail-card {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          border: 1px solid #e7e5e4;
        }

        .thumbnail-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-upload-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-circle {
          font-size: 10px;
          font-weight: 700;
          color: #d97706;
        }

        .remove-thumb-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          background: rgba(0, 0, 0, 0.5);
          color: #ffffff;
          border: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
        }

        /* Video card preview */
        .uploaded-video-card {
          background: #ffffff;
          border: 1px solid #e7e5e4;
          border-radius: 10px;
          padding: 10px 14px;
          position: relative;
        }

        .video-info {
          display: flex;
          flex-direction: column;
        }

        .video-name {
          font-size: 13px;
          font-weight: 700;
          color: #292524;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 18px;
        }

        .video-size {
          font-size: 11px;
          color: #78716c;
          margin-top: 1px;
        }

        .video-status-text {
          font-size: 11px;
          font-weight: 600;
          color: #0d9488;
          margin-top: 4px;
        }

        .video-progress-bar {
          height: 3px;
          background: #f5f5f4;
          border-radius: 2px;
          margin-top: 8px;
          overflow: hidden;
        }

        .video-progress-fill {
          height: 100%;
          background: #E8A317;
          transition: width 0.2s ease;
        }

        .remove-video-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          color: #a8a29e;
          cursor: pointer;
          padding: 0;
        }

        .remove-video-btn:hover {
          color: #ef4444;
        }

        .or-divider {
          text-align: center;
          margin: 14px 0;
          position: relative;
        }

        .or-divider::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: #e7e5e4;
          z-index: 0;
        }

        .or-divider span {
          background: #fafaf9;
          padding: 0 10px;
          font-size: 11px;
          font-weight: 700;
          color: #a8a29e;
          position: relative;
          z-index: 1;
        }

        .link-input-wrapper {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid #e7e5e4;
          border-radius: 10px;
          padding: 8px 12px;
        }

        .input-link-icon {
          color: #a8a29e;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .video-link-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 13px;
          color: #292524;
          background: transparent;
          font-family: inherit;
        }

        /* Creative Notes area */
        .creative-notes-textarea {
          width: 100%;
          border: 1.5px solid #e7e5e4;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          color: #292524;
          outline: none;
          resize: none;
          background: #ffffff;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .creative-notes-textarea:focus {
          border-color: #E8A317;
        }

        .character-count-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
          font-size: 11.5px;
          color: #a8a29e;
          font-weight: 500;
        }

        /* Submit references button row */
        .reference-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .send-photographer-btn {
          background: #E8A317;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .send-photographer-btn:hover:not(:disabled) {
          background: #d69110;
        }

        .send-photographer-btn:disabled {
          background: #f5f5f4;
          color: #a8a29e;
          cursor: not-allowed;
        }

        /* Toast Alert box styling */
        .toast-alert {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0f172a;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 10000;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
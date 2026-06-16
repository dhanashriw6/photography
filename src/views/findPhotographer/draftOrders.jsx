import React, { useEffect, useState } from 'react';
import ViewsLayout from '../Layout';
import { getDraftOrders } from '../../services/order';
import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiFileText,
    FiArrowRight
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const DraftOrders = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [draftOrders, setDraftOrders] = useState([]);

    const fetchDraftOrders = async () => {
        try {
            setLoading(true);
            const res = await getDraftOrders();
            setDraftOrders(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDraftOrders();
    }, []);

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <ViewsLayout>
            <div
                style={{
                    minHeight: '100vh',
                    background: '#f8f8f8',
                    padding: '40px 24px',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '30px',
                            fontWeight: 800,
                            marginBottom: '8px',
                            color: '#1a1a1a',
                        }}
                    >
                        Draft Orders
                    </h1>

                    <p
                        style={{
                            color: '#777',
                            marginBottom: '30px',
                            fontSize: '14px',
                        }}
                    >
                        Continue where you left off.
                    </p>

                    {loading ? (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '300px',
                            }}
                        >
                            Loading drafts...
                        </div>
                    ) : draftOrders.length === 0 ? (
                        <div
                            style={{
                                background: '#fff',
                                borderRadius: '16px',
                                padding: '50px',
                                textAlign: 'center',
                            }}
                        >
                            <h3>No Draft Orders Found</h3>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                               gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                                gap: '20px',
                                width: '100%',
                            }}
                        >
                            {draftOrders.map((order) => (
                                <div
                                    key={order.id}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '18px',
                                        padding: '18px',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
                                        border: '1px solid #f1f1f1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {/* Header */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '18px',
                                            gap: '10px',
                                        }}
                                    >
                                        <div style={{ minWidth: 0 }}>
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    fontSize: '18px',
                                                    fontWeight: 700,
                                                    color: '#1a1a1a',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {order.event_name}
                                            </h3>
                                            <p
                                                style={{
                                                    margin: '6px 0 0',
                                                    fontSize: '12px',
                                                    color: '#888',
                                                }}
                                            >
                                                {order.order_number}
                                            </p>
                                        </div>

                                        <span
                                            style={{
                                                background: '#FFF4D6',
                                                color: '#B7791F',
                                                padding: '6px 12px',
                                                borderRadius: '999px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* Event Date */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '12px',
                                        }}
                                    >
                                        <FiCalendar color="#E8A317" style={{ flexShrink: 0 }} />
                                        <span style={{ fontSize: '14px', color: '#555' }}>
                                            {formatDate(order.event_date)}
                                        </span>
                                    </div>

                                    {/* Event Time */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '12px',
                                        }}
                                    >
                                        <FiClock color="#E8A317" style={{ flexShrink: 0 }} />
                                        <span style={{ fontSize: '14px', color: '#555' }}>
                                            {formatTime(order.event_start_at)} – {formatTime(order.event_end_at)}
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px',
                                            marginBottom: '18px',
                                        }}
                                    >
                                        <FiMapPin
                                            color="#E8A317"
                                            style={{ marginTop: '3px', flexShrink: 0 }}
                                        />
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                color: '#555',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {order.location_label}
                                        </span>
                                    </div>

                                    {/* Pricing */}
                                    <div
                                        style={{
                                            borderTop: '1px solid #f2f2f2',
                                            paddingTop: '16px',
                                            marginBottom: '18px',
                                        }}
                                    >
                                        {/* <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            <span style={{ color: '#777', fontSize: '14px' }}>
                                                Subtotal
                                            </span>
                                            <strong>
                                                ₹{Number(order.subtotal).toLocaleString('en-IN')}
                                            </strong>
                                        </div> */}

                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <span style={{ color: '#1a1a1a', fontWeight: 600 }}>
                                                Total
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '18px',
                                                    fontWeight: 800,
                                                    color: '#E8A317',
                                                }}
                                            >
                                                ₹{Number(order.total_amount).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Created */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '18px',
                                            color: '#888',
                                            fontSize: '12px',
                                        }}
                                    >
                                        <FiFileText />
                                        Created on {formatDate(order.created_at)}
                                    </div>

                                    {/* Action Button — pinned to bottom */}
                                    <div style={{ marginTop: 'auto' }}>
                                        <button
                                            onClick={() =>
                                                navigate('/requestBook', {
                                                    state: { orderId: order.id },
                                                })
                                            }
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                background: '#E8A317',
                                                color: '#fff',
                                                padding: '12px',
                                                borderRadius: '10px',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            Continue Draft
                                            <FiArrowRight />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ViewsLayout>
    );
};

export default DraftOrders;
import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Package, Calendar } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    
    const orderId = useMemo(() => {
        return location.state?.orderId || `SG-${Math.floor(100000 + Math.random() * 900000)}`;
    }, [location.state?.orderId]);

    const displayId = useMemo(() => {
        return typeof orderId === 'string' && orderId.length > 8 ? orderId.substring(0, 8).toUpperCase() : orderId;
    }, [orderId]);
    
    const deliveryDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date;
    }, []);

    return (
        <div style={{ minHeight: '90vh', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
            <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
                <div style={{ marginBottom: '3rem', position: 'relative', display: 'inline-block' }}>
                    <div style={{ background: '#F0FDFA', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                        <CheckCircle size={60} color="#0D9488" />
                    </div>
                    {/* Decorative bits */}
                    <div style={{ position: 'absolute', top: '10px', right: '-20px', background: 'var(--primary)', width: '20px', height: '20px', borderRadius: '50%' }}></div>
                </div>

                <h1 style={{ fontSize: '3rem', fontWeight: '950', letterSpacing: '-2px', color: '#111', marginBottom: '1.5rem' }}>Success! Order Placed.</h1>
                <p style={{ color: '#666', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '3rem' }}>
                    Thank you for your purchase. We've received your order and our artisans are now preparing your luxury goods.
                </p>

                <div style={{ background: '#F9FAFB', padding: '2.5rem', borderRadius: '16px', border: '1px solid #EEE', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left', marginBottom: '4rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#999', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px' }}>
                            <Package size={14} /> ORDER NUMBER
                        </div>
                        <p style={{ fontWeight: '950', fontSize: '1.2rem', color: '#111', margin: 0 }}>{displayId}</p>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#999', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px' }}>
                            <Calendar size={14} /> ESTIMATED DELIVERY
                        </div>
                        <p style={{ fontWeight: '950', fontSize: '1.2rem', color: '#111', margin: 0 }}>{deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <Link to="/dashboard?tab=order-history" style={{ flex: 1, textDecoration: 'none' }}>
                        <button style={{ width: '100%', padding: '20px', background: '#111', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <ShoppingBag size={18} /> TRACK ORDER
                        </button>
                    </Link>
                    <Link to="/products" style={{ flex: 1, textDecoration: 'none' }}>
                        <button style={{ width: '100%', padding: '20px', background: 'transparent', color: '#111', border: '2px solid #EEE', borderRadius: '8px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            CONTINUE SHOPPING <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>

                <p style={{ marginTop: '5rem', fontSize: '13px', color: '#AAA', fontWeight: '700' }}>
                    A confirmation email has been sent to your registered address.
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;

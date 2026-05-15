import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';
import { ShoppingBag, User, MapPin, Package, Bell, Settings, LogOut, Heart, Clock, CheckCircle, ChevronRight, FileText, CreditCard, Star, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api/api';
import api from '../api/api';

const UserDashboard = () => {
    const { user, logout, updateProfile } = useAuth();
    const { cart, wishlist, removeFromCart, updateQuantity, cartTotal, toggleWishlist, addToCart } = useCart();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState([]);
    const location = useLocation();
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const ProfessionalInvoice = ({ order, onClose }) => {
        if (!order) return null;
        const subtotal = order.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const shipping = 100;

        const handleDownloadPDF = () => {
            const element = document.getElementById('printable-invoice');
            const opt = {
                margin: 0.5,
                filename: `StyleGen_Invoice_${order._id.slice(-6).toUpperCase()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        };

        return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={onClose}>
                <style>
                    {`
                        @media print {
                            /* Hide all dashboard elements */
                            aside, nav, header, footer, .no-print { 
                                display: none !important; 
                            }
                            
                            /* Reset layout for print */
                            body, html { 
                                background: #FFF !important; 
                                margin: 0 !important; 
                                padding: 0 !important; 
                            }
                            
                            /* Target the modal container and reset it */
                            div[style*="position: fixed"] { 
                                position: static !important; 
                                background: none !important; 
                                padding: 0 !important; 
                                display: block !important;
                            }
                            
                            /* Target the invoice card and reset it */
                            div[style*="max-width: 800px"] { 
                                max-width: 100% !important; 
                                border: none !important; 
                                boxShadow: none !important;
                                margin: 0 !important;
                            }
                            
                            /* Ensure the printable area is visible */
                            #printable-invoice { 
                                padding: 0 !important; 
                                max-height: none !important; 
                                overflow: visible !important;
                                display: block !important;
                            }
                        }
                    `}
                </style>
                <div style={{ background: '#FFF', width: '100%', maxWidth: '800px', borderRadius: '16px', overflow: 'hidden', position: 'relative', margin: '1rem' }} onClick={e => e.stopPropagation()}>
                    {/* Header Controls */}
                    <div className="no-print" style={{ background: '#FBFBFC', padding: '1.5rem 3rem', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: '950', fontSize: '1.1rem' }}>Invoice Details</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleDownloadPDF} style={{ padding: '8px 20px', background: '#111', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>Download PDF</button>
                            <button onClick={onClose} style={{ padding: '8px 20px', background: '#EEE', color: '#666', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>

                    <div style={{ padding: '2rem', maxHeight: '80vh', overflowY: 'auto' }} id="printable-invoice">
                        {/* Brand Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '5px' }}>StyleGen</h1>
                                <p style={{ fontSize: '12px', color: '#FF4D1C', fontWeight: '900', letterSpacing: '2px' }}>ARTISAN LEATHER GOODS</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '950', color: '#EEE', marginBottom: '10px' }}>INVOICE</h2>
                                <p style={{ fontWeight: '800', fontSize: '14px' }}>#INV-{order._id.slice(-6).toUpperCase()}</p>
                                <p style={{ color: '#999', fontSize: '13px' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
                            <div>
                                <h4 style={{ fontSize: '11px', fontWeight: '900', color: '#999', marginBottom: '1.5rem', letterSpacing: '1px' }}>BILLED TO</h4>
                                <p style={{ fontWeight: '950', fontSize: '1.1rem', marginBottom: '5px' }}>{user?.name}</p>
                                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>{user?.email}</p>
                                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>{order.shippingAddress?.phone}</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '11px', fontWeight: '900', color: '#999', marginBottom: '1.5rem', letterSpacing: '1px' }}>SHIPPING ADDRESS</h4>
                                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>{order.shippingAddress?.address}</p>
                                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>Postal Code: {order.shippingAddress?.postalCode}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #111' }}>
                                    <th style={{ padding: '15px 0', textAlign: 'left', fontSize: '12px', fontWeight: '900' }}>PRODUCT</th>
                                    <th style={{ padding: '15px 0', textAlign: 'center', fontSize: '12px', fontWeight: '900' }}>QTY</th>
                                    <th style={{ padding: '15px 0', textAlign: 'right', fontSize: '12px', fontWeight: '900' }}>UNIT PRICE</th>
                                    <th style={{ padding: '15px 0', textAlign: 'right', fontSize: '12px', fontWeight: '900' }}>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #EEE' }}>
                                        <td style={{ padding: '20px 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <img src={getImageUrl(item.image, API_URL)} style={{ width: '40px', height: '40px', objectFit: 'contain' }} alt="" />
                                                <span style={{ fontWeight: '800', fontSize: '14px' }}>{item.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '800' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '800' }}>BDT {item.price}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '950' }}>BDT {item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Summary Section */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ width: '250px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span style={{ color: '#999', fontWeight: '700', fontSize: '13px' }}>Subtotal</span>
                                    <span style={{ fontWeight: '900' }}>BDT {subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span style={{ color: '#999', fontWeight: '700', fontSize: '13px' }}>Shipping</span>
                                    <span style={{ fontWeight: '900' }}>BDT {shipping}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #111' }}>
                                    <span style={{ fontWeight: '950', fontSize: '1.1rem' }}>Grand Total</span>
                                    <span style={{ fontWeight: '950', fontSize: '1.4rem', color: '#FF4D1C' }}>BDT {order.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ marginTop: '5rem', textAlign: 'center', borderTop: '1px solid #EEE', paddingTop: '3rem' }}>
                            <p style={{ fontSize: '12px', color: '#999', fontWeight: '700', letterSpacing: '1px' }}>THANK YOU FOR SUPPORTING LOCAL ARTISANS</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
                
                const clearedIds = JSON.parse(localStorage.getItem('user_cleared_notifications') || '[]');
                
                // Generate notifications based on order status
                const newNotifications = data.map(order => ({
                    id: order._id,
                    title: `Order Update: #${order._id.slice(-6).toUpperCase()}`,
                    message: `Your order is currently ${order.status || 'Pending'}`,
                    time: new Date(order.updatedAt).toLocaleTimeString(),
                    type: order.status?.toLowerCase() === 'delivered' ? 'success' : 'info',
                    isRead: false
                })).filter(n => !clearedIds.includes(n.id));
                
                setNotifications(newNotifications);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const res = await updateProfile(profile);
    };

    const handleMarkAllRead = () => {
        const clearedIds = JSON.parse(localStorage.getItem('user_cleared_notifications') || '[]');
        const newClearedIds = [...new Set([...clearedIds, ...notifications.map(n => n.id)])];
        localStorage.setItem('user_cleared_notifications', JSON.stringify(newClearedIds));
        setNotifications([]);
        setShowNotifications(false);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const sidebarItems = [
        { id: 'back-to-shop', name: 'Back to Shop', icon: <ChevronRight size={18} />, action: 'navigate' },
        { id: 'dashboard', name: 'Dashboard', icon: <Clock size={18} /> },
        { id: 'my-cart', name: 'My Shopping Cart', icon: <ShoppingCart size={18} /> },
        { id: 'my-wishlist', name: 'My Wishlist', icon: <Heart size={18} /> },
        { id: 'order-history', name: 'Order History', icon: <ShoppingBag size={18} /> },
        { id: 'track-orders', name: 'Track Orders', icon: <MapPin size={18} /> },
        { id: 'invoices', name: 'Invoices', icon: <FileText size={18} /> },
        { id: 'profile-settings', name: 'Profile Settings', icon: <User size={18} /> },
    ];

    return (
        <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', background: '#FBFBFC' }}>
            {showInvoice && <ProfessionalInvoice order={selectedOrder} onClose={() => setShowInvoice(false)} />}
            {/* SIDEBAR */}
            <aside className="dashboard-sidebar" style={{ width: '280px', background: '#FFF', padding: '2.5rem 1.5rem', borderRight: '1px solid #F1F1F1' }}>
                <div style={{ padding: '0 1rem 3.5rem' }}>
                    <h2 style={{ fontSize: '1.6rem', color: '#000', fontWeight: '950', letterSpacing: '-1.5px' }}>StyleGen</h2>
                    <p style={{ fontSize: '10px', color: '#FF4D1C', fontWeight: '900', letterSpacing: '1.5px', marginTop: '5px' }}>USER ACCOUNT</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.action === 'navigate' ? window.location.href = '/' : setActiveTab(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '14px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                background: item.id === 'back-to-shop' ? '#111' : (activeTab === item.id ? '#FF4D1C' : 'transparent'),
                                color: (item.id === 'back-to-shop' || activeTab === item.id) ? '#FFF' : '#666',
                                fontWeight: '800',
                                transition: '0.3s',
                                fontSize: '14px',
                                textAlign: 'left',
                                marginBottom: item.id === 'back-to-shop' ? '1.5rem' : '0'
                            }}
                        >
                            {item.icon}
                            {item.name}
                        </button>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '4rem' }}>
                    <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '14px 20px', background: 'none', border: 'none', color: '#EF4444', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="dashboard-main" style={{ flex: 1, padding: '4rem 5rem' }}>
                <header className="dashboard-header" style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-1.5px', color: '#111', marginBottom: '10px' }}>
                            {activeTab === 'dashboard' ? `Welcome back, ${user?.name || 'Artisan'}` :
                                activeTab === 'order-history' ? 'Order History' :
                                    activeTab === 'invoices' ? 'Your Invoices' :
                                        activeTab === 'my-cart' ? 'My Shopping Cart' :
                                            activeTab === 'my-wishlist' ? 'My Wishlist' :
                                                activeTab === 'profile-settings' ? 'Account Settings' : 'Track Order'}
                        </h1>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>Manage your artisanal lifestyle and track your luxury purchases.</p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{ background: '#FFF', border: '1px solid #F1F1F1', padding: '12px', borderRadius: '12px', cursor: 'pointer', position: 'relative' }}
                        >
                            <Bell size={20} color="#111" />
                            {notifications.filter(n => !n.isRead).length > 0 && (
                                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#FF4D1C', color: '#FFF', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', border: '2px solid #FFF' }}>
                                    {notifications.filter(n => !n.isRead).length}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div style={{ position: 'absolute', top: '60px', right: 0, width: '320px', background: '#FFF', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #F1F1F1', zIndex: 100, overflow: 'hidden' }}>
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid #F1F1F1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontWeight: '950' }}>Notifications</h4>
                                    <span 
                                        onClick={handleMarkAllRead}
                                        style={{ fontSize: '11px', color: '#FF4D1C', fontWeight: '900', cursor: 'pointer' }}
                                    >
                                        MARK ALL AS READ
                                    </span>
                                </div>
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {notifications.length > 0 ? notifications.map(notif => (
                                        <div key={notif.id} style={{ padding: '1.5rem', borderBottom: '1px solid #F9FAFB', cursor: 'pointer' }}>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: notif.type === 'success' ? '#10B981' : '#3B82F6', marginTop: '5px' }}></div>
                                                <div>
                                                    <h5 style={{ margin: '0 0 5px 0', fontWeight: '800', fontSize: '13px' }}>{notif.title}</h5>
                                                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px', lineHeight: '1.4' }}>{notif.message}</p>
                                                    <span style={{ fontSize: '10px', color: '#AAA', fontWeight: '700' }}>{notif.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#999' }}>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>No new notifications</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>
                
                {/* CART TAB */}
                {activeTab === 'my-cart' && (
                    <div className="fade-in">
                        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F1F1F1', padding: '2rem' }}>
                            {cart.length > 0 ? (
                                <>
                                    {cart.map(item => (
                                        <div key={item._id} style={{ display: 'flex', gap: '20px', padding: '1.5rem', borderBottom: '1px solid #F3F4F6', alignItems: 'center' }}>
                                            <img src={getImageUrl(item.image, API_URL)} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} alt="" />
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: 0, fontWeight: '900' }}>{item.name}</h4>
                                                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '13px' }}>Price: BDT {item.price}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #EEE' }}>
                                                <button onClick={() => updateQuantity(item._id, -1)} style={{ padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer' }}><Minus size={14} /></button>
                                                <span style={{ padding: '0 10px', fontWeight: '900' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, 1)} style={{ padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer' }}><Plus size={14} /></button>
                                            </div>
                                            <div style={{ width: '120px', textAlign: 'right' }}>
                                                <p style={{ fontWeight: '950', margin: 0 }}>BDT {item.price * item.quantity}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item._id)} style={{ border: 'none', background: 'transparent', color: '#CCC', cursor: 'pointer', padding: '10px' }}><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: '2rem', textAlign: 'right', padding: '2rem', background: '#FBFBFC', borderRadius: '12px' }}>
                                        <p style={{ color: '#999', fontSize: '14px', fontWeight: '800', margin: '0 0 5px 0' }}>ESTIMATED TOTAL</p>
                                        <h2 style={{ fontSize: '2rem', fontWeight: '950', margin: 0 }}>BDT {cartTotal}</h2>
                                        <button className="btn-primary" style={{ marginTop: '1.5rem', padding: '15px 40px' }} onClick={() => window.location.href = '/checkout'}>PROCEED TO CHECKOUT</button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '4rem' }}>
                                    <ShoppingCart size={48} color="#EEE" style={{ marginBottom: '1rem' }} />
                                    <p style={{ color: '#999', fontWeight: '700' }}>Your cart is empty.</p>
                                    <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => window.location.href = '/products'}>Go Shopping</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* WISHLIST TAB */}
                {activeTab === 'my-wishlist' && (
                    <div className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {wishlist.length > 0 ? wishlist.map(product => (
                                <div key={product._id} style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #F1F1F1', overflow: 'hidden' }}>
                                    <div style={{ height: '200px', position: 'relative' }}>
                                        <img src={getImageUrl(product.image, API_URL)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                        <button 
                                            onClick={() => toggleWishlist(product)}
                                            style={{ position: 'absolute', top: '10px', right: '10px', background: '#FFF', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <h4 style={{ fontWeight: '900', margin: '0 0 5px 0' }}>{product.name}</h4>
                                        <p style={{ color: 'var(--primary)', fontWeight: '950', margin: '0 0 1.5rem 0' }}>BDT {product.price}</p>
                                        <button 
                                            onClick={() => { addToCart(product); toggleWishlist(product); }}
                                            className="btn-primary" 
                                            style={{ width: '100%', padding: '10px', fontSize: '12px' }}
                                        >
                                            MOVE TO CART
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: '#FFF', borderRadius: '16px', border: '1px solid #F1F1F1' }}>
                                    <Heart size={48} color="#EEE" style={{ marginBottom: '1rem' }} />
                                    <p style={{ color: '#999', fontWeight: '700' }}>Your wishlist is empty.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div className="fade-in">
                        <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                            <div style={{ background: '#FFF', padding: '2rem', borderRadius: '12px', border: '1px solid #F1F1F1', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                <div style={{ background: '#FFF5F2', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Package color="#FF4D1C" size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: '950', margin: '0 0 5px 0' }}>{orders.length}</h3>
                                <p style={{ color: '#999', fontWeight: '700', fontSize: '13px', margin: 0 }}>TOTAL ORDERS</p>
                            </div>
                            <div style={{ background: '#F0FDFA', padding: '2rem', borderRadius: '12px', border: '1px solid #F1F1F1', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                <div style={{ background: '#FFF', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <CheckCircle color="#0D9488" size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: '950', margin: '0 0 5px 0' }}>{orders.filter(o => o.status?.toLowerCase() === 'delivered').length}</h3>
                                <p style={{ color: '#999', fontWeight: '700', fontSize: '13px', margin: 0 }}>DELIVERED</p>
                            </div>
                            <div style={{ background: '#FEFCE8', padding: '2rem', borderRadius: '12px', border: '1px solid #F1F1F1', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                <div style={{ background: '#FFF', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Star color="#CA8A04" size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: '950', margin: '0 0 5px 0' }}>#{orders.length > 5 ? '1' : '5'}</h3>
                                <p style={{ color: '#999', fontWeight: '700', fontSize: '13px', margin: 0 }}>LOYALTY RANK</p>
                            </div>
                        </div>

                        {/* ACTIVE TRACKING SUMMARY */}
                        {orders.length > 0 && orders[0].status?.toLowerCase() !== 'delivered' && (
                            <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '16px', border: '1px solid #F1F1F1', marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h4 style={{ fontWeight: '950', fontSize: '1.1rem' }}>Active Order Tracking</h4>
                                    <span style={{ color: '#FF4D1C', fontWeight: '900', fontSize: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('track-orders')}>VIEW FULL DETAILS</span>
                                </div>
                                <div style={{ position: 'relative', padding: '1rem 0 2rem' }}>
                                    <div style={{ position: 'absolute', top: '25px', left: '0', right: '0', height: '4px', background: '#F1F1F1' }}>
                                        <div style={{ 
                                            width: `${((['pending', 'shipped', 'delivered'].indexOf(orders[0].status?.toLowerCase() || 'pending')) / 2) * 100}%`, 
                                            height: '100%', 
                                            background: '#FF4D1C', 
                                            transition: '1s' 
                                        }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                                        {['Processing', 'Shipped', 'Delivered'].map((step, i) => {
                                            const statusIndex = ['pending', 'shipped', 'delivered'].indexOf(orders[0].status?.toLowerCase() || 'pending');
                                            return (
                                                <div key={i} style={{ textAlign: 'center' }}>
                                                    <div style={{ width: '20px', height: '20px', background: i <= statusIndex ? '#FF4D1C' : '#FFF', border: i <= statusIndex ? 'none' : '2px solid #EEE', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {i <= statusIndex && <CheckCircle size={12} color="#FFF" />}
                                                    </div>
                                                    <p style={{ fontSize: '11px', fontWeight: '900', color: i <= statusIndex ? '#111' : '#AAA' }}>{step}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* RECENT ORDERS TABLE */}
                        <div className="table-container" style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F1F1F1', overflow: 'hidden' }}>
                            <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid #F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontWeight: '950', fontSize: '1.1rem' }}>Recent Order Activity</h4>
                                <button onClick={() => setActiveTab('order-history')} style={{ background: 'none', border: 'none', color: '#666', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>VIEW ALL ORDERS</button>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#FBFBFC' }}>
                                    <tr>
                                        <th style={{ padding: '15px 2.5rem', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#999' }}>ORDER ID</th>
                                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#999' }}>DATE</th>
                                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#999' }}>STATUS</th>
                                        <th style={{ padding: '15px 2.5rem', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#999' }}>TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map(order => (
                                        <tr key={order._id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                            <td style={{ padding: '18px 2.5rem', fontWeight: '900', fontSize: '14px' }}>#{order._id.slice(-6).toUpperCase()}</td>
                                            <td style={{ padding: '18px', color: '#666', fontSize: '13px', fontWeight: '700' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '18px' }}>
                                                <span style={{ 
                                                    padding: '4px 12px', 
                                                    borderRadius: '4px', 
                                                    fontSize: '10px', 
                                                    fontWeight: '900',
                                                    background: order.status?.toLowerCase() === 'delivered' ? '#F0FDFA' : '#FFFBEB',
                                                    color: order.status?.toLowerCase() === 'delivered' ? '#0D9488' : '#F59E0B',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '18px 2.5rem', textAlign: 'right', fontWeight: '950', fontSize: '14px' }}>BDT {order.totalPrice}</td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#999', fontWeight: '700' }}>No recent activity to show.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'order-history' && (
                    <div className="fade-in">
                        <div className="table-container" style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F1F1F1', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#FBFBFC', borderBottom: '1px solid #F1F1F1' }}>
                                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '900', color: '#999' }}>ORDER ID</th>
                                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '900', color: '#999' }}>DATE</th>
                                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '900', color: '#999' }}>ITEMS</th>
                                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '900', color: '#999' }}>TOTAL</th>
                                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '900', color: '#999' }}>STATUS</th>
                                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '900', color: '#999' }}>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? orders.map(order => (
                                        <tr key={order._id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                            <td style={{ padding: '20px', fontWeight: '900', color: '#111' }}>{order._id.substring(0, 8).toUpperCase()}</td>
                                            <td style={{ padding: '20px', color: '#666', fontSize: '14px', fontWeight: '700' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '20px', color: '#666', fontSize: '14px', fontWeight: '700' }}>{order.orderItems?.length || 0} Items</td>
                                            <td style={{ padding: '20px', fontWeight: '950', color: '#111' }}>BDT {order.totalPrice}</td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{
                                                    background: order.status?.toLowerCase() === 'delivered' ? '#F0FDFA' : '#FEFCE8',
                                                    color: order.status?.toLowerCase() === 'delivered' ? '#0D9488' : '#CA8A04',
                                                    padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '900',
                                                    textTransform: 'uppercase'
                                                }}>{order.status || 'Processing'}</span>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <button style={{ border: 'none', background: 'none', color: '#FF4D1C', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>View Details</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#999', fontWeight: '700' }}>No orders found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'track-orders' && (
                    <div className="fade-in">
                        {orders.length > 0 ? (() => {
                            const latestOrder = orders[0];
                            const currentStatus = (latestOrder.status || 'pending').toLowerCase();
                            const statuses = ['pending', 'shipped', 'delivered'];
                            const statusIndex = Math.max(0, statuses.indexOf(currentStatus));
                            const displayId = latestOrder._id.substring(0, 8).toUpperCase();
                            
                            return (
                                <div style={{ background: '#FFF', padding: '3.5rem', borderRadius: '16px', border: '1px solid #F1F1F1' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                                        <div>
                                            <p style={{ color: '#999', fontSize: '13px', fontWeight: '900', marginBottom: '5px' }}>ORDER #{displayId}</p>
                                            <h2 style={{ fontSize: '1.8rem', fontWeight: '950', letterSpacing: '-1px' }}>Latest Order Status</h2>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ 
                                                padding: '8px 18px', 
                                                background: currentStatus === 'delivered' ? '#F0FDFA' : currentStatus === 'shipped' ? '#EFF6FF' : '#FFFBEB', 
                                                color: currentStatus === 'delivered' ? '#0D9488' : currentStatus === 'shipped' ? '#3B82F6' : '#F59E0B', 
                                                borderRadius: '50px', 
                                                fontSize: '13px', 
                                                fontWeight: '900',
                                                textTransform: 'uppercase'
                                            }}>
                                                {currentStatus}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ position: 'relative', padding: '2rem 0 5rem' }}>
                                        <div style={{ position: 'absolute', top: '45px', left: '0', right: '0', height: '4px', background: '#F1F1F1', zIndex: 0 }}>
                                            <div style={{ width: `${(statusIndex / (statuses.length - 1)) * 100}%`, height: '100%', background: '#FF4D1C', transition: '1s' }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                                            {['Processing', 'Shipped', 'Delivered'].map((step, i) => (
                                                <div key={i} style={{ textAlign: 'center' }}>
                                                    <div style={{ width: '26px', height: '26px', background: i <= statusIndex ? '#FF4D1C' : '#FFF', border: i <= statusIndex ? 'none' : '2px solid #EEE', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {i <= statusIndex ? <CheckCircle size={15} color="#FFF" /> : <div style={{ width: '8px', height: '8px', background: '#EEE', borderRadius: '50%' }} />}
                                                    </div>
                                                    <p style={{ fontSize: '13px', fontWeight: '900', color: i <= statusIndex ? '#111' : '#AAA', marginBottom: '5px' }}>{step}</p>
                                                    <p style={{ fontSize: '11px', color: (i < statusIndex || (i === statusIndex && currentStatus === 'delivered')) ? '#10B981' : i === statusIndex ? '#3B82F6' : '#999', fontWeight: '800' }}>
                                                        {(i < statusIndex || (i === statusIndex && currentStatus === 'delivered')) ? 'COMPLETED' : i === statusIndex ? 'IN PROGRESS' : 'PENDING'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })() : (
                            <div style={{ background: '#FFF', padding: '5rem', borderRadius: '16px', border: '1px solid #F1F1F1', textAlign: 'center' }}>
                                <Package size={48} color="#EEE" style={{ marginBottom: '1.5rem' }} />
                                <p style={{ color: '#999', fontWeight: '700' }}>No active orders to track.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'invoices' && (
                    <div className="fade-in">
                        {orders.filter(o => o.status?.toLowerCase() === 'delivered').length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                                {orders.filter(o => o.status?.toLowerCase() === 'delivered').map((order) => (
                                    <div key={order._id} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '16px', border: '1px solid #F1F1F1', position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '25px', right: '25px', background: '#F0FDFA', color: '#0D9488', padding: '5px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '900' }}>
                                            PAID
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '950', marginBottom: '5px', color: '#111' }}>INV-{order._id.slice(-6).toUpperCase()}</h3>
                                        <p style={{ color: '#999', fontSize: '13px', fontWeight: '700', marginBottom: '1.5rem' }}>Issued on {new Date(order.updatedAt).toLocaleDateString()}</p>
                                        <button 
                                            onClick={() => { setSelectedOrder(order); setShowInvoice(true); }}
                                            style={{ padding: '10px 20px', background: '#111', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                                        >
                                            View Invoice
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ background: '#FFF', padding: '5rem', borderRadius: '16px', border: '1px solid #F1F1F1', textAlign: 'center' }}>
                                <FileText size={48} color="#EEE" style={{ marginBottom: '1.5rem' }} />
                                <p style={{ color: '#999', fontWeight: '700' }}>No invoices available yet. Invoices are generated after delivery.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile-settings' && (
                    <div className="fade-in">
                        <div className="dashboard-content-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                            <form onSubmit={handleUpdateProfile} style={{ background: '#FFF', padding: '3rem', borderRadius: '12px', border: '1px solid #F1F1F1' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '950', marginBottom: '2rem' }}>Account Details</h3>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '900', marginBottom: '10px', color: '#999' }}>FULL NAME</label>
                                    <input 
                                        value={profile.name} 
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        style={{ width: '100%', padding: '15px', border: '1px solid #F1F1F1', borderRadius: '8px', background: '#FBFBFC', fontWeight: '800', marginBottom: '1rem' }} 
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '900', marginBottom: '10px', color: '#999' }}>EMAIL ADDRESS</label>
                                    <input 
                                        value={profile.email} 
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        style={{ width: '100%', padding: '15px', border: '1px solid #F1F1F1', borderRadius: '8px', background: '#FBFBFC', fontWeight: '800' }} 
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ marginTop: '2rem', padding: '15px 30px' }}>UPDATE ACCOUNT</button>
                            </form>
                            <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid #F1F1F1' }}>
                                <h4 style={{ fontWeight: '900', marginBottom: '1rem' }}>Payment Methods</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#FBFBFC', borderRadius: '8px' }}>
                                    <CreditCard size={20} color="#666" />
                                    <span style={{ fontWeight: '800' }}>Visa ending in 4242</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;

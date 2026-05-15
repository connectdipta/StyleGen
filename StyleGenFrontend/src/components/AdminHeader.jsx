import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, Bell, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const AdminHeader = ({ title }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchAdminNotifications = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                const clearedIds = JSON.parse(localStorage.getItem('admin_cleared_notifications') || '[]');
                
                const alerts = [];
                if (data.pendingOrders > 0 && !clearedIds.includes('pending-orders')) {
                    alerts.push({
                        id: 'pending-orders',
                        title: 'New Orders Pending',
                        message: `You have ${data.pendingOrders} orders waiting for processing.`,
                        type: 'order',
                        icon: <Package size={16} color="#4F46E5" />
                    });
                }
                
                data.recentOrders?.forEach(order => {
                    if (!clearedIds.includes(order._id)) {
                        alerts.push({
                            id: order._id,
                            title: 'Recent Sale',
                            message: `${order.user?.name || 'Guest'} just spent BDT ${order.totalPrice}`,
                            type: 'sale',
                            icon: <TrendingUp size={16} color="#10B981" />
                        });
                    }
                });

                setNotifications(alerts.slice(0, 5));
            } catch (error) {
                console.error('Error fetching admin notifications:', error);
            }
        };
        fetchAdminNotifications();
    }, []);

    const handleMarkAllRead = () => {
        const clearedIds = JSON.parse(localStorage.getItem('admin_cleared_notifications') || '[]');
        const newClearedIds = [...new Set([...clearedIds, ...notifications.map(n => n.id)])];
        localStorage.setItem('admin_cleared_notifications', JSON.stringify(newClearedIds));
        setNotifications([]);
        setShowNotifications(false);
    };

    return (
        <header className="admin-header" style={{
            height: '70px',
            background: '#FFF',
            borderBottom: '1px solid #EEE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 3rem',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            width: 'calc(100% - 260px)',
            marginLeft: '260px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontWeight: '900', fontSize: '14px' }}>S</span>
                    </div>
                    <span style={{ color: '#111', fontWeight: '900', fontSize: '18px', letterSpacing: '-1px' }}>StyleGen <span style={{ color: '#666', fontWeight: '400', fontSize: '14px', marginLeft: '5px' }}>Admin Portal</span></span>
                </Link>
                <div style={{ width: '1px', height: '20px', background: '#EEE', margin: '0 10px' }}></div>
                <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#111', textTransform: 'uppercase', letterSpacing: '1px' }}>{title || 'Dashboard'}</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
                    >
                        <Bell size={20} color="#666" />
                        {notifications.length > 0 && (
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#FF4D1C', width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #FFF', fontSize: '8px', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div style={{ position: 'absolute', top: '40px', right: 0, width: '320px', background: '#FFF', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #F1F1F1', zIndex: 1000, overflow: 'hidden' }}>
                            <div style={{ padding: '1.2rem', borderBottom: '1px solid #F1F1F1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0, fontWeight: '950', fontSize: '14px' }}>System Alerts</h4>
                                <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer' }} onClick={handleMarkAllRead}>CLEAR ALL</span>
                            </div>
                            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                {notifications.length > 0 ? notifications.map(notif => (
                                    <div key={notif.id} style={{ padding: '1.2rem', borderBottom: '1px solid #F9FAFB', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={(e) => e.currentTarget.style.background = '#FFF'}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {notif.icon}
                                            </div>
                                            <div>
                                                <h5 style={{ margin: '0 0 4px 0', fontWeight: '800', fontSize: '13px' }}>{notif.title}</h5>
                                                <p style={{ margin: 0, color: '#666', fontSize: '12px', lineHeight: '1.4' }}>{notif.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#AAA' }}>
                                        <Bell size={32} style={{ marginBottom: '10px', opacity: 0.3 }} />
                                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '700' }}>No active alerts</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #EEE', paddingLeft: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: '800', margin: 0 }}>{user?.name || 'Admin User'}</p>
                        <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>{user?.role === 'admin' ? 'Super Admin' : 'Staff'}</p>
                    </div>
                    <div style={{ width: '35px', height: '35px', background: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="#666" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;

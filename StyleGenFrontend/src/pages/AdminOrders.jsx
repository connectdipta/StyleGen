import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import api from '../api/api';
import { Clock, CheckCircle, Truck, XCircle, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data.orders || data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return { color: '#F59E0B', bg: '#FFFBEB', icon: <Clock size={14} /> };
            case 'shipped': return { color: '#3B82F6', bg: '#EFF6FF', icon: <Truck size={14} /> };
            case 'delivered': return { color: '#10B981', bg: '#F0FDFA', icon: <CheckCircle size={14} /> };
            case 'cancelled': return { color: '#EF4444', bg: '#FEF2F2', icon: <XCircle size={14} /> };
            default: return { color: '#6B7280', bg: '#F3F4F6', icon: <Clock size={14} /> };
        }
    };

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', background: '#F9FAFB' }}>
            <AdminSidebar />
            <AdminHeader title="Order Management" />

            <main className="dashboard-main" style={{ marginLeft: '260px', padding: '2rem 3rem' }}>
                <header className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111' }}>Orders Management</h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>Track and manage your customer orders.</p>
                </header>

                <div className="table-container" style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #EEE', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #EEE' }}>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#999', letterSpacing: '1px' }}>ORDER ID</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#999', letterSpacing: '1px' }}>CUSTOMER</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#999', letterSpacing: '1px' }}>TOTAL</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#999', letterSpacing: '1px' }}>STATUS</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#999', letterSpacing: '1px' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : (
                                orders.length > 0 ? orders.map((order) => {
                                    const styles = getStatusStyles(order.status || 'pending');
                                    return (
                                        <tr key={order._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                            <td style={{ padding: '20px', fontWeight: '800', fontSize: '12px', color: '#111' }}>#{order._id.slice(-6).toUpperCase()}</td>
                                            <td style={{ padding: '20px', fontWeight: '700', fontSize: '14px', color: '#444' }}>{order.user?.name?.toUpperCase() || 'GUEST USER'}</td>
                                            <td style={{ padding: '20px', fontWeight: '900', fontSize: '14px', color: '#111' }}>BDT {order.totalPrice}</td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ 
                                                    display: 'inline-flex', 
                                                    alignItems: 'center', 
                                                    gap: '8px', 
                                                    padding: '6px 14px', 
                                                    borderRadius: '50px',
                                                    background: styles.bg,
                                                    color: styles.color,
                                                    fontSize: '11px',
                                                    fontWeight: '900',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {styles.icon}
                                                    {order.status || 'pending'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ position: 'relative', width: 'fit-content' }}>
                                                    <select 
                                                        value={order.status || 'pending'}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        style={{ 
                                                            padding: '8px 15px', 
                                                            borderRadius: '6px', 
                                                            border: '1px solid #EEE', 
                                                            background: '#FFF', 
                                                            fontSize: '12px', 
                                                            fontWeight: '800',
                                                            cursor: 'pointer',
                                                            outline: 'none',
                                                            appearance: 'none',
                                                            paddingRight: '35px'
                                                        }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999' }}>
                                                        <ChevronDown size={14} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan="5" style={{ padding: '5rem', textAlign: 'center', color: '#999', fontWeight: '700' }}>No customer orders found in the database.</td></tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminOrders;


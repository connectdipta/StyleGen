import { useState, useEffect } from 'react';
import api from '../api/api';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStatsData(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Customers', value: statsData?.totalCustomers || '0', grow: '+0%', color: '#4F46E5' },
        { label: 'Total Products', value: statsData?.totalProducts || '0', grow: '+0%', color: '#10B981' },
        { label: 'Total Sales', value: `BDT ${statsData?.totalSales?.toLocaleString() || '0'}`, grow: '+0%', color: '#F59E0B' },
        { label: 'Pending Orders', value: statsData?.pendingOrders || '0', grow: '+0%', color: '#EF4444' },
    ];

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', background: '#F9FAFB' }}>
            <AdminSidebar />
            <AdminHeader title="Dashboard Overview" />

            <main style={{ marginLeft: '260px', padding: '2rem 3rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111' }}>Dashboard Overview</h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>Welcome back! Here's what's happening with your store today.</p>
                </div>

                {/* Stats Grid */}
                <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat) => (
                        <div key={stat.label} style={{ background: '#FFF', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #EEE' }}>
                            <p style={{ fontSize: '14px', color: '#666', fontWeight: '600', marginBottom: '8px' }}>{stat.label}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111' }}>{stat.value}</h2>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: stat.grow.startsWith('+') ? '#10B981' : '#EF4444', background: stat.grow.startsWith('+') ? '#ECFDF5' : '#FEF2F2', padding: '2px 8px', borderRadius: '20px' }}>
                                    {stat.grow}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Mock */}
                <div className="table-container" style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #EEE', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: '800' }}>Recent Orders</h3>
                        <button style={{ color: 'var(--primary)', fontWeight: '700', border: 'none', background: 'none' }}>View All</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB' }}>
                                <th style={{ padding: '12px 20px', fontSize: '13px', color: '#666' }}>ORDER ID</th>
                                <th style={{ padding: '12px 20px', fontSize: '13px', color: '#666' }}>CUSTOMER</th>
                                <th style={{ padding: '12px 20px', fontSize: '13px', color: '#666' }}>STATUS</th>
                                <th style={{ padding: '12px 20px', fontSize: '13px', color: '#666' }}>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statsData?.recentOrders?.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '15px 20px', fontWeight: '600' }}>#{order._id.slice(-6).toUpperCase()}</td>
                                    <td style={{ padding: '15px 20px' }}>{order.user?.name || 'Guest User'}</td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <span style={{
                                            background: (order.status?.toLowerCase() || 'pending') === 'delivered' ? '#ECFDF5' : '#E0F2FE',
                                            color: (order.status?.toLowerCase() || 'pending') === 'delivered' ? '#065F46' : '#0369A1',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            textTransform: 'capitalize'
                                        }}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 20px', fontWeight: '700' }}>BDT {order.totalPrice}</td>
                                </tr>
                            ))}
                            {(!statsData?.recentOrders || statsData.recentOrders.length === 0) && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No recent orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

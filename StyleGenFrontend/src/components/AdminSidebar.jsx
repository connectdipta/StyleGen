import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, Users, ShoppingBag, FolderTree, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Products', path: '/admin/products', icon: <Box size={20} /> },
        { name: 'Users', path: '/admin/customers', icon: <Users size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
        { name: 'Categories', path: '/admin/categories', icon: <FolderTree size={20} /> },
    ];

    return (
        <div className="dashboard-sidebar">
            <div style={{ marginBottom: '3rem', paddingLeft: '10px' }}>
                <h2 style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1.5rem' }}>StyleGen</h2>
                <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>ADMIN PANEL</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 15px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: location.pathname === item.path ? 'var(--primary)' : '#555',
                            background: location.pathname === item.path ? '#FFF5F2' : 'transparent',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.3s'
                        }}
                    >
                        {item.icon}
                        {item.name}
                    </Link>
                ))}
            </div>

            <div style={{ position: 'absolute', bottom: '2rem', left: '1.5rem', right: '1.5rem' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 15px',
                        width: '100%',
                        border: 'none',
                        background: '#F9F9F9',
                        borderRadius: '8px',
                        color: '#666',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
